import { NextRequest, NextResponse } from "next/server";
import { jsonrepair } from "jsonrepair";
import { generateRequestSchema, type GenerateResponse } from "@/lib/schemas";
import { getPatientById } from "@/lib/data/patients";
import { getMockResponse } from "@/lib/data/mock-responses";
import { generateWithProvider, streamWithProvider, validateLLMResult, LiveProvider } from "@/lib/llm";
import { getServerEnv } from "@/lib/env";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; 
// Periodic cleanup of expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, CLEANUP_INTERVAL_MS);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = generateRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    const body = rawBody as Record<string, unknown> | null;
    const firstIssue = parsed.error.issues[0];
    const topField = firstIssue.path[0] as string | undefined;

    let message: string;
    if (topField === "channels" && firstIssue.code === "too_small") {
      message = "At least one channel is required";
    } else if (topField && body && topField in body && body[topField] !== undefined) {
      // Field was provided but has an invalid value — derive singular name for arrays
      const fieldName = topField === "channels" ? "channel" : topField;
      message = `Invalid ${fieldName} value`;
    } else {
      // Derive missing field names from Zod issues instead of hardcoding
      const missingFields = parsed.error.issues
        .map((i) => i.path[0])
        .filter((f, idx, arr) => f !== undefined && arr.indexOf(f) === idx);
      message = missingFields.length > 0
        ? `Missing required fields: ${missingFields.join(", ")}`
        : "Invalid request";
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { patientId, goal, tone, channels, provider, accessCode } = parsed.data;

  const patient = getPatientById(patientId);
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  if (provider === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockResponse = getMockResponse(patientId, goal, tone, channels);
    return NextResponse.json({
      ...mockResponse,
      generatedAt: new Date().toISOString(),
    });
  }

  const expectedCode = getServerEnv().DEMO_ACCESS_CODE;
  if (!expectedCode || accessCode !== expectedCode) {
    return NextResponse.json(
      { error: "Invalid access code" },
      { status: 401 }
    );
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  const wantsStream = request.headers.get("accept") === "text/event-stream";

  if (wantsStream) {
    return handleStreamingRequest(provider, patient, goal, tone, channels);
  }

  try {
    const result = await generateWithProvider(provider, {
      patient,
      goal,
      tone,
      channels,
    });

    const filteredMessages = result.channelMessages.filter((cm) =>
      channels.includes(cm.channel)
    );

    const response: GenerateResponse = {
      channelMessages: filteredMessages,
      provider,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error(`[${provider}] Generation error:`, err);
    const { message, category } = classifyError(err);
    return NextResponse.json({ error: message, category }, { status: 500 });
  }
}

type ErrorCategory = "transient" | "configuration";

function classifyError(err: unknown): { message: string; category: ErrorCategory } {
  const raw = err instanceof Error ? err.message : String(err);

  // Configuration errors — missing/invalid API keys, env issues
  if (/API_KEY|not configured|environment variable|api.?key.*not valid|invalid.*api.?key|authentication failed|unauthorized/i.test(raw)) {
    return { message: "AI service is not configured. Please contact the administrator.", category: "configuration" };
  }

  // Transient errors — rate limits, timeouts, network, overloaded
  if (/rate.?limit|quota|429|timeout|timed?.?out|ECONNREFUSED|ENOTFOUND|fetch failed|overloaded|503|529|capacity/i.test(raw)) {
    return { message: "The AI service is temporarily unavailable. Please try again.", category: "transient" };
  }

  // Validation errors — malformed LLM response
  if (/Invalid LLM response|No valid JSON|No text response|No structured output/i.test(raw)) {
    return { message: "The AI model returned an unexpected response. Please try again.", category: "transient" };
  }

  // Default — don't expose raw error
  return { message: "Something went wrong generating messages. Please try again.", category: "transient" };
}

function extractFirstJson(text: string): string | null {
  let depth = 0, start = -1;
  let inString = false, escapeNext = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escapeNext) { escapeNext = false; continue; }
    if (ch === "\\" && inString) { escapeNext = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") { if (depth++ === 0) start = i; }
    else if (ch === "}") { if (--depth === 0 && start !== -1) return text.slice(start, i + 1); }
  }
  return null;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(jsonrepair(text));
  }
}

function handleStreamingRequest(
  provider: LiveProvider,
  patient: Parameters<typeof generateWithProvider>[1]["patient"],
  goal: Parameters<typeof generateWithProvider>[1]["goal"],
  tone: Parameters<typeof generateWithProvider>[1]["tone"],
  channels: Parameters<typeof generateWithProvider>[1]["channels"]
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const gen = streamWithProvider(provider, {
          patient,
          goal,
          tone,
          channels,
        });

        let fullText = "";

        for await (const chunk of gen) {
          fullText += chunk;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "chunk", text: chunk })}\n\n`)
          );
        }

        // Extract first complete JSON object from response (handles markdown fences, trailing text)
        const extractedJson = extractFirstJson(fullText);
        if (!extractedJson) {
          throw new Error("No valid JSON found in streamed response");
        }
        // Parse the complete JSON and apply channel filtering
        const parsed = validateLLMResult(safeJsonParse(extractedJson));
        const filteredMessages = parsed.channelMessages.filter(
          (cm: { channel: string }) => channels.includes(cm.channel as typeof channels[number])
        );

        const response: GenerateResponse = {
          channelMessages: filteredMessages,
          provider,
          generatedAt: new Date().toISOString(),
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done", response })}\n\n`)
        );
      } catch (err) {
        console.error(`[${provider}] Streaming error:`, err);
        const { message, category } = classifyError(err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: message, category })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

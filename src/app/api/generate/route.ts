import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, GenerateResponse } from "@/lib/types";
import { getPatientById } from "@/lib/data/patients";
import { getMockResponse } from "@/lib/data/mock-responses";
import { generateWithProvider, streamWithProvider, validateLLMResult, LiveProvider } from "@/lib/llm";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// Periodic cleanup of expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, CLEANUP_INTERVAL_MS);

const VALID_PROVIDERS = new Set(["mock", "claude", "gemini", "gemini-lite", "gemini-preview"]);
const VALID_CHANNELS = new Set(["sms", "email", "in-app"]);

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
  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { patientId, goal, tone, channels, provider, accessCode } = body;

  // Validate required fields
  if (!patientId || !goal || !tone || !provider || !Array.isArray(channels)) {
    return NextResponse.json(
      { error: "Missing required fields: patientId, goal, tone, channels, provider" },
      { status: 400 }
    );
  }

  // Validate provider
  if (!VALID_PROVIDERS.has(provider)) {
    return NextResponse.json(
      { error: `Invalid provider: ${provider}` },
      { status: 400 }
    );
  }

  // Validate channels
  if (!channels.every((ch) => VALID_CHANNELS.has(ch))) {
    return NextResponse.json(
      { error: "Invalid channel value" },
      { status: 400 }
    );
  }

  // Validate patient exists
  const patient = getPatientById(patientId);
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  if (channels.length === 0) {
    return NextResponse.json(
      { error: "At least one channel is required" },
      { status: 400 }
    );
  }

  // Mock mode — return pre-generated responses
  if (provider === "mock") {
    // Simulate a small delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockResponse = getMockResponse(patientId, goal, tone, channels);
    return NextResponse.json(mockResponse);
  }

  // Live mode — check access code
  const expectedCode = process.env.DEMO_ACCESS_CODE;
  if (!expectedCode || accessCode !== expectedCode) {
    return NextResponse.json(
      { error: "Invalid access code" },
      { status: 401 }
    );
  }

  // Rate limiting for live API
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  // Check if client wants streaming
  const wantsStream = request.headers.get("accept") === "text/event-stream";

  if (wantsStream) {
    return handleStreamingRequest(provider, patient, goal, tone, channels);
  }

  // Non-streaming fallback
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
    const message =
      err instanceof Error ? err.message : "Failed to generate messages";
    return NextResponse.json({ error: message }, { status: 500 });
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
          // Send chunk as SSE data event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "chunk", text: chunk })}\n\n`)
          );
        }

        // Parse the complete JSON and apply channel filtering
        const parsed = validateLLMResult(JSON.parse(fullText));
        const filteredMessages = parsed.channelMessages.filter(
          (cm: { channel: string }) => channels.includes(cm.channel as typeof channels[number])
        );

        const response: GenerateResponse = {
          channelMessages: filteredMessages,
          provider,
          generatedAt: new Date().toISOString(),
        };

        // Send the final parsed response
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done", response })}\n\n`)
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to generate messages";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: message })}\n\n`)
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

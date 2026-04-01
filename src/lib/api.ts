import { type GenerateRequest, type GenerateResponse, sseEventSchema } from "@/lib/schemas";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

export type ErrorCategory = "transient" | "configuration" | "auth";

export class GenerationError extends Error {
  category: ErrorCategory;
  constructor(message: string, category: ErrorCategory = "transient") {
    super(message);
    this.name = "GenerationError";
    this.category = category;
  }
}

function toGenerationError(res: Response, body: { error?: string; category?: ErrorCategory }): GenerationError {
  const message = body.error || `Request failed: ${res.status}`;
  if (res.status === 401) return new GenerationError(message, "auth");
  if (res.status === 429) return new GenerationError(message, "transient");
  return new GenerationError(message, body.category || "transient");
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateMessages(
  request: GenerateRequest
): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw toGenerationError(res, body);
  }

  return res.json();
}

export interface StreamCallbacks {
  onChunk?: (text: string, accumulated: string) => void;
  onDone: (response: GenerateResponse) => void;
  onError: (error: string, category?: ErrorCategory) => void;
}

export async function generateMessagesStream(
  request: GenerateRequest,
  callbacks: StreamCallbacks
): Promise<void> {
  let lastError: { message: string; category?: ErrorCategory } | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_DELAY_MS * attempt);
    }

    try {
      const result = await attemptStream(request, callbacks);
      if (result === "done") return;

      // result is an error — check if retryable
      lastError = result;
      if (result.category !== "transient") break;
    } catch (err) {
      // Network-level failures are transient
      lastError = {
        message: err instanceof Error ? err.message : "Network error",
        category: "transient",
      };
      if (attempt === MAX_RETRIES) break;
    }
  }

  callbacks.onError(
    lastError?.message || "Failed to generate messages",
    lastError?.category
  );
}

async function attemptStream(
  request: GenerateRequest,
  callbacks: StreamCallbacks
): Promise<"done" | { message: string; category?: ErrorCategory }> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    const err = toGenerationError(res, body);
    return { message: err.message, category: err.category };
  }

  const reader = res.body?.getReader();
  if (!reader) {
    return { message: "No response body", category: "transient" };
  }

  const decoder = new TextDecoder();
  let accumulated = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Normalize CRLF to LF so the parser works with both Next.js (\n) and FastAPI (\r\n) SSE
    buffer = buffer.replace(/\r\n|\r/g, "\n");

    // Parse SSE events from the buffer (split on double newline per spec)
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      // Per SSE spec, concatenate all `data:` lines within one event
      const dataLines = event
        .split("\n")
        .filter((line) => line.startsWith("data: "))
        .map((line) => line.slice(6));
      if (dataLines.length === 0) continue;
      const raw = JSON.parse(dataLines.join("\n"));
      const parsed = sseEventSchema.safeParse(raw);
      if (!parsed.success) {
        return { message: "Received an invalid response from the server", category: "transient" };
      }
      const data = parsed.data;

      if (data.type === "chunk") {
        accumulated += data.text;
        callbacks.onChunk?.(data.text, accumulated);
      } else if (data.type === "done") {
        callbacks.onDone(data.response);
        return "done";
      } else if (data.type === "error") {
        return { message: data.error, category: data.category || "transient" };
      }
    }
  }

  return { message: "Stream ended unexpectedly", category: "transient" };
}

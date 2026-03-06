import { GenerateRequest, GenerateResponse } from "@/lib/types";

export async function generateMessages(
  request: GenerateRequest
): Promise<GenerateResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export interface StreamCallbacks {
  onChunk?: (text: string, accumulated: string) => void;
  onDone: (response: GenerateResponse) => void;
  onError: (error: string) => void;
}

export async function generateMessagesStream(
  request: GenerateRequest,
  callbacks: StreamCallbacks
): Promise<void> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let accumulated = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

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
      const data = JSON.parse(dataLines.join("\n"));

      if (data.type === "chunk") {
        accumulated += data.text;
        callbacks.onChunk?.(data.text, accumulated);
      } else if (data.type === "done") {
        callbacks.onDone(data.response);
        return;
      } else if (data.type === "error") {
        callbacks.onError(data.error);
        return;
      }
    }
  }
}

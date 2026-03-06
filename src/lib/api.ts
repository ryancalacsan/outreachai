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

    // Parse SSE events from the buffer
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = JSON.parse(line.slice(6));

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

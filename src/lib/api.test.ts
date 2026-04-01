import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateMessages, generateMessagesStream, GenerationError } from "./api";
import type { GenerateRequest, GenerateResponse } from "./types";

const mockRequest: GenerateRequest = {
  patientId: "maria",
  goal: "enrollment",
  tone: "warm-supportive",
  channels: ["sms"],
  provider: "mock",
};

const mockResponse: GenerateResponse = {
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content: "Test message",
          engagementLikelihood: "high",
          reasoning: "Test reasoning",
        },
      ],
    },
  ],
  provider: "mock",
  generatedAt: "2026-03-16T00:00:00Z",
};

function makeSSEStream(events: string[]): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(event));
      }
      controller.close();
    },
  });
}

describe("generateMessages", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls fetch with correct URL and body", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    await generateMessages(mockRequest);

    expect(mockFetch).toHaveBeenCalledWith("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockRequest),
    });
  });

  it("returns parsed response on success", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    const result = await generateMessages(mockRequest);
    expect(result).toEqual(mockResponse);
  });

  it("throws GenerationError with error message from response body", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Patient not found" }), {
        status: 404,
      })
    );

    await expect(generateMessages(mockRequest)).rejects.toThrow("Patient not found");
  });

  it("throws GenerationError with auth category for 401", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Invalid access code" }), {
        status: 401,
      })
    );

    try {
      await generateMessages(mockRequest);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(GenerationError);
      expect((err as GenerationError).category).toBe("auth");
    }
  });

  it("throws GenerationError with transient category for 429", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
      })
    );

    try {
      await generateMessages(mockRequest);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(GenerationError);
      expect((err as GenerationError).category).toBe("transient");
    }
  });

  it("throws with 'Unknown error' when body is not JSON", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("Internal Server Error", { status: 500 })
    );

    await expect(generateMessages(mockRequest)).rejects.toThrow("Unknown error");
  });
});

describe("generateMessagesStream", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("calls onChunk for chunk events", async () => {
    const chunks = [
      `data: ${JSON.stringify({ type: "chunk", text: "Hello" })}\n\n`,
      `data: ${JSON.stringify({ type: "chunk", text: " world" })}\n\n`,
      `data: ${JSON.stringify({ type: "done", response: mockResponse })}\n\n`,
    ];

    vi.mocked(fetch).mockResolvedValue(
      new Response(makeSSEStream(chunks), { status: 200 })
    );

    const onChunk = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    await generateMessagesStream(mockRequest, { onChunk, onDone, onError });

    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenCalledWith("Hello", "Hello");
    expect(onChunk).toHaveBeenCalledWith(" world", "Hello world");
    expect(onDone).toHaveBeenCalledWith(mockResponse);
    expect(onError).not.toHaveBeenCalled();
  });

  it("calls onError with category for error events (non-transient skips retry)", async () => {
    const events = [
      `data: ${JSON.stringify({ type: "error", error: "Config issue", category: "configuration" })}\n\n`,
    ];

    vi.mocked(fetch).mockResolvedValue(
      new Response(makeSSEStream(events), { status: 200 })
    );

    const onDone = vi.fn();
    const onError = vi.fn();

    await generateMessagesStream(mockRequest, { onDone, onError });

    expect(onError).toHaveBeenCalledWith("Config issue", "configuration");
    expect(onDone).not.toHaveBeenCalled();
  });

  it("retries transient errors up to MAX_RETRIES then calls onError", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        new Response(
          makeSSEStream([
            `data: ${JSON.stringify({ type: "error", error: "Temporary failure", category: "transient" })}\n\n`,
          ]),
          { status: 200 }
        )
      )
    );

    const onDone = vi.fn();
    const onError = vi.fn();

    const promise = generateMessagesStream(mockRequest, { onDone, onError });
    // Advance past retry delays (1500ms + 3000ms)
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    // 1 initial + 2 retries = 3 fetch calls
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledWith("Temporary failure", "transient");
    expect(onDone).not.toHaveBeenCalled();
  });

  it("succeeds on retry after transient error", async () => {
    const transientError = [
      `data: ${JSON.stringify({ type: "error", error: "Temporary failure", category: "transient" })}\n\n`,
    ];
    const success = [
      `data: ${JSON.stringify({ type: "done", response: mockResponse })}\n\n`,
    ];

    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockResolvedValueOnce(new Response(makeSSEStream(transientError), { status: 200 }))
      .mockResolvedValueOnce(new Response(makeSSEStream(success), { status: 200 }));

    const onDone = vi.fn();
    const onError = vi.fn();

    const promise = generateMessagesStream(mockRequest, { onDone, onError });
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(onDone).toHaveBeenCalledWith(mockResponse);
    expect(onError).not.toHaveBeenCalled();
  });

  it("handles CRLF line endings", async () => {
    const chunk = `data: ${JSON.stringify({ type: "done", response: mockResponse })}\r\n\r\n`;

    vi.mocked(fetch).mockResolvedValue(
      new Response(makeSSEStream([chunk]), { status: 200 })
    );

    const onDone = vi.fn();
    const onError = vi.fn();

    await generateMessagesStream(mockRequest, { onDone, onError });

    expect(onDone).toHaveBeenCalledWith(mockResponse);
  });

  it("retries when stream ends unexpectedly then calls onError", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        new Response(
          new ReadableStream({ start(controller) { controller.close(); } }),
          { status: 200 }
        )
      )
    );

    const onDone = vi.fn();
    const onError = vi.fn();

    const promise = generateMessagesStream(mockRequest, { onDone, onError });
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    // Retries for transient "Stream ended unexpectedly"
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledWith("Stream ended unexpectedly", "transient");
    expect(onDone).not.toHaveBeenCalled();
  });

  it("calls onError for non-ok response with auth category", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Invalid access code" }), { status: 401 })
    );

    const onDone = vi.fn();
    const onError = vi.fn();

    await generateMessagesStream(mockRequest, { onDone, onError });

    expect(onError).toHaveBeenCalledWith("Invalid access code", "auth");
    expect(onDone).not.toHaveBeenCalled();
  });

  it("retries network failures then calls onError", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValue(new Error("fetch failed"));

    const onDone = vi.fn();
    const onError = vi.fn();

    const promise = generateMessagesStream(mockRequest, { onDone, onError });
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledWith("fetch failed", "transient");
  });
});

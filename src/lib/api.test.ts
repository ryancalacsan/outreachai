import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateMessages, generateMessagesStream } from "./api";
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

  it("throws with error message from response body", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Patient not found" }), {
        status: 404,
      })
    );

    await expect(generateMessages(mockRequest)).rejects.toThrow("Patient not found");
  });

  it("throws with status code when body is not JSON", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("Internal Server Error", { status: 500 })
    );

    await expect(generateMessages(mockRequest)).rejects.toThrow("Unknown error");
  });
});

describe("generateMessagesStream", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls onChunk for chunk events", async () => {
    const chunks = [
      `data: ${JSON.stringify({ type: "chunk", text: "Hello" })}\n\n`,
      `data: ${JSON.stringify({ type: "chunk", text: " world" })}\n\n`,
      `data: ${JSON.stringify({ type: "done", response: mockResponse })}\n\n`,
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    vi.mocked(fetch).mockResolvedValue(new Response(stream, { status: 200 }));

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

  it("calls onError for error events", async () => {
    const chunks = [
      `data: ${JSON.stringify({ type: "error", error: "Something went wrong" })}\n\n`,
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    vi.mocked(fetch).mockResolvedValue(new Response(stream, { status: 200 }));

    const onDone = vi.fn();
    const onError = vi.fn();

    await generateMessagesStream(mockRequest, { onDone, onError });

    expect(onError).toHaveBeenCalledWith("Something went wrong");
    expect(onDone).not.toHaveBeenCalled();
  });

  it("handles CRLF line endings", async () => {
    const chunk = `data: ${JSON.stringify({ type: "done", response: mockResponse })}\r\n\r\n`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    });

    vi.mocked(fetch).mockResolvedValue(new Response(stream, { status: 200 }));

    const onDone = vi.fn();
    const onError = vi.fn();

    await generateMessagesStream(mockRequest, { onDone, onError });

    expect(onDone).toHaveBeenCalledWith(mockResponse);
  });

  it("calls onError when stream ends unexpectedly", async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    vi.mocked(fetch).mockResolvedValue(new Response(stream, { status: 200 }));

    const onDone = vi.fn();
    const onError = vi.fn();

    await generateMessagesStream(mockRequest, { onDone, onError });

    expect(onError).toHaveBeenCalledWith("Stream ended unexpectedly");
    expect(onDone).not.toHaveBeenCalled();
  });

  it("throws when response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    );

    const onDone = vi.fn();
    const onError = vi.fn();

    await expect(
      generateMessagesStream(mockRequest, { onDone, onError })
    ).rejects.toThrow("Unauthorized");
  });

  it("throws when response body is null", async () => {
    const response = new Response(null, { status: 200 });
    // Override body to null to simulate no body
    Object.defineProperty(response, "body", { value: null });
    vi.mocked(fetch).mockResolvedValue(response);

    const onDone = vi.fn();
    const onError = vi.fn();

    await expect(
      generateMessagesStream(mockRequest, { onDone, onError })
    ).rejects.toThrow("No response body");
  });
});

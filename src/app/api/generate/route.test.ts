import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { resetEnvCache } from "@/lib/env";

// Mock LLM module before importing route
vi.mock("@/lib/llm", () => ({
  generateWithProvider: vi.fn().mockResolvedValue({
    channelMessages: [
      {
        channel: "sms",
        variants: [
          {
            id: "sms-a",
            approach: "Test",
            content: "Test message",
            engagementLikelihood: "high",
            reasoning: "Test",
          },
        ],
      },
    ],
  }),
  streamWithProvider: vi.fn(),
  validateLLMResult: vi.fn((v) => v),
}));

const { POST } = await import("./route");

function makeRequest(
  body: Record<string, unknown>,
  headers?: Record<string, string>
): NextRequest {
  return new NextRequest("http://localhost:3000/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  patientId: "maria",
  goal: "enrollment",
  tone: "warm-supportive",
  channels: ["sms"],
  provider: "mock",
};

// Helper: call POST for mock mode with timer advancement
async function postMock(body: Record<string, unknown>) {
  const promise = POST(makeRequest(body));
  // Advance past the 800ms setTimeout in mock mode
  await vi.advanceTimersByTimeAsync(1000);
  return promise;
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    resetEnvCache();
    vi.stubEnv("DEMO_ACCESS_CODE", "test-code");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    resetEnvCache();
  });

  describe("validation", () => {
    it("returns 400 for invalid JSON", async () => {
      const req = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid JSON");
    });

    it("returns 400 for missing required fields", async () => {
      const res = await POST(makeRequest({ patientId: "maria" }));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Missing required fields");
    });

    it("returns 400 for invalid provider", async () => {
      const res = await POST(
        makeRequest({ ...validBody, provider: "invalid" })
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid provider");
    });

    it("returns 400 for invalid goal", async () => {
      const res = await POST(makeRequest({ ...validBody, goal: "invalid" }));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid goal");
    });

    it("returns 400 for invalid tone", async () => {
      const res = await POST(makeRequest({ ...validBody, tone: "invalid" }));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid tone");
    });

    it("returns 400 for invalid channel", async () => {
      const res = await POST(
        makeRequest({ ...validBody, channels: ["telegram"] })
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid channel");
    });

    it("returns 404 for unknown patient", async () => {
      const res = await POST(
        makeRequest({ ...validBody, patientId: "unknown" })
      );
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toContain("Patient not found");
    });

    it("returns 400 for empty channels array", async () => {
      const res = await POST(makeRequest({ ...validBody, channels: [] }));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("At least one channel");
    });

    it("returns 400 for empty channels with unknown patient — Zod validates before patient lookup", async () => {
      const res = await POST(
        makeRequest({ ...validBody, patientId: "unknown", channels: [] })
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("At least one channel");
    });
  });

  describe("mock mode", () => {
    it("returns mock response with correct shape", async () => {
      const res = await postMock(validBody);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("channelMessages");
      expect(data).toHaveProperty("provider", "mock");
      expect(data).toHaveProperty("generatedAt");
    });
  });

  describe("live mode", () => {
    it("returns 401 without access code", async () => {
      const res = await POST(
        makeRequest({ ...validBody, provider: "gemini" })
      );
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Invalid access code");
    });

    it("returns 401 with wrong access code", async () => {
      const res = await POST(
        makeRequest({
          ...validBody,
          provider: "gemini",
          accessCode: "wrong",
        })
      );
      expect(res.status).toBe(401);
    });

    it("succeeds with correct access code", async () => {
      const res = await POST(
        makeRequest({
          ...validBody,
          provider: "gemini",
          accessCode: "test-code",
        })
      );
      expect(res.status).toBe(200);
    });

    it("returns 429 when rate limited", async () => {
      // Use a unique IP to avoid cross-test state pollution in rateLimitMap
      const uniqueIp = `rate-limit-test-${Date.now()}`;
      // Make 10 requests to exhaust rate limit
      for (let i = 0; i < 10; i++) {
        await POST(
          makeRequest(
            {
              ...validBody,
              provider: "gemini",
              accessCode: "test-code",
            },
            { "x-forwarded-for": uniqueIp }
          )
        );
      }

      // 11th should be rate limited
      const res = await POST(
        makeRequest(
          {
            ...validBody,
            provider: "gemini",
            accessCode: "test-code",
          },
          { "x-forwarded-for": uniqueIp }
        )
      );
      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.error).toContain("Rate limit");
    });
  });

  describe("streaming", () => {
    it("returns SSE response when Accept is text/event-stream", async () => {
      const { streamWithProvider } = await import("@/lib/llm");
      vi.mocked(streamWithProvider).mockReturnValue(
        (async function* () {
          yield '{"channelMessages":[]}';
        })()
      );

      const res = await POST(
        makeRequest(
          {
            ...validBody,
            provider: "gemini",
            accessCode: "test-code",
          },
          { accept: "text/event-stream", "x-forwarded-for": "10.0.0.1" }
        )
      );
      expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    });
  });

  describe("accepts all valid enum values", () => {
    it("accepts all valid goals in mock mode", async () => {
      const goals = [
        "enrollment",
        "onboarding",
        "appointment-reminder",
        "re-engagement",
        "win-back",
        "educational",
      ];
      for (const goal of goals) {
        const res = await postMock({ ...validBody, goal });
        expect(res.status).toBe(200);
      }
    });

    it("accepts all valid tones in mock mode", async () => {
      const tones = [
        "warm-supportive",
        "clinical-informative",
        "urgent-action",
        "casual-friendly",
      ];
      for (const tone of tones) {
        const res = await postMock({ ...validBody, tone });
        expect(res.status).toBe(200);
      }
    });

    it("accepts all valid channels in mock mode", async () => {
      const channels = ["sms", "email", "in-app"];
      for (const channel of channels) {
        const res = await postMock({ ...validBody, channels: [channel] });
        expect(res.status).toBe(200);
      }
    });
  });
});

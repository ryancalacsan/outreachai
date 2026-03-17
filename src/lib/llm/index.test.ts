import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateLLMResult } from "./index";
import type { Patient } from "@/lib/types";

// Mock the provider modules
vi.mock("./claude", () => ({
  generateWithClaude: vi.fn().mockResolvedValue({
    channelMessages: [{ channel: "sms", variants: [] }],
  }),
}));
vi.mock("./gemini", () => ({
  generateWithGemini: vi.fn().mockResolvedValue({
    channelMessages: [{ channel: "sms", variants: [] }],
  }),
}));
vi.mock("./claude-stream", () => ({
  streamWithClaude: vi.fn(),
}));
vi.mock("./gemini-stream", () => ({
  streamWithGemini: vi.fn(),
}));

// Import after mocking
const { generateWithProvider, streamWithProvider } = await import("./index");
const { generateWithClaude } = await import("./claude");
const { generateWithGemini } = await import("./gemini");
const { streamWithClaude } = await import("./claude-stream");
const { streamWithGemini } = await import("./gemini-stream");

const mockPatient: Patient = {
  id: "test",
  name: "Test Patient",
  age: 30,
  lifecycleStage: "eligible",
  careProgram: "pregnancy",
  riskLevel: "low",
  preferredChannel: "sms",
  language: "English",
  insuranceType: "Test Plan",
  careTeam: { nurseName: "Nurse A", providerName: "Dr. B" },
  riskFactors: [],
  recentInteractions: [],
  clinicalNotes: "Test notes",
  enrollmentDate: null,
  lastInteractionDate: null,
  missedAppointments: 0,
};

const mockParams = {
  patient: mockPatient,
  goal: "enrollment" as const,
  tone: "warm-supportive" as const,
  channels: ["sms" as const],
};

describe("validateLLMResult", () => {
  it("returns valid result with channelMessages array", () => {
    const input = { channelMessages: [{ channel: "sms", variants: [] }] };
    expect(validateLLMResult(input)).toEqual(input);
  });

  it("throws for null input", () => {
    expect(() => validateLLMResult(null)).toThrow("missing channelMessages array");
  });

  it("throws for undefined input", () => {
    expect(() => validateLLMResult(undefined)).toThrow("missing channelMessages array");
  });

  it("throws when channelMessages is missing", () => {
    expect(() => validateLLMResult({ foo: "bar" })).toThrow(
      "missing channelMessages array"
    );
  });

  it("throws when channelMessages is not an array", () => {
    expect(() => validateLLMResult({ channelMessages: "not-array" })).toThrow(
      "missing channelMessages array"
    );
  });

  it("throws for a primitive", () => {
    expect(() => validateLLMResult(42)).toThrow("missing channelMessages array");
  });
});

describe("generateWithProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("routes claude to generateWithClaude", async () => {
    await generateWithProvider("claude", mockParams);
    expect(generateWithClaude).toHaveBeenCalledWith(mockParams);
  });

  it("routes gemini to generateWithGemini with correct model", async () => {
    await generateWithProvider("gemini", mockParams);
    expect(generateWithGemini).toHaveBeenCalledWith(mockParams, "gemini-2.5-flash");
  });

  it("routes gemini-lite to generateWithGemini with lite model", async () => {
    await generateWithProvider("gemini-lite", mockParams);
    expect(generateWithGemini).toHaveBeenCalledWith(
      mockParams,
      "gemini-2.5-flash-lite"
    );
  });

  it("routes gemini-preview to generateWithGemini with preview model", async () => {
    await generateWithProvider("gemini-preview", mockParams);
    expect(generateWithGemini).toHaveBeenCalledWith(
      mockParams,
      "gemini-3.1-flash-lite-preview"
    );
  });

  it("throws for unknown provider", async () => {
    await expect(
      generateWithProvider("unknown" as never, mockParams)
    ).rejects.toThrow("Unknown provider");
  });
});

describe("streamWithProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("routes claude to streamWithClaude", () => {
    streamWithProvider("claude", mockParams);
    expect(streamWithClaude).toHaveBeenCalledWith(mockParams);
  });

  it("routes gemini to streamWithGemini with correct model", () => {
    streamWithProvider("gemini", mockParams);
    expect(streamWithGemini).toHaveBeenCalledWith(mockParams, "gemini-2.5-flash");
  });

  it("routes gemini-lite to streamWithGemini with lite model", () => {
    streamWithProvider("gemini-lite", mockParams);
    expect(streamWithGemini).toHaveBeenCalledWith(
      mockParams,
      "gemini-2.5-flash-lite"
    );
  });

  it("routes gemini-preview to streamWithGemini with preview model", () => {
    streamWithProvider("gemini-preview", mockParams);
    expect(streamWithGemini).toHaveBeenCalledWith(
      mockParams,
      "gemini-3.1-flash-lite-preview"
    );
  });

  it("throws for unknown provider", () => {
    expect(() => streamWithProvider("unknown" as never, mockParams)).toThrow(
      "Unknown provider"
    );
  });
});

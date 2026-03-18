import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";
import { getMockResponse } from "./mock-responses";

describe("getMockResponse", () => {
  describe("exact match", () => {
    it("returns response for exact patient-goal-tone key", () => {
      const res = getMockResponse("maria", "enrollment", "warm-supportive", [
        "sms",
        "email",
      ]);
      expect(res.provider).toBe("mock");
      expect(res.generatedAt).toBeTruthy();
      expect(res.channelMessages.length).toBeGreaterThan(0);
    });
  });

  describe("fallback chain", () => {
    it("falls back to same goal, different tone", () => {
      // maria-enrollment-urgent-action doesn't exist, but maria-enrollment-warm-supportive does
      const res = getMockResponse("maria", "enrollment", "urgent-action", [
        "sms",
        "email",
        "in-app",
      ]);
      expect(res.provider).toBe("mock");
      expect(res.channelMessages.length).toBeGreaterThan(0);
    });

    it("falls back to same tone, different goal", () => {
      // maria-re-engagement-warm-supportive doesn't exist, but maria has warm-supportive entries
      const res = getMockResponse("maria", "re-engagement", "warm-supportive", [
        "sms",
      ]);
      expect(res.provider).toBe("mock");
    });

    it("falls back to patient's first scenario", () => {
      // maria with a completely unmatched goal and tone
      const res = getMockResponse("maria", "win-back", "urgent-action", ["sms"]);
      expect(res.provider).toBe("mock");
    });

    it("falls back to default for unknown patient", () => {
      const res = getMockResponse("unknown", "enrollment", "warm-supportive", [
        "sms",
      ]);
      expect(res.provider).toBe("mock");
      expect(res.channelMessages.length).toBeGreaterThan(0);
    });
  });

  describe("channel filtering", () => {
    it("returns only requested channels", () => {
      const res = getMockResponse("maria", "enrollment", "warm-supportive", [
        "sms",
      ]);
      const channels = res.channelMessages.map((cm) => cm.channel);
      expect(channels).toEqual(["sms"]);
    });

    it("returns multiple requested channels", () => {
      const res = getMockResponse("maria", "enrollment", "warm-supportive", [
        "sms",
        "email",
      ]);
      const channels = res.channelMessages.map((cm) => cm.channel);
      expect(channels).toContain("sms");
      expect(channels).toContain("email");
    });

    it("returns empty array when no channels match", () => {
      const res = getMockResponse("maria", "enrollment", "warm-supportive", []);
      expect(res.channelMessages).toEqual([]);
    });
  });

  describe("JSON sync", () => {
    it("TypeScript and Python JSON files are identical", () => {
      const tsPath = resolve(__dirname, "mock-responses.json");
      const pyPath = resolve(__dirname, "../../../backend/app/data/mock_responses.json");
      const tsData = JSON.parse(readFileSync(tsPath, "utf-8"));
      const pyData = JSON.parse(readFileSync(pyPath, "utf-8"));
      expect(tsData).toEqual(pyData);
    });
  });

  describe("response shape", () => {
    it("has required top-level fields", () => {
      const res = getMockResponse("keisha", "re-engagement", "warm-supportive", [
        "sms",
        "email",
        "in-app",
      ]);
      expect(res).toHaveProperty("channelMessages");
      expect(res).toHaveProperty("provider", "mock");
      expect(res).toHaveProperty("generatedAt");
    });

    it("each channel has variants with expected shape", () => {
      const res = getMockResponse("maria", "enrollment", "warm-supportive", [
        "sms",
      ]);
      const sms = res.channelMessages.find((cm) => cm.channel === "sms");
      expect(sms).toBeDefined();
      expect(sms!.variants.length).toBeGreaterThan(0);
      const variant = sms!.variants[0];
      expect(variant).toHaveProperty("id");
      expect(variant).toHaveProperty("approach");
      expect(variant).toHaveProperty("content");
      expect(variant).toHaveProperty("engagementLikelihood");
      expect(variant).toHaveProperty("reasoning");
    });
  });
});

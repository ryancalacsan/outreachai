import { describe, it, expect, vi, afterEach } from "vitest";
import {
  lifecycleStageLabels,
  careProgramLabels,
  riskLevelLabels,
  goalLabels,
  toneLabels,
  channelLabels,
  lifecycleStageColors,
  riskLevelColors,
  formatDate,
  daysSince,
} from "./format";

describe("formatDate", () => {
  it("formats a date string to en-US short format", () => {
    // Use T12:00:00 to avoid timezone boundary issues in jsdom
    expect(formatDate("2026-01-15T12:00:00")).toBe("Jan 15, 2026");
  });

  it("formats another date correctly", () => {
    expect(formatDate("2025-12-01T12:00:00")).toBe("Dec 1, 2025");
  });

  it("handles leap day", () => {
    expect(formatDate("2024-02-29T12:00:00")).toBe("Feb 29, 2024");
  });
});

describe("daysSince", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 for today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T12:00:00Z"));
    expect(daysSince("2026-03-16")).toBe(0);
  });

  it("returns correct number of days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T12:00:00Z"));
    expect(daysSince("2026-03-06")).toBe(10);
  });

  it("returns a large number for distant past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T12:00:00Z"));
    expect(daysSince("2025-03-16")).toBe(365);
  });
});

describe("label maps", () => {
  it("lifecycleStageLabels has all 5 stages", () => {
    const keys = Object.keys(lifecycleStageLabels);
    expect(keys).toHaveLength(5);
    expect(keys).toEqual(
      expect.arrayContaining(["eligible", "onboarding", "engaged", "at-risk", "lapsed"])
    );
  });

  it("careProgramLabels has all 4 programs", () => {
    expect(Object.keys(careProgramLabels)).toHaveLength(4);
    expect(careProgramLabels.pregnancy).toBe("Pregnancy");
    expect(careProgramLabels.midlife).toBe("Midlife / Menopause");
  });

  it("riskLevelLabels has all 3 levels", () => {
    expect(Object.keys(riskLevelLabels)).toHaveLength(3);
    expect(riskLevelLabels.high).toBe("High Risk");
  });

  it("goalLabels has all 6 goals", () => {
    expect(Object.keys(goalLabels)).toHaveLength(6);
    expect(goalLabels.enrollment).toBe("Enrollment");
    expect(goalLabels["win-back"]).toBe("Win-back");
  });

  it("toneLabels has all 4 tones", () => {
    expect(Object.keys(toneLabels)).toHaveLength(4);
    expect(toneLabels["warm-supportive"]).toBe("Warm & Supportive");
  });

  it("channelLabels has all 3 channels", () => {
    expect(Object.keys(channelLabels)).toHaveLength(3);
    expect(channelLabels.sms).toBe("SMS");
    expect(channelLabels["in-app"]).toBe("In-App");
  });
});

describe("color maps", () => {
  it("lifecycleStageColors has bg and text classes for each stage", () => {
    for (const value of Object.values(lifecycleStageColors)) {
      expect(value).toMatch(/bg-/);
      expect(value).toMatch(/text-/);
    }
    expect(Object.keys(lifecycleStageColors)).toHaveLength(5);
  });

  it("riskLevelColors has bg and text classes for each level", () => {
    for (const value of Object.values(riskLevelColors)) {
      expect(value).toMatch(/bg-/);
      expect(value).toMatch(/text-/);
    }
    expect(Object.keys(riskLevelColors)).toHaveLength(3);
  });
});

import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "./outreach";
import { getPatientById } from "@/lib/data/patients";


describe("buildSystemPrompt", () => {
  it("includes SMS channel rules for sms channel", () => {
    const prompt = buildSystemPrompt(["sms"]);
    expect(prompt).toContain("SMS:");
    expect(prompt).toContain("300 characters");
  });

  it("includes email channel rules for email channel", () => {
    const prompt = buildSystemPrompt(["email"]);
    expect(prompt).toContain("Email:");
    expect(prompt).toContain("subject line");
  });

  it("includes in-app channel rules", () => {
    const prompt = buildSystemPrompt(["in-app"]);
    expect(prompt).toContain("In-App:");
    expect(prompt).toContain("push notification");
  });

  it("includes all channel rules for multiple channels", () => {
    const prompt = buildSystemPrompt(["sms", "email", "in-app"]);
    expect(prompt).toContain("SMS:");
    expect(prompt).toContain("Email:");
    expect(prompt).toContain("In-App:");
  });

  it("includes JSON schema with allowed channels", () => {
    const prompt = buildSystemPrompt(["sms", "email"]);
    expect(prompt).toContain('"sms"');
    expect(prompt).toContain('"email"');
  });

  it("uses singular 'item' for single channel", () => {
    const prompt = buildSystemPrompt(["sms"]);
    expect(prompt).toContain("exactly 1 item (SMS)");
  });

  it("uses plural 'items' for multiple channels", () => {
    const prompt = buildSystemPrompt(["sms", "email"]);
    expect(prompt).toContain("exactly 2 items (SMS, Email)");
  });

  it("includes critical guidelines", () => {
    const prompt = buildSystemPrompt(["sms"]);
    expect(prompt).toContain("CRITICAL GUIDELINES");
    expect(prompt).toContain("culturally sensitive");
  });
});

describe("buildUserPrompt", () => {
  it("interpolates patient fields", () => {
    const maria = getPatientById("maria")!;
    const prompt = buildUserPrompt(maria, "enrollment", "warm-supportive", ["sms"]);
    expect(prompt).toContain("Maria Gonzalez");
    expect(prompt).toContain("28");
    expect(prompt).toContain("Eligible — Not Enrolled");
    expect(prompt).toContain("Pregnancy");
    expect(prompt).toContain("Low Risk");
    expect(prompt).toContain("SMS");
  });

  it("shows 'Not enrolled' for null enrollment date", () => {
    const maria = getPatientById("maria")!;
    const prompt = buildUserPrompt(maria, "enrollment", "warm-supportive", ["sms"]);
    expect(prompt).toContain("Not enrolled");
  });

  it("shows formatted date for existing enrollment date", () => {
    const keisha = getPatientById("keisha")!;
    const prompt = buildUserPrompt(keisha, "re-engagement", "warm-supportive", ["sms"]);
    // Enrollment date "2025-11-01" may render as Oct 31 or Nov 1 depending on TZ
    expect(prompt).toMatch(/(?:Oct 31|Nov 1), 2025/);
  });

  it("shows 'None' for null last interaction date", () => {
    const maria = getPatientById("maria")!;
    const prompt = buildUserPrompt(maria, "enrollment", "warm-supportive", ["sms"]);
    expect(prompt).toContain("Last Interaction: None");
  });

  it("shows 'No prior interactions' when no interactions exist", () => {
    const maria = getPatientById("maria")!;
    const prompt = buildUserPrompt(maria, "enrollment", "warm-supportive", ["sms"]);
    expect(prompt).toContain("No prior interactions");
  });

  it("includes recent interactions when they exist", () => {
    const keisha = getPatientById("keisha")!;
    const prompt = buildUserPrompt(keisha, "re-engagement", "warm-supportive", ["sms"]);
    expect(prompt).toContain("Virtual visit");
    expect(prompt).toContain("Missed check-in");
  });

  it("includes care team names", () => {
    const maria = getPatientById("maria")!;
    const prompt = buildUserPrompt(maria, "enrollment", "warm-supportive", ["sms"]);
    expect(prompt).toContain("Sarah Thompson, RN");
    expect(prompt).toContain("Dr. Lisa Chen, OB-GYN");
  });

  it("includes outreach settings", () => {
    const maria = getPatientById("maria")!;
    const prompt = buildUserPrompt(maria, "enrollment", "warm-supportive", [
      "sms",
      "email",
    ]);
    expect(prompt).toContain("Goal: Enrollment");
    expect(prompt).toContain("Tone: Warm & Supportive");
    expect(prompt).toContain("Channels: SMS, Email");
  });

  it("includes risk factors", () => {
    const keisha = getPatientById("keisha")!;
    const prompt = buildUserPrompt(keisha, "re-engagement", "warm-supportive", ["sms"]);
    expect(prompt).toContain("Gestational diabetes");
  });
});

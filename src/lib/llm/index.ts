import { Patient, OutreachGoal, MessageTone, Channel, ChannelMessages } from "@/lib/types";
import { generateWithClaude } from "./claude";
import { generateWithGemini } from "./gemini";
import { streamWithClaude } from "./claude-stream";
import { streamWithGemini } from "./gemini-stream";

export interface LLMGenerateParams {
  patient: Patient;
  goal: OutreachGoal;
  tone: MessageTone;
  channels: Channel[];
}

export interface LLMGenerateResult {
  channelMessages: ChannelMessages[];
}

export function validateLLMResult(parsed: unknown): LLMGenerateResult {
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !Array.isArray((parsed as Record<string, unknown>).channelMessages)
  ) {
    throw new Error("Invalid LLM response: missing channelMessages array");
  }
  return parsed as LLMGenerateResult;
}

export type LiveProvider = "claude" | "gemini" | "gemini-lite" | "gemini-preview";

export async function generateWithProvider(
  provider: LiveProvider,
  params: LLMGenerateParams
): Promise<LLMGenerateResult> {
  switch (provider) {
    case "claude":
      return generateWithClaude(params);
    case "gemini":
    case "gemini-lite":
    case "gemini-preview":
      return generateWithGemini(params, geminiModelId(provider));
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function geminiModelId(provider: string): string {
  switch (provider) {
    case "gemini-lite": return "gemini-2.5-flash-lite";
    case "gemini-preview": return "gemini-3.1-flash-lite-preview";
    default: return "gemini-2.5-flash";
  }
}

export function streamWithProvider(
  provider: LiveProvider,
  params: LLMGenerateParams
): AsyncGenerator<string> {
  switch (provider) {
    case "claude":
      return streamWithClaude(params);
    case "gemini":
    case "gemini-lite":
    case "gemini-preview":
      return streamWithGemini(params, geminiModelId(provider));
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

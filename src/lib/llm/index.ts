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

export type LiveProvider = "claude" | "gemini" | "gemini-lite";

export async function generateWithProvider(
  provider: LiveProvider,
  params: LLMGenerateParams
): Promise<LLMGenerateResult> {
  switch (provider) {
    case "claude":
      return generateWithClaude(params);
    case "gemini":
    case "gemini-lite":
      return generateWithGemini(params, provider === "gemini-lite" ? "gemini-3.1-flash-lite-preview" : "gemini-2.5-flash");
    default:
      throw new Error(`Unknown provider: ${provider}`);
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
      return streamWithGemini(params, provider === "gemini-lite" ? "gemini-3.1-flash-lite-preview" : "gemini-2.5-flash");
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

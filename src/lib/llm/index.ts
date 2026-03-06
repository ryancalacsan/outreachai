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

export async function generateWithProvider(
  provider: "claude" | "gemini",
  params: LLMGenerateParams
): Promise<LLMGenerateResult> {
  switch (provider) {
    case "claude":
      return generateWithClaude(params);
    case "gemini":
      return generateWithGemini(params);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function streamWithProvider(
  provider: "claude" | "gemini",
  params: LLMGenerateParams
): AsyncGenerator<string> {
  switch (provider) {
    case "claude":
      return streamWithClaude(params);
    case "gemini":
      return streamWithGemini(params);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

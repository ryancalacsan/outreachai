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

export const outreachResponseSchema = {
  type: "object",
  properties: {
    channelMessages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          channel: { type: "string", enum: ["sms", "email", "in-app"] },
          variants: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                approach: { type: "string" },
                content: { type: "string" },
                subject: { type: "string" },
                engagementLikelihood: { type: "string", enum: ["high", "medium", "low"] },
                reasoning: { type: "string" },
              },
              required: ["id", "approach", "content", "engagementLikelihood", "reasoning"],
            },
          },
        },
        required: ["channel", "variants"],
      },
    },
  },
  required: ["channelMessages"],
} as const;

export type LiveProvider = "claude" | "claude-haiku" | "gemini" | "gemini-lite" | "gemini-preview";

export async function generateWithProvider(
  provider: LiveProvider,
  params: LLMGenerateParams
): Promise<LLMGenerateResult> {
  switch (provider) {
    case "claude":
    case "claude-haiku":
      return generateWithClaude(params, claudeModelId(provider));
    case "gemini":
    case "gemini-lite":
    case "gemini-preview":
      return generateWithGemini(params, geminiModelId(provider));
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function claudeModelId(provider: string): string {
  switch (provider) {
    case "claude-haiku": return "claude-haiku-4-5";
    default: return "claude-sonnet-4-6";
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
    case "claude-haiku":
      return streamWithClaude(params, claudeModelId(provider));
    case "gemini":
    case "gemini-lite":
    case "gemini-preview":
      return streamWithGemini(params, geminiModelId(provider));
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

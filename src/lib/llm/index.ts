import { z } from "zod";
import {
  type Patient,
  type OutreachGoal,
  type MessageTone,
  type Channel,
  type ChannelMessages,
  type LLMGenerateResult,
  type LiveProvider,
  llmResultSchema,
} from "@/lib/schemas";
import { generateWithClaude } from "./claude";
import { generateWithGemini } from "./gemini";
import { streamWithClaude } from "./claude-stream";
import { streamWithGemini } from "./gemini-stream";

export type { LLMGenerateResult, LiveProvider };

export interface LLMGenerateParams {
  patient: Patient;
  goal: OutreachGoal;
  tone: MessageTone;
  channels: Channel[];
}

export function validateLLMResult(parsed: unknown): LLMGenerateResult {
  const result = llmResultSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid LLM response: ${issues}`);
  }
  return result.data;
}

// Derive JSON Schema from Zod — used by Anthropic SDK for structured output
export const outreachResponseSchema = z.toJSONSchema(llmResultSchema);

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

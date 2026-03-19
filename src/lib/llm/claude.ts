import Anthropic from "@anthropic-ai/sdk";
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import type { JSONSchema } from "json-schema-to-ts";
import { LLMGenerateParams, LLMGenerateResult, validateLLMResult, outreachResponseSchema } from "./index";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/outreach";
import { requireEnv } from "@/lib/env";

export async function generateWithClaude(
  params: LLMGenerateParams,
  model: string = "claude-sonnet-4-6"
): Promise<LLMGenerateResult> {
  const client = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });

  const message = await client.messages.parse({
    model,
    max_tokens: 4096,
    system: buildSystemPrompt(params.channels),
    messages: [
      {
        role: "user",
        content: buildUserPrompt(
          params.patient,
          params.goal,
          params.tone,
          params.channels
        ),
      },
    ],
    output_config: {
      // Type assertion: Zod v4 JSON Schema output is structurally compatible
      format: jsonSchemaOutputFormat(outreachResponseSchema as JSONSchema & { type: "object" }),
    },
  });

  if (!message.parsed_output) {
    throw new Error("No structured output from Claude");
  }

  return validateLLMResult(message.parsed_output);
}

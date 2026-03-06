import Anthropic from "@anthropic-ai/sdk";
import { LLMGenerateParams, LLMGenerateResult } from "./index";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/outreach";

export async function generateWithClaude(
  params: LLMGenerateParams
): Promise<LLMGenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: buildSystemPrompt(),
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
  });

  const textContent = message.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const parsed = JSON.parse(textContent.text);
  return parsed as LLMGenerateResult;
}

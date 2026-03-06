import Anthropic from "@anthropic-ai/sdk";
import { LLMGenerateParams } from "./index";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/outreach";

export async function* streamWithClaude(
  params: LLMGenerateParams
): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: "claude-sonnet-4-5-20250929",
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
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

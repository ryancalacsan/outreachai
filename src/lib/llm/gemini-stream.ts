import { GoogleGenAI } from "@google/genai";
import { LLMGenerateParams, outreachResponseSchema } from "./index";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/outreach";

export async function* streamWithGemini(
  params: LLMGenerateParams,
  model: string = "gemini-2.5-flash"
): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContentStream({
    model,
    contents: buildUserPrompt(
      params.patient,
      params.goal,
      params.tone,
      params.channels
    ),
    config: {
      systemInstruction: buildSystemPrompt(params.channels),
      responseMimeType: "application/json",
      responseSchema: outreachResponseSchema as Parameters<
        typeof ai.models.generateContentStream
      >[0]["config"] extends { responseSchema?: infer S } ? S : never,
    },
  });

  for await (const chunk of response) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}

import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import { LLMGenerateParams, LLMGenerateResult, validateLLMResult, outreachResponseSchema } from "./index";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/outreach";
import { requireEnv } from "@/lib/env";

export async function generateWithGemini(
  params: LLMGenerateParams,
  model: string = "gemini-2.5-flash"
): Promise<LLMGenerateResult> {
  const ai = new GoogleGenAI({ apiKey: requireEnv("GEMINI_API_KEY") });

  const response = await ai.models.generateContent({
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
        typeof ai.models.generateContent
      >[0]["config"] extends { responseSchema?: infer S } ? S : never,
    },
  });

  if (!response.text) {
    throw new Error("No text response from Gemini");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    parsed = JSON.parse(jsonrepair(response.text));
  }
  return validateLLMResult(parsed);
}

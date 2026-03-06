import { GoogleGenAI } from "@google/genai";
import { LLMGenerateParams, LLMGenerateResult } from "./index";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/outreach";

export async function generateWithGemini(
  params: LLMGenerateParams
): Promise<LLMGenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildUserPrompt(
      params.patient,
      params.goal,
      params.tone,
      params.channels
    ),
    config: {
      systemInstruction: buildSystemPrompt(params.channels),
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("No text response from Gemini");
  }

  const parsed = JSON.parse(response.text);
  return parsed as LLMGenerateResult;
}

import { GenerateResponse } from "@/lib/types";
import data from "./mock-responses.json";

const mockData = data.scenarios as Record<string, GenerateResponse>;
const defaultResponse = data.defaultResponse as GenerateResponse;

export function getMockResponse(
  patientId: string,
  goal: string,
  tone: string,
  channels: string[]
): GenerateResponse {
  // Try patient-specific mock with exact match first
  const specificKey = `${patientId}-${goal}-${tone}`;
  let response = mockData[specificKey];

  // Try same patient + same goal (any tone)
  if (!response) {
    const goalKey = Object.keys(mockData).find(
      (k) => k.startsWith(`${patientId}-${goal}-`)
    );
    if (goalKey) response = mockData[goalKey];
  }

  // Try same patient + same tone (any goal)
  if (!response) {
    const toneKey = Object.keys(mockData).find(
      (k) => k.startsWith(`${patientId}-`) && k.endsWith(`-${tone}`)
    );
    if (toneKey) response = mockData[toneKey];
  }

  // Fall back to patient's first available scenario
  if (!response) {
    const patientKeys = Object.keys(mockData).filter((k) =>
      k.startsWith(`${patientId}-`)
    );
    if (patientKeys.length > 0) {
      response = mockData[patientKeys[0]];
    }
  }

  // Final fallback to generic default
  if (!response) {
    response = defaultResponse;
  }

  // Filter to requested channels only
  return {
    ...response,
    generatedAt: new Date().toISOString(),
    channelMessages: response.channelMessages.filter((cm) =>
      channels.includes(cm.channel)
    ),
  };
}

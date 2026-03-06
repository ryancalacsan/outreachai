import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, GenerateResponse } from "@/lib/types";
import { getPatientById } from "@/lib/data/patients";
import { getMockResponse } from "@/lib/data/mock-responses";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { patientId, goal, tone, channels, provider, accessCode } = body;

  // Validate patient exists
  const patient = getPatientById(patientId);
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  if (channels.length === 0) {
    return NextResponse.json(
      { error: "At least one channel is required" },
      { status: 400 }
    );
  }

  // Mock mode — return pre-generated responses
  if (provider === "mock") {
    // Simulate a small delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockResponse = getMockResponse(patientId, goal, tone, channels);
    return NextResponse.json(mockResponse);
  }

  // Live mode — check access code
  const expectedCode = process.env.DEMO_ACCESS_CODE;
  if (!expectedCode || accessCode !== expectedCode) {
    return NextResponse.json(
      { error: "Invalid access code" },
      { status: 401 }
    );
  }

  // Rate limiting for live API
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  // TODO: Phase 2 — implement live Claude and Gemini API calls
  // For now, return mock data even in "live" mode as a fallback
  const mockResponse = getMockResponse(patientId, goal, tone, channels);
  const response: GenerateResponse = {
    ...mockResponse,
    provider,
  };

  return NextResponse.json(response);
}

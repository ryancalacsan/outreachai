import json
from collections.abc import AsyncGenerator

from google import genai
from google.genai import types

from app.config import settings
from app.models import Patient, OutreachGoal, MessageTone, Channel, LLMResult
from app.prompts import build_system_prompt, build_user_prompt


def _get_client() -> genai.Client:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")
    return genai.Client(api_key=settings.gemini_api_key)


def _build_config(channels: list[Channel]) -> types.GenerateContentConfig:
    return types.GenerateContentConfig(
        system_instruction=build_system_prompt(channels),
        response_mime_type="application/json",
    )


async def generate_with_gemini(
    patient: Patient,
    goal: OutreachGoal,
    tone: MessageTone,
    channels: list[Channel],
    model: str = "gemini-2.5-flash",
) -> LLMResult:
    """Generate outreach messages using Gemini (non-streaming)."""
    client = _get_client()
    user_prompt = build_user_prompt(patient, goal, tone, channels)

    response = await client.aio.models.generate_content(
        model=model,
        contents=user_prompt,
        config=_build_config(channels),
    )

    if not response.text:
        raise RuntimeError("No text response from Gemini")

    parsed = json.loads(response.text)
    return LLMResult.from_llm_json(parsed)


async def stream_with_gemini(
    patient: Patient,
    goal: OutreachGoal,
    tone: MessageTone,
    channels: list[Channel],
    model: str = "gemini-2.5-flash",
) -> AsyncGenerator[str, None]:
    """Stream outreach message generation from Gemini."""
    client = _get_client()
    user_prompt = build_user_prompt(patient, goal, tone, channels)

    async for chunk in await client.aio.models.generate_content_stream(
        model=model,
        contents=user_prompt,
        config=_build_config(channels),
    ):
        if chunk.text:
            yield chunk.text

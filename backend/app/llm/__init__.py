from collections.abc import AsyncGenerator

from app.models import (
    Patient,
    OutreachGoal,
    MessageTone,
    Channel,
    LiveProvider,
    LLMResult,
)
from app.llm.claude import generate_with_claude, stream_with_claude
from app.llm.gemini import generate_with_gemini, stream_with_gemini


CLAUDE_MODELS: dict[str, str] = {
    "claude": "claude-sonnet-4-6",
    "claude-haiku": "claude-haiku-4-5",
}

GEMINI_MODELS: dict[str, str] = {
    "gemini": "gemini-2.5-flash",
    "gemini-lite": "gemini-2.5-flash-lite",
    "gemini-preview": "gemini-3.1-flash-lite-preview",
}


async def generate_with_provider(
    provider: LiveProvider,
    patient: Patient,
    goal: OutreachGoal,
    tone: MessageTone,
    channels: list[Channel],
) -> LLMResult:
    """Dispatch non-streaming generation to the appropriate LLM provider."""
    if provider in CLAUDE_MODELS:
        model = CLAUDE_MODELS[provider]
        return await generate_with_claude(patient, goal, tone, channels, model=model)

    model = GEMINI_MODELS.get(provider, "gemini-2.5-flash")
    return await generate_with_gemini(patient, goal, tone, channels, model=model)


async def stream_with_provider(
    provider: LiveProvider,
    patient: Patient,
    goal: OutreachGoal,
    tone: MessageTone,
    channels: list[Channel],
) -> AsyncGenerator[str, None]:
    """Dispatch streaming generation to the appropriate LLM provider."""
    if provider in CLAUDE_MODELS:
        model = CLAUDE_MODELS[provider]
        async for chunk in stream_with_claude(patient, goal, tone, channels, model=model):
            yield chunk
        return

    model = GEMINI_MODELS.get(provider, "gemini-2.5-flash")
    async for chunk in stream_with_gemini(patient, goal, tone, channels, model=model):
        yield chunk

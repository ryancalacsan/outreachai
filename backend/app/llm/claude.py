import json
from collections.abc import AsyncGenerator

from anthropic import AsyncAnthropic

from app.config import settings
from app.models import Patient, OutreachGoal, MessageTone, Channel, LLMResult
from app.prompts import build_system_prompt, build_user_prompt


OUTREACH_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "channelMessages": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "channel": {"type": "string", "enum": ["sms", "email", "in-app"]},
                    "variants": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "approach": {"type": "string"},
                                "content": {"type": "string"},
                                "subject": {"type": "string"},
                                "engagementLikelihood": {
                                    "type": "string",
                                    "enum": ["high", "medium", "low"],
                                },
                                "reasoning": {"type": "string"},
                            },
                            "required": [
                                "id",
                                "approach",
                                "content",
                                "engagementLikelihood",
                                "reasoning",
                            ],
                        },
                    },
                },
                "required": ["channel", "variants"],
            },
        },
    },
    "required": ["channelMessages"],
}


def _get_client() -> AsyncAnthropic:
    if not settings.anthropic_api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not configured")
    return AsyncAnthropic(api_key=settings.anthropic_api_key)


async def generate_with_claude(
    patient: Patient,
    goal: OutreachGoal,
    tone: MessageTone,
    channels: list[Channel],
    *,
    model: str = "claude-sonnet-4-6",
) -> LLMResult:
    """Generate outreach messages using Claude (non-streaming, structured output)."""
    client = _get_client()

    message = await client.messages.create(
        model=model,
        max_tokens=4096,
        system=build_system_prompt(channels),
        messages=[
            {
                "role": "user",
                "content": build_user_prompt(patient, goal, tone, channels),
            },
        ],
        output_config={
            "format": {
                "type": "json_schema",
                "schema": OUTREACH_RESPONSE_SCHEMA,
            },
        },
    )

    text_block = next(
        (block for block in message.content if block.type == "text"), None
    )
    if not text_block:
        raise RuntimeError("No text response from Claude")

    parsed = json.loads(text_block.text)
    return LLMResult.from_llm_json(parsed)


async def stream_with_claude(
    patient: Patient,
    goal: OutreachGoal,
    tone: MessageTone,
    channels: list[Channel],
    *,
    model: str = "claude-sonnet-4-6",
) -> AsyncGenerator[str, None]:
    """Stream outreach message generation from Claude."""
    client = _get_client()

    async with client.messages.stream(
        model=model,
        max_tokens=4096,
        system=build_system_prompt(channels),
        messages=[
            {
                "role": "user",
                "content": build_user_prompt(patient, goal, tone, channels),
            },
        ],
    ) as stream:
        async for text in stream.text_stream:
            yield text

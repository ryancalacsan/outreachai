import json
from collections.abc import AsyncGenerator

from anthropic import AsyncAnthropic

from app.config import settings
from app.models import Patient, OutreachGoal, MessageTone, Channel, LLMResult
from app.prompts import build_system_prompt, build_user_prompt


def _deref_schema(schema: dict) -> dict:
    """Inline $ref/$defs so the schema is flat (required by Anthropic's API)."""
    import copy
    schema = copy.deepcopy(schema)
    defs = schema.pop("$defs", {})

    def resolve(node):
        if isinstance(node, dict):
            if "$ref" in node:
                ref_name = node["$ref"].split("/")[-1]
                return resolve(defs[ref_name])
            return {k: resolve(v) for k, v in node.items()}
        if isinstance(node, list):
            return [resolve(item) for item in node]
        return node

    return resolve(schema)


# Derive JSON Schema from Pydantic model — single source of truth
OUTREACH_RESPONSE_SCHEMA = _deref_schema(LLMResult.model_json_schema(by_alias=True))


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

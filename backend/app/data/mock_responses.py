import json
from datetime import datetime, timezone
from pathlib import Path

from app.models import GenerateResponse, ChannelMessages, MessageVariant, Channel


_DATA_FILE = Path(__file__).parent / "mock_responses.json"
_data = json.loads(_DATA_FILE.read_text())
_scenarios: dict[str, dict] = _data["scenarios"]
_default_response: dict = _data["defaultResponse"]


def _parse_response(raw: dict, provider: str = "mock") -> GenerateResponse:
    """Parse a raw mock response dict into a GenerateResponse model."""
    channel_messages = [
        ChannelMessages(
            channel=cm["channel"],
            variants=[
                MessageVariant(
                    id=v["id"],
                    approach=v["approach"],
                    content=v["content"],
                    subject=v.get("subject"),
                    engagement_likelihood=v["engagementLikelihood"],
                    reasoning=v["reasoning"],
                )
                for v in cm["variants"]
            ],
        )
        for cm in raw["channelMessages"]
    ]
    return GenerateResponse(
        channel_messages=channel_messages,
        provider=provider,
        generated_at=datetime.now(timezone.utc).isoformat(),
    )


def get_mock_response(
    patient_id: str,
    goal: str,
    tone: str,
    channels: list[Channel],
) -> GenerateResponse:
    """Look up a mock response with smart fallback, mirroring the TypeScript implementation."""
    # Try exact match
    specific_key = f"{patient_id}-{goal}-{tone}"
    raw = _scenarios.get(specific_key)

    # Try same patient + same goal (any tone)
    if not raw:
        for key in _scenarios:
            if key.startswith(f"{patient_id}-{goal}-"):
                raw = _scenarios[key]
                break

    # Try same patient + same tone (any goal)
    if not raw:
        for key in _scenarios:
            if key.startswith(f"{patient_id}-") and key.endswith(f"-{tone}"):
                raw = _scenarios[key]
                break

    # Fall back to patient's first available scenario
    if not raw:
        for key in _scenarios:
            if key.startswith(f"{patient_id}-"):
                raw = _scenarios[key]
                break

    # Final fallback to generic default
    if not raw:
        raw = _default_response

    response = _parse_response(raw)

    # Filter to requested channels only
    response.channel_messages = [
        cm for cm in response.channel_messages if cm.channel in channels
    ]
    return response

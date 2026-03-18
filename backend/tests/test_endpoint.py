from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.models import ChannelMessages, LLMResult, MessageVariant


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


# --- Helpers ---

_VALID_BODY = {
    "patient_id": "maria",
    "goal": "enrollment",
    "tone": "warm-supportive",
    "channels": ["sms"],
    "provider": "gemini",
    "access_code": "test-code",
}

_MOCK_LLM_RESULT = LLMResult(
    channel_messages=[
        ChannelMessages(
            channel="sms",
            variants=[
                MessageVariant(
                    id="sms-a",
                    approach="Test",
                    content="Test message",
                    engagement_likelihood="high",
                    reasoning="Test reasoning",
                )
            ],
        )
    ]
)


# --- Health check ---


@pytest.mark.anyio
async def test_health(client):
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


# --- Validation tests ---


@pytest.mark.anyio
async def test_missing_access_code(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": ["sms"],
            "provider": "gemini",
        },
    )
    assert r.status_code == 401
    assert "access code" in r.json()["error"].lower()


@pytest.mark.anyio
async def test_invalid_patient(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "nobody",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": ["sms"],
            "provider": "gemini",
            "access_code": "wrong",
        },
    )
    assert r.status_code == 404
    assert "not found" in r.json()["error"].lower()


@pytest.mark.anyio
async def test_mock_mode_returns_response(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": ["sms"],
            "provider": "mock",
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["provider"] == "mock"
    assert "channelMessages" in data
    assert "generatedAt" in data
    # Should only include requested channels
    channels = [cm["channel"] for cm in data["channelMessages"]]
    assert channels == ["sms"]


@pytest.mark.anyio
async def test_mock_mode_filters_channels(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": ["email"],
            "provider": "mock",
        },
    )
    assert r.status_code == 200
    channels = [cm["channel"] for cm in r.json()["channelMessages"]]
    assert channels == ["email"]


@pytest.mark.anyio
async def test_mock_mode_fallback_for_unmatched_scenario(client):
    """Maria has no win-back/urgent-action scenario — falls back to her first available."""
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "win-back",
            "tone": "urgent-action",
            "channels": ["sms"],
            "provider": "mock",
        },
    )
    assert r.status_code == 200
    assert len(r.json()["channelMessages"]) > 0


@pytest.mark.anyio
async def test_empty_channels_422(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": [],
            "provider": "gemini",
        },
    )
    assert r.status_code == 422


@pytest.mark.anyio
async def test_empty_channels_with_unknown_patient_422(client):
    """Pydantic validates channels before route logic — always 422, not 404."""
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "unknown",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": [],
            "provider": "gemini",
        },
    )
    assert r.status_code == 422


@pytest.mark.anyio
async def test_invalid_goal_422(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "invalid",
            "tone": "warm-supportive",
            "channels": ["sms"],
            "provider": "gemini",
        },
    )
    assert r.status_code == 422


@pytest.mark.anyio
async def test_invalid_tone_422(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "angry",
            "channels": ["sms"],
            "provider": "gemini",
        },
    )
    assert r.status_code == 422


@pytest.mark.anyio
async def test_invalid_provider_422(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": ["sms"],
            "provider": "openai",
        },
    )
    assert r.status_code == 422


@pytest.mark.anyio
async def test_invalid_channel_422(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": ["telegram"],
            "provider": "gemini",
        },
    )
    assert r.status_code == 422


# --- Live mode ---


@pytest.mark.anyio
async def test_wrong_access_code(client):
    r = await client.post(
        "/api/generate",
        json={**_VALID_BODY, "access_code": "wrong"},
    )
    assert r.status_code == 401


@pytest.mark.anyio
@patch("app.routers.generate.settings")
@patch("app.routers.generate.generate_with_provider", new_callable=AsyncMock)
async def test_live_mode_succeeds_with_correct_access_code(
    mock_generate, mock_settings, client
):
    mock_settings.demo_access_code = "test-code"
    mock_generate.return_value = _MOCK_LLM_RESULT
    r = await client.post("/api/generate", json=_VALID_BODY)
    assert r.status_code == 200
    data = r.json()
    assert data["provider"] == "gemini"
    assert "channelMessages" in data
    assert "generatedAt" in data


# --- Rate limiting ---


@pytest.mark.anyio
@patch("app.routers.generate.settings")
@patch("app.routers.generate.generate_with_provider", new_callable=AsyncMock)
async def test_rate_limiting(mock_generate, mock_settings, client):
    mock_settings.demo_access_code = "test-code"
    mock_generate.return_value = _MOCK_LLM_RESULT
    unique_ip = "10.99.99.99"

    # Exhaust rate limit (10 requests)
    for _ in range(10):
        await client.post(
            "/api/generate",
            json=_VALID_BODY,
            headers={"x-forwarded-for": unique_ip},
        )

    # 11th should be rate limited
    r = await client.post(
        "/api/generate",
        json=_VALID_BODY,
        headers={"x-forwarded-for": unique_ip},
    )
    assert r.status_code == 429
    assert "rate limit" in r.json()["error"].lower()


# --- Streaming ---


@pytest.mark.anyio
@patch("app.routers.generate.settings")
@patch("app.routers.generate.stream_with_provider")
async def test_streaming_returns_sse(mock_stream, mock_settings, client):
    mock_settings.demo_access_code = "test-code"

    async def fake_stream(*args, **kwargs):
        yield '{"channelMessages":[{"channel":"sms","variants":[{"id":"sms-a","approach":"Test","content":"Hi","engagementLikelihood":"high","reasoning":"R"}]}]}'

    mock_stream.return_value = fake_stream()

    r = await client.post(
        "/api/generate",
        json=_VALID_BODY,
        headers={"accept": "text/event-stream", "x-forwarded-for": "10.0.0.1"},
    )
    assert r.status_code == 200
    assert "text/event-stream" in r.headers.get("content-type", "")

    # Validate the SSE body contains chunk and done events
    body = r.text
    assert "data:" in body
    import json as json_mod
    events = [
        json_mod.loads(line.removeprefix("data: "))
        for line in body.splitlines()
        if line.startswith("data: ")
    ]
    types = [e["type"] for e in events]
    assert "chunk" in types
    assert "done" in types
    done_event = next(e for e in events if e["type"] == "done")
    assert "channelMessages" in done_event["response"]
    assert "generatedAt" in done_event["response"]
    # Verify content actually round-tripped through parse/filter/serialize
    cms = done_event["response"]["channelMessages"]
    assert len(cms) == 1
    assert cms[0]["channel"] == "sms"
    assert len(cms[0]["variants"]) == 1


# --- Valid enum values (mock mode) ---


@pytest.mark.anyio
async def test_accepts_all_valid_goals(client):
    goals = [
        "enrollment", "onboarding", "appointment-reminder",
        "re-engagement", "win-back", "educational",
    ]
    for goal in goals:
        r = await client.post(
            "/api/generate",
            json={**_VALID_BODY, "provider": "mock", "goal": goal},
        )
        assert r.status_code == 200, f"Failed for goal={goal}"


@pytest.mark.anyio
async def test_accepts_all_valid_tones(client):
    tones = [
        "warm-supportive", "clinical-informative",
        "urgent-action", "casual-friendly",
    ]
    for tone in tones:
        r = await client.post(
            "/api/generate",
            json={**_VALID_BODY, "provider": "mock", "tone": tone},
        )
        assert r.status_code == 200, f"Failed for tone={tone}"


@pytest.mark.anyio
async def test_accepts_all_valid_channels(client):
    channels = ["sms", "email", "in-app"]
    for channel in channels:
        r = await client.post(
            "/api/generate",
            json={**_VALID_BODY, "provider": "mock", "channels": [channel]},
        )
        assert r.status_code == 200, f"Failed for channel={channel}"

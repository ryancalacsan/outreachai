import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


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

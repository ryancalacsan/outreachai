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
async def test_mock_mode_rejected(client):
    r = await client.post(
        "/api/generate",
        json={
            "patient_id": "maria",
            "goal": "enrollment",
            "tone": "warm-supportive",
            "channels": ["sms"],
            "provider": "mock",
            "access_code": "test",
        },
    )
    assert r.status_code == 400
    assert "mock" in r.json()["error"].lower()


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

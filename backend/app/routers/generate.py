import asyncio
import json
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.models import GenerateRequest, GenerateResponse, LLMResult, LiveProvider
from app.data.patients import get_patient_by_id
from app.data.mock_responses import get_mock_response
from app.llm import generate_with_provider, stream_with_provider


router = APIRouter(prefix="/api")

# --- Rate limiting ---

_rate_limit_map: dict[str, dict] = {}
RATE_LIMIT = 10
RATE_WINDOW_S = 3600  # 1 hour


_last_cleanup = 0.0
_CLEANUP_INTERVAL_S = 600  # 10 minutes


def _check_rate_limit(ip: str) -> bool:
    global _last_cleanup
    now = time.time()

    # Periodic cleanup of expired entries
    if now - _last_cleanup > _CLEANUP_INTERVAL_S:
        expired = [k for k, v in _rate_limit_map.items() if now > v["reset_at"]]
        for k in expired:
            del _rate_limit_map[k]
        _last_cleanup = now

    entry = _rate_limit_map.get(ip)

    if not entry or now > entry["reset_at"]:
        _rate_limit_map[ip] = {"count": 1, "reset_at": now + RATE_WINDOW_S}
        return True

    if entry["count"] >= RATE_LIMIT:
        return False

    entry["count"] += 1
    return True


# --- Endpoint ---

@router.post("/generate")
async def generate(body: GenerateRequest, request: Request):
    # Validate patient exists
    patient = get_patient_by_id(body.patient_id)
    if not patient:
        return JSONResponse({"error": "Patient not found"}, status_code=404)

    # Mock mode — return pre-generated responses
    if body.provider == "mock":
        await asyncio.sleep(0.8)  # Simulate delay for realism
        response = get_mock_response(body.patient_id, body.goal, body.tone, body.channels)
        return JSONResponse(response.model_dump(by_alias=True, exclude_none=True))

    # Access code check
    if not settings.demo_access_code or body.access_code != settings.demo_access_code:
        return JSONResponse({"error": "Invalid access code"}, status_code=401)

    # Rate limiting
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown")
    if not _check_rate_limit(ip):
        return JSONResponse(
            {"error": "Rate limit exceeded. Please try again later."},
            status_code=429,
        )

    provider: LiveProvider = body.provider  # type: ignore[assignment]

    # Check if client wants streaming
    if request.headers.get("accept") == "text/event-stream":
        return _handle_streaming(provider, patient, body)

    # Non-streaming
    try:
        result = await generate_with_provider(
            provider, patient, body.goal, body.tone, body.channels
        )
        filtered = [
            cm for cm in result.channel_messages if cm.channel in body.channels
        ]
        response = GenerateResponse(
            channel_messages=filtered,
            provider=body.provider,
            generated_at=datetime.now(timezone.utc).isoformat(),
        )
        # Return camelCase JSON to match frontend expectations
        return JSONResponse(response.model_dump(by_alias=True, exclude_none=True))
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


def _extract_first_json(text: str) -> str | None:
    """Extract the first complete JSON object from text using brace-depth scanning."""
    depth = 0
    start = -1
    in_string = False
    escape_next = False
    for i, ch in enumerate(text):
        if escape_next:
            escape_next = False
            continue
        if ch == "\\" and in_string:
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start != -1:
                return text[start : i + 1]
    return None


def _handle_streaming(provider: LiveProvider, patient, body: GenerateRequest):
    """Return an SSE streaming response matching the frontend protocol."""

    async def event_generator():
        try:
            full_text = ""
            async for chunk in stream_with_provider(
                provider, patient, body.goal, body.tone, body.channels
            ):
                full_text += chunk
                yield {"data": json.dumps({"type": "chunk", "text": chunk})}

            # Extract first complete JSON object (handles markdown fences, trailing text)
            clean_text = _extract_first_json(full_text) or full_text
            parsed = LLMResult.from_llm_json(json.loads(clean_text))
            filtered = [
                cm for cm in parsed.channel_messages if cm.channel in body.channels
            ]
            response = GenerateResponse(
                channel_messages=filtered,
                provider=body.provider,
                generated_at=datetime.now(timezone.utc).isoformat(),
            )
            yield {
                "data": json.dumps({"type": "done", "response": response.model_dump(by_alias=True, exclude_none=True)})
            }
        except Exception as e:
            yield {"data": json.dumps({"type": "error", "error": str(e)})}

    return EventSourceResponse(event_generator())

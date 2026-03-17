import json
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.models import GenerateRequest, GenerateResponse, LLMResult, LiveProvider
from app.data.patients import get_patient_by_id
from app.llm import generate_with_provider, stream_with_provider


router = APIRouter(prefix="/api")

# --- Rate limiting ---

_rate_limit_map: dict[str, dict] = {}
RATE_LIMIT = 10
RATE_WINDOW_S = 3600  # 1 hour


def _check_rate_limit(ip: str) -> bool:
    now = time.time()
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

    # Mock mode not supported in Python backend
    if body.provider == "mock":
        return JSONResponse(
            {"error": "Mock mode is only available via the Next.js frontend"},
            status_code=400,
        )

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
        return JSONResponse(_to_camel_response(response))
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


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

            # Parse complete JSON and filter channels
            parsed = LLMResult.from_llm_json(json.loads(full_text))
            filtered = [
                cm for cm in parsed.channel_messages if cm.channel in body.channels
            ]
            response = GenerateResponse(
                channel_messages=filtered,
                provider=body.provider,
                generated_at=datetime.now(timezone.utc).isoformat(),
            )
            yield {
                "data": json.dumps({"type": "done", "response": _to_camel_response(response)})
            }
        except Exception as e:
            yield {"data": json.dumps({"type": "error", "error": str(e)})}

    return EventSourceResponse(event_generator())


def _to_camel_response(response: GenerateResponse) -> dict:
    """Convert response to camelCase dict matching frontend expectations."""
    return {
        "channelMessages": [
            {
                "channel": cm.channel,
                "variants": [
                    {
                        "id": v.id,
                        "approach": v.approach,
                        "content": v.content,
                        **({"subject": v.subject} if v.subject else {}),
                        "engagementLikelihood": v.engagement_likelihood,
                        "reasoning": v.reasoning,
                    }
                    for v in cm.variants
                ],
            }
            for cm in response.channel_messages
        ],
        "provider": response.provider,
        "generatedAt": response.generated_at,
    }

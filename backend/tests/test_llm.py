from unittest.mock import AsyncMock, patch

import pytest

from app.llm import generate_with_provider, stream_with_provider
from app.models import (
    ChannelMessages,
    LLMResult,
    MessageVariant,
    Patient,
)


# --- Fixtures ---

_MOCK_RESULT = LLMResult(
    channel_messages=[
        ChannelMessages(
            channel="sms",
            variants=[
                MessageVariant(
                    id="sms-a",
                    approach="Test",
                    content="Test",
                    engagement_likelihood="high",
                    reasoning="Test",
                )
            ],
        )
    ]
)

_MOCK_PATIENT = Patient(
    id="test",
    name="Test",
    age=30,
    lifecycle_stage="eligible",
    care_program="pregnancy",
    risk_level="low",
    preferred_channel="sms",
    language="English",
    insurance_type="Test",
    care_team={"nurse_name": "N", "provider_name": "D"},
    risk_factors=[],
    recent_interactions=[],
    clinical_notes="",
    enrollment_date=None,
    last_interaction_date=None,
    missed_appointments=0,
)

_PARAMS = {
    "patient": _MOCK_PATIENT,
    "goal": "enrollment",
    "tone": "warm-supportive",
    "channels": ["sms"],
}


# --- generate_with_provider routing ---


class TestGenerateWithProvider:
    @pytest.mark.anyio
    @patch("app.llm.generate_with_claude", new_callable=AsyncMock)
    async def test_routes_claude_to_sonnet_model(self, mock_claude):
        mock_claude.return_value = _MOCK_RESULT
        await generate_with_provider("claude", **_PARAMS)
        mock_claude.assert_called_once()
        assert mock_claude.call_args.kwargs["model"] == "claude-sonnet-4-6"

    @pytest.mark.anyio
    @patch("app.llm.generate_with_claude", new_callable=AsyncMock)
    async def test_routes_claude_haiku_to_haiku_model(self, mock_claude):
        mock_claude.return_value = _MOCK_RESULT
        await generate_with_provider("claude-haiku", **_PARAMS)
        mock_claude.assert_called_once()
        assert mock_claude.call_args.kwargs["model"] == "claude-haiku-4-5"

    @pytest.mark.anyio
    @patch("app.llm.generate_with_gemini", new_callable=AsyncMock)
    async def test_routes_gemini_to_flash_model(self, mock_gemini):
        mock_gemini.return_value = _MOCK_RESULT
        await generate_with_provider("gemini", **_PARAMS)
        mock_gemini.assert_called_once()
        assert mock_gemini.call_args.kwargs["model"] == "gemini-2.5-flash"

    @pytest.mark.anyio
    @patch("app.llm.generate_with_gemini", new_callable=AsyncMock)
    async def test_routes_gemini_lite_to_lite_model(self, mock_gemini):
        mock_gemini.return_value = _MOCK_RESULT
        await generate_with_provider("gemini-lite", **_PARAMS)
        mock_gemini.assert_called_once()
        assert mock_gemini.call_args.kwargs["model"] == "gemini-2.5-flash-lite"

    @pytest.mark.anyio
    @patch("app.llm.generate_with_gemini", new_callable=AsyncMock)
    async def test_routes_gemini_preview_to_preview_model(self, mock_gemini):
        mock_gemini.return_value = _MOCK_RESULT
        await generate_with_provider("gemini-preview", **_PARAMS)
        mock_gemini.assert_called_once()
        assert mock_gemini.call_args.kwargs["model"] == "gemini-3.1-flash-lite-preview"


# --- stream_with_provider routing ---


class TestStreamWithProvider:
    @pytest.mark.anyio
    @patch("app.llm.stream_with_claude")
    async def test_routes_claude_to_sonnet_model(self, mock_claude):
        async def fake_stream(*a, **kw):
            yield "chunk"

        mock_claude.return_value = fake_stream()
        chunks = [c async for c in stream_with_provider("claude", **_PARAMS)]
        assert chunks == ["chunk"]
        assert mock_claude.call_args.kwargs["model"] == "claude-sonnet-4-6"

    @pytest.mark.anyio
    @patch("app.llm.stream_with_claude")
    async def test_routes_claude_haiku_to_haiku_model(self, mock_claude):
        async def fake_stream(*a, **kw):
            yield "chunk"

        mock_claude.return_value = fake_stream()
        [c async for c in stream_with_provider("claude-haiku", **_PARAMS)]
        assert mock_claude.call_args.kwargs["model"] == "claude-haiku-4-5"

    @pytest.mark.anyio
    @patch("app.llm.stream_with_gemini")
    async def test_routes_gemini_to_flash_model(self, mock_gemini):
        async def fake_stream(*a, **kw):
            yield "chunk"

        mock_gemini.return_value = fake_stream()
        [c async for c in stream_with_provider("gemini", **_PARAMS)]
        assert mock_gemini.call_args.kwargs["model"] == "gemini-2.5-flash"

    @pytest.mark.anyio
    @patch("app.llm.stream_with_gemini")
    async def test_routes_gemini_lite_to_lite_model(self, mock_gemini):
        async def fake_stream(*a, **kw):
            yield "chunk"

        mock_gemini.return_value = fake_stream()
        [c async for c in stream_with_provider("gemini-lite", **_PARAMS)]
        assert mock_gemini.call_args.kwargs["model"] == "gemini-2.5-flash-lite"

    @pytest.mark.anyio
    @patch("app.llm.stream_with_gemini")
    async def test_routes_gemini_preview_to_preview_model(self, mock_gemini):
        async def fake_stream(*a, **kw):
            yield "chunk"

        mock_gemini.return_value = fake_stream()
        [c async for c in stream_with_provider("gemini-preview", **_PARAMS)]
        assert mock_gemini.call_args.kwargs["model"] == "gemini-3.1-flash-lite-preview"


# --- LLMResult validation (invalid inputs) ---


class TestLLMResultValidation:
    def test_valid_camel_case_input(self):
        raw = {
            "channelMessages": [
                {
                    "channel": "sms",
                    "variants": [
                        {
                            "id": "sms-a",
                            "approach": "A",
                            "content": "Hi",
                            "engagementLikelihood": "high",
                            "reasoning": "R",
                        }
                    ],
                }
            ]
        }
        result = LLMResult.from_llm_json(raw)
        assert len(result.channel_messages) == 1

    def test_rejects_missing_channel_messages(self):
        with pytest.raises(Exception):
            LLMResult.from_llm_json({"foo": "bar"})

    def test_rejects_invalid_channel_enum(self):
        raw = {
            "channelMessages": [
                {"channel": "telegram", "variants": []}
            ]
        }
        with pytest.raises(Exception):
            LLMResult.from_llm_json(raw)

    def test_rejects_invalid_engagement_likelihood(self):
        raw = {
            "channelMessages": [
                {
                    "channel": "sms",
                    "variants": [
                        {
                            "id": "a",
                            "approach": "A",
                            "content": "Hi",
                            "engagementLikelihood": "very-high",
                            "reasoning": "R",
                        }
                    ],
                }
            ]
        }
        with pytest.raises(Exception):
            LLMResult.from_llm_json(raw)

    def test_rejects_missing_required_variant_fields(self):
        raw = {
            "channelMessages": [
                {
                    "channel": "sms",
                    "variants": [{"id": "a"}],
                }
            ]
        }
        with pytest.raises(Exception):
            LLMResult.from_llm_json(raw)

    def test_rejects_primitive_input(self):
        with pytest.raises(Exception):
            LLMResult.from_llm_json(42)

import pytest
from pydantic import ValidationError

from app.models import (
    CareTeam,
    ChannelMessages,
    GenerateRequest,
    GenerateResponse,
    LLMResult,
    MessageVariant,
    Patient,
    RecentInteraction,
)


# --- Fixtures ---


def _make_patient(**overrides) -> dict:
    base = {
        "id": "test",
        "name": "Test Patient",
        "age": 30,
        "lifecycle_stage": "eligible",
        "care_program": "pregnancy",
        "risk_level": "low",
        "preferred_channel": "sms",
        "language": "English",
        "insurance_type": "Employer plan",
        "care_team": {"nurse_name": "Nurse A", "provider_name": "Dr. B"},
        "risk_factors": ["Factor 1"],
        "recent_interactions": [],
        "clinical_notes": "Test notes",
        "enrollment_date": None,
        "last_interaction_date": None,
        "missed_appointments": 0,
    }
    base.update(overrides)
    return base


def _make_variant(**overrides) -> dict:
    base = {
        "id": "sms-a",
        "approach": "Empathy-led",
        "content": "Hello there",
        "engagement_likelihood": "high",
        "reasoning": "Because it works",
    }
    base.update(overrides)
    return base


# --- Patient model ---


class TestPatient:
    def test_valid_patient(self):
        p = Patient(**_make_patient())
        assert p.id == "test"
        assert p.care_team.nurse_name == "Nurse A"

    def test_nested_care_team(self):
        p = Patient(**_make_patient())
        assert isinstance(p.care_team, CareTeam)

    def test_nested_interactions(self):
        p = Patient(
            **_make_patient(
                recent_interactions=[
                    {"date": "2026-01-01", "type": "Call", "summary": "Talked"}
                ]
            )
        )
        assert len(p.recent_interactions) == 1
        assert isinstance(p.recent_interactions[0], RecentInteraction)

    def test_invalid_lifecycle_stage(self):
        with pytest.raises(ValidationError):
            Patient(**_make_patient(lifecycle_stage="invalid"))

    def test_invalid_risk_level(self):
        with pytest.raises(ValidationError):
            Patient(**_make_patient(risk_level="extreme"))

    def test_nullable_dates(self):
        p = Patient(**_make_patient(enrollment_date=None, last_interaction_date=None))
        assert p.enrollment_date is None
        assert p.last_interaction_date is None

    def test_dates_with_values(self):
        p = Patient(
            **_make_patient(
                enrollment_date="2026-01-01",
                last_interaction_date="2026-02-01",
            )
        )
        assert p.enrollment_date == "2026-01-01"


# --- MessageVariant ---


class TestMessageVariant:
    def test_valid_variant(self):
        v = MessageVariant(**_make_variant())
        assert v.approach == "Empathy-led"
        assert v.subject is None

    def test_email_variant_with_subject(self):
        v = MessageVariant(**_make_variant(subject="Check this out"))
        assert v.subject == "Check this out"

    def test_invalid_engagement_likelihood(self):
        with pytest.raises(ValidationError):
            MessageVariant(**_make_variant(engagement_likelihood="very-high"))


# --- GenerateRequest ---


class TestGenerateRequest:
    def test_valid_request(self):
        r = GenerateRequest(
            patient_id="maria",
            goal="enrollment",
            tone="warm-supportive",
            channels=["sms"],
            provider="gemini",
        )
        assert r.patient_id == "maria"

    def test_empty_channels_rejected(self):
        with pytest.raises(ValidationError, match="At least one channel"):
            GenerateRequest(
                patient_id="maria",
                goal="enrollment",
                tone="warm-supportive",
                channels=[],
                provider="gemini",
            )

    def test_invalid_goal(self):
        with pytest.raises(ValidationError):
            GenerateRequest(
                patient_id="maria",
                goal="invalid-goal",
                tone="warm-supportive",
                channels=["sms"],
                provider="gemini",
            )

    def test_invalid_tone(self):
        with pytest.raises(ValidationError):
            GenerateRequest(
                patient_id="maria",
                goal="enrollment",
                tone="angry",
                channels=["sms"],
                provider="gemini",
            )

    def test_invalid_channel(self):
        with pytest.raises(ValidationError):
            GenerateRequest(
                patient_id="maria",
                goal="enrollment",
                tone="warm-supportive",
                channels=["telegram"],
                provider="gemini",
            )

    def test_invalid_provider(self):
        with pytest.raises(ValidationError):
            GenerateRequest(
                patient_id="maria",
                goal="enrollment",
                tone="warm-supportive",
                channels=["sms"],
                provider="openai",
            )

    def test_multiple_channels(self):
        r = GenerateRequest(
            patient_id="maria",
            goal="enrollment",
            tone="warm-supportive",
            channels=["sms", "email", "in-app"],
            provider="gemini",
        )
        assert len(r.channels) == 3

    def test_optional_access_code(self):
        r = GenerateRequest(
            patient_id="maria",
            goal="enrollment",
            tone="warm-supportive",
            channels=["sms"],
            provider="gemini",
        )
        assert r.access_code is None

        r2 = GenerateRequest(
            patient_id="maria",
            goal="enrollment",
            tone="warm-supportive",
            channels=["sms"],
            provider="gemini",
            access_code="secret",
        )
        assert r2.access_code == "secret"


# --- LLMResult.from_llm_json ---


class TestLLMResult:
    def test_parse_camel_case_json(self):
        """LLMs return camelCase — from_llm_json should handle it."""
        raw = {
            "channelMessages": [
                {
                    "channel": "sms",
                    "variants": [
                        {
                            "id": "sms-a",
                            "approach": "Empathy-led",
                            "content": "Hello",
                            "engagementLikelihood": "high",
                            "reasoning": "Works well",
                        }
                    ],
                }
            ]
        }
        result = LLMResult.from_llm_json(raw)
        assert len(result.channel_messages) == 1
        assert result.channel_messages[0].channel == "sms"
        assert result.channel_messages[0].variants[0].engagement_likelihood == "high"

    def test_parse_with_email_subject(self):
        raw = {
            "channelMessages": [
                {
                    "channel": "email",
                    "variants": [
                        {
                            "id": "email-a",
                            "approach": "Resource-focused",
                            "content": "Dear Patient...",
                            "subject": "Your care team is here",
                            "engagementLikelihood": "medium",
                            "reasoning": "Email with subject",
                        }
                    ],
                }
            ]
        }
        result = LLMResult.from_llm_json(raw)
        assert result.channel_messages[0].variants[0].subject == "Your care team is here"

    def test_parse_multiple_channels(self):
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
                },
                {
                    "channel": "email",
                    "variants": [
                        {
                            "id": "email-a",
                            "approach": "B",
                            "content": "Hello",
                            "subject": "Subj",
                            "engagementLikelihood": "low",
                            "reasoning": "R2",
                        }
                    ],
                },
            ]
        }
        result = LLMResult.from_llm_json(raw)
        assert len(result.channel_messages) == 2
        assert result.channel_messages[0].channel == "sms"
        assert result.channel_messages[1].channel == "email"


# --- GenerateResponse ---


class TestGenerateResponse:
    def test_valid_response(self):
        r = GenerateResponse(
            channel_messages=[
                ChannelMessages(
                    channel="sms",
                    variants=[MessageVariant(**_make_variant())],
                )
            ],
            provider="gemini",
            generated_at="2026-01-01T00:00:00Z",
        )
        assert r.provider == "gemini"
        assert len(r.channel_messages) == 1

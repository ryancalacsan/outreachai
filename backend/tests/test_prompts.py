from app.models import Patient
from app.prompts import build_system_prompt, build_user_prompt, format_date


# --- format_date ---


class TestFormatDate:
    def test_standard_date(self):
        result = format_date("2026-01-15")
        assert "Jan" in result
        assert "15" in result
        assert "2026" in result

    def test_another_date(self):
        result = format_date("2025-12-01")
        assert "Dec" in result
        assert "1" in result
        assert "2025" in result


# --- build_system_prompt ---


class TestBuildSystemPrompt:
    def test_single_channel_sms(self):
        prompt = build_system_prompt(["sms"])
        assert "SMS" in prompt
        assert "300 characters" in prompt
        assert "exactly 1 item" in prompt
        # Should NOT contain email-specific rules (email's "Include a...subject line")
        channel_section = prompt.split("CHANNEL RULES")[1].split("FOR EACH")[0]
        assert "Include a clear, non-clickbait subject line" not in channel_section

    def test_single_channel_email(self):
        prompt = build_system_prompt(["email"])
        assert "subject line" in prompt
        assert "exactly 1 item" in prompt

    def test_multiple_channels(self):
        prompt = build_system_prompt(["sms", "email", "in-app"])
        assert "exactly 3 items" in prompt
        assert "SMS" in prompt
        assert "Email" in prompt
        assert "In-App" in prompt
        assert "300 characters" in prompt
        assert "subject line" in prompt
        assert "push notification" in prompt

    def test_contains_json_schema(self):
        prompt = build_system_prompt(["sms"])
        assert '"channelMessages"' in prompt
        assert '"variants"' in prompt
        assert '"engagementLikelihood"' in prompt

    def test_contains_guidelines(self):
        prompt = build_system_prompt(["sms"])
        assert "CRITICAL GUIDELINES" in prompt
        assert "care team member" in prompt
        assert "health literacy" in prompt

    def test_variant_instructions(self):
        prompt = build_system_prompt(["sms"])
        assert "empathy-led" in prompt.lower()
        assert "value/resource-led" in prompt.lower()
        assert "exactly 3 message variants" in prompt


# --- build_user_prompt ---


def _make_test_patient() -> Patient:
    return Patient(
        id="test",
        name="Maria Gonzalez",
        age=28,
        lifecycle_stage="eligible",
        care_program="pregnancy",
        risk_level="low",
        preferred_channel="sms",
        language="English",
        insurance_type="Employer plan (Aetna)",
        care_team={"nurse_name": "Sarah Thompson, RN", "provider_name": "Dr. Lisa Chen, OB-GYN"},
        risk_factors=["First pregnancy", "No prior prenatal care"],
        recent_interactions=[],
        clinical_notes="Test clinical notes for Maria.",
        enrollment_date=None,
        last_interaction_date=None,
        missed_appointments=0,
    )


class TestBuildUserPrompt:
    def test_contains_patient_info(self):
        patient = _make_test_patient()
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "Maria Gonzalez" in prompt
        assert "28" in prompt
        assert "Eligible" in prompt
        assert "Pregnancy" in prompt
        assert "Low Risk" in prompt

    def test_contains_care_team(self):
        patient = _make_test_patient()
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "Sarah Thompson, RN" in prompt
        assert "Dr. Lisa Chen, OB-GYN" in prompt

    def test_contains_risk_factors(self):
        patient = _make_test_patient()
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "First pregnancy" in prompt
        assert "No prior prenatal care" in prompt

    def test_contains_outreach_settings(self):
        patient = _make_test_patient()
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "Enrollment" in prompt
        assert "Warm & Supportive" in prompt
        assert "SMS" in prompt

    def test_no_interactions_message(self):
        patient = _make_test_patient()
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "No prior interactions" in prompt

    def test_with_interactions(self):
        patient = Patient(
            **{
                **_make_test_patient().model_dump(),
                "recent_interactions": [
                    {"date": "2026-02-20", "type": "Call", "summary": "Discussed care plan"},
                ],
            }
        )
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "Call" in prompt
        assert "Discussed care plan" in prompt
        assert "Feb" in prompt

    def test_not_enrolled_date(self):
        patient = _make_test_patient()
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "Not enrolled" in prompt

    def test_enrolled_date(self):
        patient = Patient(
            **{**_make_test_patient().model_dump(), "enrollment_date": "2026-01-15"}
        )
        prompt = build_user_prompt(patient, "enrollment", "warm-supportive", ["sms"])
        assert "Jan" in prompt
        assert "15" in prompt

    def test_multiple_channels_in_prompt(self):
        patient = _make_test_patient()
        prompt = build_user_prompt(
            patient, "enrollment", "warm-supportive", ["sms", "email"]
        )
        assert "SMS, Email" in prompt

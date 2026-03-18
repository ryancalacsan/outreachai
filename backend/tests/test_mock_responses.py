import json
from pathlib import Path

from app.data.mock_responses import get_mock_response


class TestGetMockResponse:
    def test_exact_match(self):
        r = get_mock_response("maria", "enrollment", "warm-supportive", ["sms"])
        assert r.provider == "mock"
        assert len(r.channel_messages) > 0
        assert all(cm.channel == "sms" for cm in r.channel_messages)

    def test_goal_fallback(self):
        """Maria has enrollment/warm-supportive but not enrollment/urgent-action."""
        r = get_mock_response("maria", "enrollment", "urgent-action", ["sms", "email"])
        assert r.provider == "mock"
        assert len(r.channel_messages) > 0

    def test_tone_fallback(self):
        """Maria has warm-supportive but not for appointment-reminder goal."""
        r = get_mock_response("maria", "appointment-reminder", "warm-supportive", ["sms"])
        assert r.provider == "mock"

    def test_patient_fallback(self):
        """Maria has scenarios — requesting a nonexistent goal+tone falls back to first scenario."""
        r = get_mock_response("maria", "win-back", "urgent-action", ["sms"])
        assert r.provider == "mock"
        assert len(r.channel_messages) > 0

    def test_default_fallback(self):
        """A patient ID with no scenarios at all falls back to defaultResponse."""
        r = get_mock_response("nonexistent-patient", "enrollment", "warm-supportive", ["sms"])
        assert r.provider == "mock"
        assert len(r.channel_messages) > 0

    def test_channel_filtering(self):
        """Only requested channels are returned."""
        r = get_mock_response("maria", "enrollment", "warm-supportive", ["email"])
        channels = [cm.channel for cm in r.channel_messages]
        assert channels == ["email"]

    def test_multiple_channels(self):
        r = get_mock_response("maria", "enrollment", "warm-supportive", ["sms", "email", "in-app"])
        channels = {cm.channel for cm in r.channel_messages}
        assert channels == {"sms", "email", "in-app"}

    def test_empty_channels_returns_empty_array(self):
        r = get_mock_response("maria", "enrollment", "warm-supportive", [])
        assert r.channel_messages == []

    def test_generated_at_is_fresh(self):
        r1 = get_mock_response("maria", "enrollment", "warm-supportive", ["sms"])
        r2 = get_mock_response("maria", "enrollment", "warm-supportive", ["sms"])
        # Both should have timestamps, but they're generated per-call
        assert r1.generated_at is not None
        assert r2.generated_at is not None


class TestMockJsonSync:
    def test_json_files_are_in_sync(self):
        """Ensure the Python and TypeScript mock JSON files are identical."""
        py_path = Path(__file__).parents[1] / "app/data/mock_responses.json"
        ts_path = Path(__file__).parents[2] / "src/lib/data/mock-responses.json"
        assert json.loads(py_path.read_text()) == json.loads(ts_path.read_text()), (
            "backend/app/data/mock_responses.json is out of sync with "
            "src/lib/data/mock-responses.json — copy the updated file"
        )

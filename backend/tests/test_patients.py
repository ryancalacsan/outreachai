from app.data.patients import get_patient_by_id, patients


class TestPatientData:
    def test_four_patients_exist(self):
        assert len(patients) == 4

    def test_patient_ids(self):
        ids = {p.id for p in patients}
        assert ids == {"maria", "ashley", "keisha", "jennifer"}

    def test_get_patient_by_id_found(self):
        p = get_patient_by_id("maria")
        assert p is not None
        assert p.name == "Maria Gonzalez"
        assert p.age == 28

    def test_get_patient_by_id_all(self):
        for patient in patients:
            found = get_patient_by_id(patient.id)
            assert found is not None
            assert found.id == patient.id

    def test_get_patient_by_id_not_found(self):
        assert get_patient_by_id("nobody") is None
        assert get_patient_by_id("") is None

    def test_maria_profile(self):
        p = get_patient_by_id("maria")
        assert p.lifecycle_stage == "eligible"
        assert p.care_program == "pregnancy"
        assert p.risk_level == "low"
        assert p.enrollment_date is None
        assert len(p.recent_interactions) == 0

    def test_keisha_profile(self):
        p = get_patient_by_id("keisha")
        assert p.lifecycle_stage == "at-risk"
        assert p.risk_level == "high"
        assert p.missed_appointments == 2
        assert len(p.recent_interactions) == 3

    def test_jennifer_profile(self):
        p = get_patient_by_id("jennifer")
        assert p.care_program == "midlife"
        assert p.preferred_channel == "email"

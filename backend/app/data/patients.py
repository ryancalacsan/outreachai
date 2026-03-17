from app.models import Patient


patients: list[Patient] = [
    Patient(
        id="maria",
        name="Maria Gonzalez",
        age=28,
        lifecycle_stage="eligible",
        care_program="pregnancy",
        risk_level="low",
        preferred_channel="sms",
        language="English",
        insurance_type="Employer plan (Aetna)",
        care_team={
            "nurse_name": "Sarah Thompson, RN",
            "provider_name": "Dr. Lisa Chen, OB-GYN",
        },
        risk_factors=["First pregnancy", "No prior prenatal care established"],
        recent_interactions=[],
        clinical_notes=(
            "Eligible through employer benefit. First pregnancy, 12 weeks gestation "
            "based on health plan data. No previous engagement with care programs. "
            "Primary care physician referral noted in eligibility file."
        ),
        enrollment_date=None,
        last_interaction_date=None,
        missed_appointments=0,
    ),
    Patient(
        id="ashley",
        name="Ashley Williams",
        age=34,
        lifecycle_stage="onboarding",
        care_program="pregnancy",
        risk_level="moderate",
        preferred_channel="email",
        language="English",
        insurance_type="Medicaid (Managed Care)",
        care_team={
            "nurse_name": "Michelle Rivera, RN",
            "provider_name": "Dr. James Okafor, MFM",
        },
        risk_factors=[
            "History of preterm birth",
            "Gestational hypertension in prior pregnancy",
            "Second pregnancy",
        ],
        recent_interactions=[
            {
                "date": "2026-02-20",
                "type": "Enrollment call",
                "summary": (
                    "Completed enrollment via phone. Expressed interest in 24/7 text "
                    "support. Mentioned feeling overwhelmed with work schedule."
                ),
            },
        ],
        clinical_notes=(
            "Enrolled 2 weeks ago via phone outreach. Has not yet scheduled initial "
            "virtual visit with care team. Prior pregnancy resulted in delivery at 35 "
            "weeks. Currently 18 weeks gestation. Works full-time as a retail manager "
            "with irregular hours."
        ),
        enrollment_date="2026-02-20",
        last_interaction_date="2026-02-20",
        missed_appointments=0,
    ),
    Patient(
        id="keisha",
        name="Keisha Johnson",
        age=31,
        lifecycle_stage="at-risk",
        care_program="pregnancy",
        risk_level="high",
        preferred_channel="sms",
        language="English",
        insurance_type="Medicaid",
        care_team={
            "nurse_name": "Patricia Hawkins, RN",
            "provider_name": "Dr. Rebecca Martinez, OB-GYN",
        },
        risk_factors=[
            "Gestational diabetes (diagnosed week 24)",
            "BMI > 30",
            "Limited transportation access",
            "Food insecurity noted",
        ],
        recent_interactions=[
            {
                "date": "2026-01-15",
                "type": "Virtual visit",
                "summary": (
                    "Reviewed blood glucose log with nurse. Levels improving but "
                    "inconsistent. Patient mentioned difficulty affording glucose "
                    "testing strips."
                ),
            },
            {
                "date": "2026-01-22",
                "type": "Missed check-in",
                "summary": "Scheduled phone check-in — no answer. Voicemail left.",
            },
            {
                "date": "2026-02-01",
                "type": "Missed check-in",
                "summary": (
                    "Second consecutive missed check-in. SMS sent with no response."
                ),
            },
        ],
        clinical_notes=(
            "Was actively engaged for 3 months after enrollment. Gestational diabetes "
            "diagnosed at week 24, currently 30 weeks. Last two scheduled check-ins "
            "missed. Previously responsive to SMS. Social worker referral in progress "
            "for food assistance program. Transportation barriers noted — relies on "
            "public transit."
        ),
        enrollment_date="2025-11-01",
        last_interaction_date="2026-01-15",
        missed_appointments=2,
    ),
    Patient(
        id="jennifer",
        name="Jennifer Park",
        age=45,
        lifecycle_stage="at-risk",
        care_program="midlife",
        risk_level="low",
        preferred_channel="email",
        language="English",
        insurance_type="Employer plan (UnitedHealthcare)",
        care_team={
            "nurse_name": "Angela Foster, RN",
            "provider_name": "Dr. Priya Sharma, Women's Health",
        },
        risk_factors=[
            "Perimenopause symptoms (hot flashes, sleep disruption)",
            "Mild anxiety",
            "Family history of osteoporosis",
        ],
        recent_interactions=[
            {
                "date": "2026-01-10",
                "type": "Virtual visit",
                "summary": (
                    "Discussed HRT options with provider. Patient requested time to "
                    "think about it. Seemed engaged but uncertain."
                ),
            },
            {
                "date": "2026-01-25",
                "type": "In-app message",
                "summary": (
                    "Nurse sent follow-up message about HRT decision. Patient read "
                    "but did not respond."
                ),
            },
            {
                "date": "2026-02-15",
                "type": "Educational content",
                "summary": (
                    "Sent article on managing perimenopause symptoms naturally. "
                    "No engagement tracked."
                ),
            },
        ],
        clinical_notes=(
            "Enrolled 4 months ago, initially very engaged with weekly check-ins. "
            "Engagement has tapered significantly over the past 6 weeks. Appears to "
            "be at a decision point regarding HRT. May benefit from peer support or "
            "additional education. No clinical urgency but sustained disengagement "
            "could lead to churn."
        ),
        enrollment_date="2025-10-15",
        last_interaction_date="2026-01-10",
        missed_appointments=0,
    ),
]


def get_patient_by_id(patient_id: str) -> Patient | None:
    """Look up a patient by ID."""
    return next((p for p in patients if p.id == patient_id), None)

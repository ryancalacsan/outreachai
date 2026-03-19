from datetime import datetime

from app.models import (
    Patient,
    OutreachGoal,
    MessageTone,
    Channel,
)

LIFECYCLE_STAGE_LABELS: dict[str, str] = {
    "eligible": "Eligible — Not Enrolled",
    "onboarding": "Newly Enrolled",
    "engaged": "Actively Engaged",
    "at-risk": "At Risk",
    "lapsed": "Lapsed",
}

CARE_PROGRAM_LABELS: dict[str, str] = {
    "pregnancy": "Pregnancy",
    "postpartum": "Postpartum",
    "pediatric": "Pediatric",
    "midlife": "Midlife / Menopause",
}

RISK_LEVEL_LABELS: dict[str, str] = {
    "low": "Low Risk",
    "moderate": "Moderate Risk",
    "high": "High Risk",
}

GOAL_LABELS: dict[str, str] = {
    "enrollment": "Enrollment",
    "onboarding": "Onboarding",
    "appointment-reminder": "Appointment Reminder",
    "re-engagement": "Re-engagement",
    "win-back": "Win-back",
    "educational": "Educational",
}

TONE_LABELS: dict[str, str] = {
    "warm-supportive": "Warm & Supportive",
    "clinical-informative": "Clinical & Informative",
    "urgent-action": "Urgent & Action-Oriented",
    "casual-friendly": "Casual & Friendly",
}

CHANNEL_LABELS: dict[str, str] = {
    "sms": "SMS",
    "email": "Email",
    "in-app": "In-App",
}

CHANNEL_RULES: dict[str, str] = {
    "sms": (
        '- SMS: Keep concise. Aim for under 300 characters when possible. '
        'Include a clear, simple call-to-action (e.g., "Reply YES", "Text us anytime"). '
        "No subject line needed."
    ),
    "email": (
        "- Email: Include a clear, non-clickbait subject line. Use a warm, personal tone "
        "as if writing from the named nurse or care coordinator. Structure with short "
        "paragraphs, bullet points for benefits/services. Include a sign-off with the care "
        "team member's name and title."
    ),
    "in-app": (
        "- In-App: Very brief (1-2 sentences). Works as both a push notification and "
        "in-app banner. Include a tap/action prompt."
    ),
}

CHANNEL_SCHEMA: dict[str, str] = {
    "sms": '"sms"',
    "email": '"email"',
    "in-app": '"in-app"',
}


def format_date(date_str: str) -> str:
    """Format a date string like 'Jan 15, 2026'."""
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{dt.strftime('%b')} {dt.day}, {dt.year}"


def build_system_prompt(channels: list[Channel]) -> str:
    """Build the system prompt with channel-specific rules and JSON schema."""
    rules = "\n".join(CHANNEL_RULES[c] for c in channels)
    allowed_channels = " | ".join(CHANNEL_SCHEMA[c] for c in channels)
    channel_count = len(channels)
    plural = "" if channel_count == 1 else "s"
    channel_names = ", ".join(CHANNEL_LABELS[c] for c in channels)

    return f"""You are an AI assistant helping a care coordination team at a virtual maternal and women's healthcare company craft personalized patient outreach messages.

CRITICAL GUIDELINES:
- You are writing AS a care team member (nurse, care coordinator) — not as a marketing department
- Never use aggressive sales language, urgency tactics, or clickbait
- Messages must feel warm, human, and clinically trustworthy
- Consider health literacy — use clear, simple language accessible to all education levels
- Be culturally sensitive and avoid assumptions about family structure, support systems, or beliefs
- Reference specific care services relevant to the patient (e.g., "your nurse care partner", "24/7 text support", "virtual visits")
- Use the patient's first name and their care team members' names when appropriate

CHANNEL RULES (generate ONLY for these channels):
{rules}

FOR EACH CHANNEL, generate exactly 3 message variants with different approaches:
1. An empathy-led approach (acknowledges the patient's situation and feelings)
2. A value/resource-led approach (highlights specific benefits or resources available)
3. A contextually appropriate third approach (could be education-led, milestone-based, clinical-urgency, or peer-support depending on the patient's situation)

For each variant, also provide:
- A short label for the approach (2-3 words, e.g., "Empathy-led", "Resource-focused")
- An engagement likelihood assessment: "high", "medium", or "low"
- A brief reasoning (2-3 sentences) explaining WHY this message would or wouldn't resonate with THIS specific patient, referencing their clinical context, risk factors, and communication preferences

RESPOND WITH VALID JSON ONLY. The channelMessages array must contain exactly {channel_count} item{plural} ({channel_names}):
{{
  "channelMessages": [
    {{
      "channel": {allowed_channels},
      "variants": [
        {{
          "id": "<channel>-<letter>",
          "approach": "<short approach label>",
          "content": "<the message text>",
          "subject": "<email subject line — ONLY include for email channel>",
          "engagementLikelihood": "high" | "medium" | "low",
          "reasoning": "<why this works for this patient>"
        }}
      ]
    }}
  ]
}}"""


def build_user_prompt(
    patient: Patient,
    goal: OutreachGoal,
    tone: MessageTone,
    channels: list[Channel],
) -> str:
    """Build the user prompt with patient context and outreach settings."""
    if patient.recent_interactions:
        recent_interactions = "\n".join(
            f"- {format_date(i.date)}: {i.type} — {i.summary}"
            for i in patient.recent_interactions
        )
    else:
        recent_interactions = "No prior interactions"

    enrollment = (
        format_date(patient.enrollment_date) if patient.enrollment_date else "Not enrolled"
    )
    last_interaction = (
        format_date(patient.last_interaction_date)
        if patient.last_interaction_date
        else "None"
    )
    risk_factors = "\n".join(f"- {f}" for f in patient.risk_factors)
    channel_names = ", ".join(CHANNEL_LABELS[c] for c in channels)

    return f"""Generate personalized outreach messages for the following patient:

PATIENT PROFILE:
- Name: {patient.name}
- Age: {patient.age}
- Lifecycle Stage: {LIFECYCLE_STAGE_LABELS[patient.lifecycle_stage]}
- Care Program: {CARE_PROGRAM_LABELS[patient.care_program]}
- Risk Level: {RISK_LEVEL_LABELS[patient.risk_level]}
- Preferred Channel: {CHANNEL_LABELS[patient.preferred_channel]}
- Language: {patient.language}
- Insurance: {patient.insurance_type}
- Enrollment Date: {enrollment}
- Last Interaction: {last_interaction}
- Missed Appointments: {patient.missed_appointments}

CARE TEAM:
- Nurse: {patient.care_team.nurse_name}
- Provider: {patient.care_team.provider_name}

RISK FACTORS:
{risk_factors}

CLINICAL NOTES:
{patient.clinical_notes}

RECENT INTERACTIONS:
{recent_interactions}

OUTREACH SETTINGS:
- Goal: {GOAL_LABELS[goal]}
- Tone: {TONE_LABELS[tone]}
- Channels: {channel_names}

Tailor every message to this specific patient's situation, risk factors, and clinical context."""

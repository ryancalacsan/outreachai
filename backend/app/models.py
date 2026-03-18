from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel


# --- Type aliases (match TypeScript string unions) ---

LifecycleStage = Literal["eligible", "onboarding", "engaged", "at-risk", "lapsed"]
CareProgram = Literal["pregnancy", "postpartum", "pediatric", "midlife"]
RiskLevel = Literal["low", "moderate", "high"]
Channel = Literal["sms", "email", "in-app"]
OutreachGoal = Literal[
    "enrollment",
    "onboarding",
    "appointment-reminder",
    "re-engagement",
    "win-back",
    "educational",
]
MessageTone = Literal[
    "warm-supportive", "clinical-informative", "urgent-action", "casual-friendly"
]
LLMProvider = Literal["claude", "claude-haiku", "gemini", "gemini-lite", "gemini-preview", "mock"]
LiveProvider = Literal["claude", "claude-haiku", "gemini", "gemini-lite", "gemini-preview"]


# --- Nested models ---

class CareTeam(BaseModel):
    nurse_name: str
    provider_name: str


class RecentInteraction(BaseModel):
    date: str
    type: str
    summary: str


# --- Core domain models ---

class Patient(BaseModel):
    id: str
    name: str
    age: int
    lifecycle_stage: LifecycleStage
    care_program: CareProgram
    risk_level: RiskLevel
    preferred_channel: Channel
    language: str
    insurance_type: str
    care_team: CareTeam
    risk_factors: list[str]
    recent_interactions: list[RecentInteraction]
    clinical_notes: str
    enrollment_date: str | None
    last_interaction_date: str | None
    missed_appointments: int


class MessageVariant(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    approach: str
    content: str
    subject: str | None = None  # email only
    engagement_likelihood: Literal["high", "medium", "low"]
    reasoning: str


class ChannelMessages(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    channel: Channel
    variants: list[MessageVariant]


# --- LLM result (shape returned by LLMs) ---

class LLMResult(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    channel_messages: list[ChannelMessages]

    @classmethod
    def from_llm_json(cls, data: dict) -> "LLMResult":
        """Parse LLM JSON which uses camelCase keys."""
        return cls.model_validate(data)


# --- API request/response ---

class GenerateRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    patient_id: str
    goal: OutreachGoal
    tone: MessageTone
    channels: list[Channel]
    provider: LLMProvider
    access_code: str | None = None

    @field_validator("channels")
    @classmethod
    def channels_not_empty(cls, v: list[Channel]) -> list[Channel]:
        if not v:
            raise ValueError("At least one channel is required")
        return v


class GenerateResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    channel_messages: list[ChannelMessages]
    provider: LLMProvider
    generated_at: str

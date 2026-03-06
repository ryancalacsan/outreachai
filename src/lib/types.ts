export type LifecycleStage =
  | "eligible"
  | "onboarding"
  | "engaged"
  | "at-risk"
  | "lapsed";

export type CareProgram =
  | "pregnancy"
  | "postpartum"
  | "pediatric"
  | "midlife";

export type RiskLevel = "low" | "moderate" | "high";

export type Channel = "sms" | "email" | "in-app";

export type OutreachGoal =
  | "enrollment"
  | "onboarding"
  | "appointment-reminder"
  | "re-engagement"
  | "win-back"
  | "educational";

export type MessageTone =
  | "warm-supportive"
  | "clinical-informative"
  | "urgent-action"
  | "casual-friendly";

export type LLMProvider = "claude" | "gemini" | "gemini-lite" | "gemini-preview" | "mock";

export interface Patient {
  id: string;
  name: string;
  age: number;
  lifecycleStage: LifecycleStage;
  careProgram: CareProgram;
  riskLevel: RiskLevel;
  preferredChannel: Channel;
  language: string;
  insuranceType: string;
  careTeam: {
    nurseName: string;
    providerName: string;
  };
  riskFactors: string[];
  recentInteractions: {
    date: string;
    type: string;
    summary: string;
  }[];
  clinicalNotes: string;
  enrollmentDate: string | null;
  lastInteractionDate: string | null;
  missedAppointments: number;
}

export interface MessageVariant {
  id: string;
  approach: string;
  content: string;
  subject?: string; // email only
  engagementLikelihood: "high" | "medium" | "low";
  reasoning: string;
}

export interface ChannelMessages {
  channel: Channel;
  variants: MessageVariant[];
}

export interface GenerateRequest {
  patientId: string;
  goal: OutreachGoal;
  tone: MessageTone;
  channels: Channel[];
  provider: LLMProvider;
  accessCode?: string;
}

export interface GenerateResponse {
  channelMessages: ChannelMessages[];
  provider: LLMProvider;
  generatedAt: string;
}

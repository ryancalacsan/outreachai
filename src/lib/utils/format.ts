import {
  LifecycleStage,
  CareProgram,
  RiskLevel,
  OutreachGoal,
  MessageTone,
  Channel,
} from "@/lib/types";

export const lifecycleStageLabels: Record<LifecycleStage, string> = {
  eligible: "Eligible — Not Enrolled",
  onboarding: "Newly Enrolled",
  engaged: "Actively Engaged",
  "at-risk": "At Risk",
  lapsed: "Lapsed",
};

export const careProgramLabels: Record<CareProgram, string> = {
  pregnancy: "Pregnancy",
  postpartum: "Postpartum",
  pediatric: "Pediatric",
  midlife: "Midlife / Menopause",
};

export const riskLevelLabels: Record<RiskLevel, string> = {
  low: "Low Risk",
  moderate: "Moderate Risk",
  high: "High Risk",
};

export const goalLabels: Record<OutreachGoal, string> = {
  enrollment: "Enrollment",
  onboarding: "Onboarding",
  "appointment-reminder": "Appointment Reminder",
  "re-engagement": "Re-engagement",
  "win-back": "Win-back",
  educational: "Educational",
};

export const toneLabels: Record<MessageTone, string> = {
  "warm-supportive": "Warm & Supportive",
  "clinical-informative": "Clinical & Informative",
  "urgent-action": "Urgent & Action-Oriented",
  "casual-friendly": "Casual & Friendly",
};

export const channelLabels: Record<Channel, string> = {
  sms: "SMS",
  email: "Email",
  "in-app": "In-App",
};

export const lifecycleStageColors: Record<LifecycleStage, string> = {
  eligible: "bg-blue-100 text-blue-800",
  onboarding: "bg-teal-100 text-teal-800",
  engaged: "bg-green-100 text-green-800",
  "at-risk": "bg-amber-100 text-amber-800",
  lapsed: "bg-red-100 text-red-800",
};

export const riskLevelColors: Record<RiskLevel, string> = {
  low: "bg-green-100 text-green-800",
  moderate: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

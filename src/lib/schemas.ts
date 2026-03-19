import { z } from "zod";

export const lifecycleStageSchema = z.enum([
  "eligible",
  "onboarding",
  "engaged",
  "at-risk",
  "lapsed",
]);

export const careProgramSchema = z.enum([
  "pregnancy",
  "postpartum",
  "pediatric",
  "midlife",
]);

export const riskLevelSchema = z.enum(["low", "moderate", "high"]);

export const channelSchema = z.enum(["sms", "email", "in-app"]);

export const outreachGoalSchema = z.enum([
  "enrollment",
  "onboarding",
  "appointment-reminder",
  "re-engagement",
  "win-back",
  "educational",
]);

export const messageToneSchema = z.enum([
  "warm-supportive",
  "clinical-informative",
  "urgent-action",
  "casual-friendly",
]);

export const llmProviderSchema = z.enum([
  "claude",
  "claude-haiku",
  "gemini",
  "gemini-lite",
  "gemini-preview",
  "mock",
]);

export const liveProviderSchema = z.enum([
  "claude",
  "claude-haiku",
  "gemini",
  "gemini-lite",
  "gemini-preview",
]);

export const engagementLikelihoodSchema = z.enum(["high", "medium", "low"]);

export const patientSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  lifecycleStage: lifecycleStageSchema,
  careProgram: careProgramSchema,
  riskLevel: riskLevelSchema,
  preferredChannel: channelSchema,
  language: z.string(),
  insuranceType: z.string(),
  careTeam: z.object({
    nurseName: z.string(),
    providerName: z.string(),
  }),
  riskFactors: z.array(z.string()),
  recentInteractions: z.array(
    z.object({
      date: z.string(),
      type: z.string(),
      summary: z.string(),
    })
  ),
  clinicalNotes: z.string(),
  enrollmentDate: z.string().nullable(),
  lastInteractionDate: z.string().nullable(),
  missedAppointments: z.number(),
});

export const messageVariantSchema = z.object({
  id: z.string(),
  approach: z.string(),
  content: z.string(),
  subject: z.string().optional(),
  engagementLikelihood: engagementLikelihoodSchema,
  reasoning: z.string(),
});

export const channelMessagesSchema = z.object({
  channel: channelSchema,
  variants: z.array(messageVariantSchema),
});

export const generateRequestSchema = z.object({
  patientId: z.string().min(1).max(100),
  goal: outreachGoalSchema,
  tone: messageToneSchema,
  channels: z.array(channelSchema).min(1, "At least one channel is required"),
  provider: llmProviderSchema,
  accessCode: z.string().optional(),
});

export const generateResponseSchema = z.object({
  channelMessages: z.array(channelMessagesSchema),
  provider: llmProviderSchema,
  generatedAt: z.string(),
});

export const llmResultSchema = z.object({
  channelMessages: z.array(channelMessagesSchema),
});

export const sseChunkEventSchema = z.object({
  type: z.literal("chunk"),
  text: z.string(),
});

export const sseDoneEventSchema = z.object({
  type: z.literal("done"),
  response: generateResponseSchema,
});

export const sseErrorEventSchema = z.object({
  type: z.literal("error"),
  error: z.string(),
});

export const sseEventSchema = z.discriminatedUnion("type", [
  sseChunkEventSchema,
  sseDoneEventSchema,
  sseErrorEventSchema,
]);

export const serverEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  DEMO_ACCESS_CODE: z.string().min(1).optional(),
});

export type LifecycleStage = z.infer<typeof lifecycleStageSchema>;
export type CareProgram = z.infer<typeof careProgramSchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type Channel = z.infer<typeof channelSchema>;
export type OutreachGoal = z.infer<typeof outreachGoalSchema>;
export type MessageTone = z.infer<typeof messageToneSchema>;
export type LLMProvider = z.infer<typeof llmProviderSchema>;
export type LiveProvider = z.infer<typeof liveProviderSchema>;
export type EngagementLikelihood = z.infer<typeof engagementLikelihoodSchema>;
export type Patient = z.infer<typeof patientSchema>;
export type MessageVariant = z.infer<typeof messageVariantSchema>;
export type ChannelMessages = z.infer<typeof channelMessagesSchema>;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;
export type GenerateResponse = z.infer<typeof generateResponseSchema>;
export type LLMGenerateResult = z.infer<typeof llmResultSchema>;
export type SSEEvent = z.infer<typeof sseEventSchema>;

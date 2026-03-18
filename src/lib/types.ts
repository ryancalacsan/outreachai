// All types are now derived from Zod schemas — single source of truth.
// Re-exported here so existing imports continue to work unchanged.
export type {
  LifecycleStage,
  CareProgram,
  RiskLevel,
  Channel,
  OutreachGoal,
  MessageTone,
  LLMProvider,
  Patient,
  MessageVariant,
  ChannelMessages,
  GenerateRequest,
  GenerateResponse,
} from "./schemas";

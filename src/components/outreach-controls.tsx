"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OutreachGoal,
  MessageTone,
  Channel,
  LLMProvider,
  LifecycleStage,
  Patient,
} from "@/lib/types";
import { goalLabels, toneLabels } from "@/lib/utils/format";
import {
  Sparkles,
  Lock,
  MessageSquare,
  Mail,
  Bell,
  Loader2,
} from "lucide-react";

const lifecycleGoalDefaults: Record<LifecycleStage, OutreachGoal> = {
  eligible: "enrollment",
  onboarding: "appointment-reminder",
  engaged: "educational",
  "at-risk": "re-engagement",
  lapsed: "win-back",
};

interface OutreachControlsProps {
  onGenerate: (settings: {
    goal: OutreachGoal;
    tone: MessageTone;
    channels: Channel[];
    provider: LLMProvider;
    accessCode?: string;
  }) => void;
  isGenerating: boolean;
  disabled: boolean;
  patient?: Patient | null;
}

const goals: OutreachGoal[] = [
  "enrollment",
  "onboarding",
  "appointment-reminder",
  "re-engagement",
  "win-back",
  "educational",
];

const tones: MessageTone[] = [
  "warm-supportive",
  "clinical-informative",
  "urgent-action",
  "casual-friendly",
];

const channelConfig: { value: Channel; label: string; icon: React.ReactNode }[] =
  [
    {
      value: "sms",
      label: "SMS",
      icon: <MessageSquare className="h-3.5 w-3.5" />,
    },
    { value: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
    {
      value: "in-app",
      label: "In-App",
      icon: <Bell className="h-3.5 w-3.5" />,
    },
  ];

const providers: {
  value: LLMProvider;
  label: string;
  description: string;
}[] = [
  {
    value: "mock",
    label: "Demo Mode",
    description: "Pre-generated responses",
  },
  {
    value: "gemini-lite",
    label: "Gemini 2.5 Flash Lite",
    description: "Google — Fast & lightweight",
  },
  {
    value: "gemini",
    label: "Gemini 2.5 Flash",
    description: "Google — Balanced",
  },
  {
    value: "gemini-preview",
    label: "Gemini 3.1 Flash Lite",
    description: "Google — Latest preview",
  },
  {
    value: "claude-haiku",
    label: "Claude Haiku",
    description: "Anthropic — Fast & lightweight",
  },
  {
    value: "claude",
    label: "Claude Sonnet",
    description: "Anthropic — Highest quality",
  },
];

export function OutreachControls({
  onGenerate,
  isGenerating,
  disabled,
  patient,
}: OutreachControlsProps) {
  const [goal, setGoal] = useState<OutreachGoal>(
    patient ? lifecycleGoalDefaults[patient.lifecycleStage] : "re-engagement"
  );
  const [tone, setTone] = useState<MessageTone>("warm-supportive");
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(
    patient ? [patient.preferredChannel] : ["sms", "email"]
  );
  const [provider, setProvider] = useState<LLMProvider>("mock");
  const [accessCode, setAccessCode] = useState("");

  const toggleChannel = (channel: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const needsAccessCode = provider !== "mock";

  const handleGenerate = () => {
    onGenerate({
      goal,
      tone,
      channels: selectedChannels,
      provider,
      accessCode: needsAccessCode ? accessCode : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Section label */}
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          Outreach Configuration
        </span>
      </div>

      <div>
        <FieldLabel>Outreach Goal</FieldLabel>
        <Select
          value={goal}
          onValueChange={(v) => setGoal(v as OutreachGoal)}
        >
          <SelectTrigger className="w-full text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {goals.map((g) => (
              <SelectItem key={g} value={g} className="text-[13px]">
                {goalLabels[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel>Message Tone</FieldLabel>
        <Select
          value={tone}
          onValueChange={(v) => setTone(v as MessageTone)}
        >
          <SelectTrigger className="w-full text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tones.map((t) => (
              <SelectItem key={t} value={t} className="text-[13px]">
                {toneLabels[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel>Channels</FieldLabel>
        <div className="flex gap-1.5">
          {channelConfig.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={selectedChannels.includes(value)}
              onClick={() => toggleChannel(value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border py-2 text-[12px] font-medium transition-all duration-150 ${
                selectedChannels.includes(value)
                  ? "border-teal-400/50 bg-teal-50/60 text-teal-700 shadow-[0_0_0_1px_oklch(0.68_0.105_178_/_0.1)]"
                  : "border-border/60 bg-card text-muted-foreground hover:border-teal-300/40 hover:text-foreground"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>AI Model</FieldLabel>
        <Select
          value={provider}
          onValueChange={(v) => setProvider(v as LLMProvider)}
        >
          <SelectTrigger className="w-full text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providers.map((p) => (
              <SelectItem key={p.value} value={p.value} className="text-[13px]">
                <div className="flex items-center gap-2">
                  <span>{p.label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {p.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsAccessCode && (
        <div className="animate-fade-in-up">
          <FieldLabel htmlFor="access-code">
            <Lock className="h-3 w-3" />
            Access Code
          </FieldLabel>
          <input
            id="access-code"
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] placeholder:text-muted-foreground/40 focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={disabled || isGenerating || selectedChannels.length === 0}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-[13px] font-medium shadow-sm transition-all duration-200 hover:from-teal-700 hover:to-teal-800 hover:shadow-md disabled:from-muted disabled:to-muted"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Messages
          </>
        )}
      </Button>
    </div>
  );
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag
      {...(htmlFor ? { htmlFor } : { role: "presentation" })}
      className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60"
    >
      {children}
    </Tag>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/lib/types";
import {
  goalLabels,
  toneLabels,
  channelLabels,
} from "@/lib/utils/format";
import { Sparkles, Lock } from "lucide-react";

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

const channels: Channel[] = ["sms", "email", "in-app"];

const providers: { value: LLMProvider; label: string; description: string }[] = [
  { value: "mock", label: "Demo Mode", description: "Pre-generated responses" },
  { value: "gemini", label: "Gemini 2.5 Flash", description: "Google AI — Free tier" },
  { value: "claude", label: "Claude Sonnet", description: "Anthropic — API key required" },
];

export function OutreachControls({
  onGenerate,
  isGenerating,
  disabled,
}: OutreachControlsProps) {
  const [goal, setGoal] = useState<OutreachGoal>("re-engagement");
  const [tone, setTone] = useState<MessageTone>("warm-supportive");
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([
    "sms",
    "email",
  ]);
  const [provider, setProvider] = useState<LLMProvider>("mock");
  const [accessCode, setAccessCode] = useState("");

  const toggleChannel = (channel: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const needsAccessCode = provider === "claude" || provider === "gemini";

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
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Outreach Goal
        </label>
        <Select
          value={goal}
          onValueChange={(v) => setGoal(v as OutreachGoal)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {goals.map((g) => (
              <SelectItem key={g} value={g}>
                {goalLabels[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Message Tone
        </label>
        <Select
          value={tone}
          onValueChange={(v) => setTone(v as MessageTone)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tones.map((t) => (
              <SelectItem key={t} value={t}>
                {toneLabels[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Channels
        </label>
        <div className="flex flex-wrap gap-2">
          {channels.map((channel) => (
            <button
              key={channel}
              onClick={() => toggleChannel(channel)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedChannels.includes(channel)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              {channelLabels[channel]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          AI Model
        </label>
        <Select
          value={provider}
          onValueChange={(v) => setProvider(v as LLMProvider)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providers.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                <div className="flex items-center gap-2">
                  <span>{p.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsAccessCode && (
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Lock className="h-3 w-3" />
            Access Code
          </label>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code for live API"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={disabled || isGenerating || selectedChannels.length === 0}
        className="w-full"
        size="lg"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate Outreach Messages"}
      </Button>
    </div>
  );
}

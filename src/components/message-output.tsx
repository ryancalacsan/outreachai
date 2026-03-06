"use client";

import { useState } from "react";
import { GenerateResponse, Channel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { channelLabels } from "@/lib/utils/format";
import {
  MessageSquare,
  Mail,
  Bell,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Lightbulb,
  Zap,
} from "lucide-react";

const channelIcons: Record<Channel, React.ReactNode> = {
  sms: <MessageSquare className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  "in-app": <Bell className="h-3.5 w-3.5" />,
};

const engagementConfig: Record<
  string,
  { color: string; dotColor: string }
> = {
  high: {
    color: "text-emerald-700 bg-emerald-50 border-emerald-200/50",
    dotColor: "bg-emerald-500",
  },
  medium: {
    color: "text-amber-700 bg-amber-50 border-amber-200/50",
    dotColor: "bg-amber-500",
  },
  low: {
    color: "text-red-700 bg-red-50 border-red-200/50",
    dotColor: "bg-red-500",
  },
};

const variantAccents = ["variant-accent-a", "variant-accent-b", "variant-accent-c"];

interface MessageOutputProps {
  response: GenerateResponse;
}

export function MessageOutput({ response }: MessageOutputProps) {
  const firstChannel = response.channelMessages[0]?.channel ?? "sms";

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-teal-500" />
          <h2 className="text-[15px] font-semibold tracking-tight">
            Generated Messages
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {response.provider === "mock"
            ? "Demo Mode"
            : response.provider === "gemini"
              ? "Gemini 2.5 Flash"
              : response.provider === "gemini-lite"
                ? "Gemini 3.1 Flash Lite"
                : "Claude Sonnet"}
        </div>
      </div>

      <Tabs defaultValue={firstChannel}>
        <TabsList className="h-9">
          {response.channelMessages.map(({ channel }) => (
            <TabsTrigger
              key={channel}
              value={channel}
              className="gap-1.5 text-[12px]"
            >
              {channelIcons[channel]}
              {channelLabels[channel]}
              <span className="ml-0.5 text-[10px] text-muted-foreground">
                ({response.channelMessages.find((cm) => cm.channel === channel)?.variants.length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {response.channelMessages.map(({ channel, variants }) => (
          <TabsContent
            key={channel}
            value={channel}
            className="space-y-3 stagger-children"
          >
            {variants.map((variant, index) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                index={index}
                channel={channel}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function VariantCard({
  variant,
  index,
  channel,
}: {
  variant: GenerateResponse["channelMessages"][0]["variants"][0];
  index: number;
  channel: Channel;
}) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [copied, setCopied] = useState(false);
  const engagement = engagementConfig[variant.engagementLikelihood] || engagementConfig.medium;

  const handleCopy = async () => {
    const text = variant.subject
      ? `Subject: ${variant.subject}\n\n${variant.content}`
      : variant.content;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-lg border border-border/60 bg-card shadow-sm ${variantAccents[index] || ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded text-[11px] font-semibold text-teal-700 bg-teal-50 ring-1 ring-teal-200/40">
            {String.fromCharCode(65 + index)}
          </span>
          <span className="text-[12px] font-medium text-muted-foreground">
            {variant.approach}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${engagement.color}`}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${engagement.dotColor}`} />
            {variant.engagementLikelihood}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0 text-muted-foreground/50 hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Email subject line */}
        {channel === "email" && variant.subject && (
          <div className="mb-3 flex items-baseline gap-2 rounded-md bg-muted/30 px-3 py-2">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Subject
            </span>
            <span className="text-[13px] font-medium">{variant.subject}</span>
          </div>
        )}

        {/* Message */}
        <p className="text-[13px] leading-[1.7] whitespace-pre-wrap text-foreground/90">
          {variant.content}
        </p>
      </div>

      {/* Reasoning footer */}
      <div className="border-t border-border/30">
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex w-full items-center gap-1.5 px-4 py-2 text-[11px] font-medium text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          <Lightbulb className="h-3 w-3" />
          Why this works
          {showReasoning ? (
            <ChevronUp className="ml-auto h-3 w-3" />
          ) : (
            <ChevronDown className="ml-auto h-3 w-3" />
          )}
        </button>
        {showReasoning && (
          <div className="animate-fade-in-up border-t border-border/20 bg-muted/15 px-4 py-3">
            <p className="text-[12px] leading-[1.6] text-muted-foreground">
              {variant.reasoning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

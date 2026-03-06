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
} from "lucide-react";

const channelIcons: Record<Channel, React.ReactNode> = {
  sms: <MessageSquare className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  "in-app": <Bell className="h-4 w-4" />,
};

const engagementColors: Record<string, string> = {
  high: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-red-100 text-red-800",
};

interface MessageOutputProps {
  response: GenerateResponse;
}

export function MessageOutput({ response }: MessageOutputProps) {
  const firstChannel = response.channelMessages[0]?.channel ?? "sms";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generated Messages</h2>
        <Badge variant="outline" className="text-xs">
          {response.provider === "mock"
            ? "Demo Mode"
            : response.provider === "gemini"
              ? "Gemini 2.5 Flash"
              : "Claude Sonnet"}
        </Badge>
      </div>

      <Tabs defaultValue={firstChannel}>
        <TabsList>
          {response.channelMessages.map(({ channel }) => (
            <TabsTrigger key={channel} value={channel} className="gap-1.5">
              {channelIcons[channel]}
              {channelLabels[channel]}
            </TabsTrigger>
          ))}
        </TabsList>

        {response.channelMessages.map(({ channel, variants }) => (
          <TabsContent key={channel} value={channel} className="space-y-3">
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

  const handleCopy = async () => {
    const text = variant.subject
      ? `Subject: ${variant.subject}\n\n${variant.content}`
      : variant.content;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Variant {String.fromCharCode(65 + index)}
          </span>
          <Badge variant="secondary" className="text-xs">
            {variant.approach}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`text-xs ${engagementColors[variant.engagementLikelihood]}`}
          >
            {variant.engagementLikelihood} likelihood
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Email subject line */}
      {channel === "email" && variant.subject && (
        <div className="mb-2 rounded-md bg-muted/50 px-3 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Subject:{" "}
          </span>
          <span className="text-sm">{variant.subject}</span>
        </div>
      )}

      {/* Message content */}
      <div className="rounded-md bg-muted/30 px-4 py-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {variant.content}
        </p>
      </div>

      {/* Reasoning toggle */}
      <button
        onClick={() => setShowReasoning(!showReasoning)}
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Lightbulb className="h-3 w-3" />
        Why this works
        {showReasoning ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>
      {showReasoning && (
        <div className="mt-2 rounded-md border border-border/50 bg-accent/30 px-3 py-2">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {variant.reasoning}
          </p>
        </div>
      )}
    </div>
  );
}

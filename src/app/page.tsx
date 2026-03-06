"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { CampaignView } from "@/components/campaign-view";
import { PatientCard } from "@/components/patient-card";
import { PatientSelect } from "@/components/patient-select";
import { OutreachControls } from "@/components/outreach-controls";
import { MessageOutput } from "@/components/message-output";
import { MobileControlsDrawer } from "@/components/mobile-controls-drawer";
import { patients } from "@/lib/data/patients";
import { generateMessages, generateMessagesStream } from "@/lib/api";
import { Patient, GenerateResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, AlertCircle } from "lucide-react";

export default function Home() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamChars, setStreamChars] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleGenerate = async (
    settings: Omit<Parameters<typeof generateMessages>[0], "patientId">
  ) => {
    if (!selectedPatient) return;

    setIsGenerating(true);
    setIsStreaming(false);
    setStreamChars(0);
    setError(null);
    setResponse(null);

    const request = {
      patientId: selectedPatient.id,
      ...settings,
    };

    // Use streaming for live providers, regular fetch for mock
    if (settings.provider !== "mock") {
      try {
        setIsStreaming(true);
        await generateMessagesStream(request, {
          onChunk: (_text, accumulated) => {
            setStreamChars(accumulated.length);
          },
          onDone: (result) => {
            setResponse(result);
            setIsGenerating(false);
            setIsStreaming(false);
          },
          onError: (errorMsg) => {
            setError(errorMsg);
            setIsGenerating(false);
            setIsStreaming(false);
          },
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate messages"
        );
        setIsGenerating(false);
        setIsStreaming(false);
      }
    } else {
      try {
        const result = await generateMessages(request);
        setResponse(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate messages"
        );
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleBack = () => {
    setSelectedPatient(null);
    setResponse(null);
    setError(null);
  };

  // Campaign dashboard view
  if (!selectedPatient) {
    return (
      <div className="flex h-screen flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <CampaignView onSelectPatient={(patient) => {
            setSelectedPatient(patient);
            // Auto-open drawer on mobile
            if (window.innerWidth < 768) {
              setDrawerOpen(true);
            }
          }} />
        </main>
      </div>
    );
  }

  // Patient outreach generation view
  const mainContent = (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Patient context card */}
      <PatientCard patient={selectedPatient} />

      {/* Error state */}
      {error && (
        <div className="animate-fade-in-up flex items-start gap-3 rounded-lg border border-red-200/60 bg-red-50/50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-[13px] font-medium text-red-800">
              Generation failed
            </p>
            <p className="mt-0.5 text-[12px] text-red-600/80">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isGenerating && (
        <LoadingSkeleton
          isStreaming={isStreaming}
          streamChars={streamChars}
        />
      )}

      {/* Generated messages */}
      {response && !isGenerating && (
        <MessageOutput response={response} />
      )}

      {/* Empty state */}
      {!response && !isGenerating && !error && (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border/60 py-16">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
              <Sparkles className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <p className="text-[13px] font-medium text-muted-foreground/60">
              Configure settings and generate
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground/40">
              AI-powered messages tailored to this patient
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden w-[320px] flex-col border-r border-border/60 bg-card/50 md:flex">
          <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="-ml-2 text-[12px] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Dashboard
            </Button>

            <PatientSelect
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatient={(patient) => {
                setSelectedPatient(patient);
                setResponse(null);
                setError(null);
              }}
            />

            <OutreachControls
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={!selectedPatient}
              patient={selectedPatient}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 sm:p-8">
            {/* Mobile: back button + controls drawer */}
            <div className="mb-4 space-y-3 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="-ml-2 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Dashboard
              </Button>
              <MobileControlsDrawer
                patients={patients}
                selectedPatient={selectedPatient}
                onSelectPatient={(patient) => {
                  setSelectedPatient(patient);
                  setResponse(null);
                  setError(null);
                }}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
              />
            </div>

            {mainContent}
          </div>
        </main>
      </div>
    </div>
  );
}

function LoadingSkeleton({
  isStreaming,
  streamChars,
}: {
  isStreaming: boolean;
  streamChars: number;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="loading-dots flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          </div>
          <span className="text-[13px] font-medium text-muted-foreground">
            {isStreaming
              ? "Streaming from AI model..."
              : "Generating personalized messages..."}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50">
          {isStreaming && streamChars > 0 && (
            <span className="tabular-nums">
              {streamChars.toLocaleString()} chars
            </span>
          )}
          <span className="tabular-nums">{elapsed}s</span>
        </div>
      </div>

      {/* Streaming progress bar */}
      {isStreaming && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
          <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-300"
            style={{ width: streamChars > 0 ? `${Math.min(95, Math.log(streamChars) * 12)}%` : "5%" }}
          />
        </div>
      )}

      {/* Skeleton cards */}
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border/40 bg-card p-4"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-5 w-5 rounded skeleton-shimmer" />
              <div className="h-3 w-24 rounded skeleton-shimmer" />
              <div className="ml-auto h-4 w-16 rounded-full skeleton-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-[90%] rounded skeleton-shimmer" />
              <div className="h-3 w-[75%] rounded skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { PatientCard } from "@/components/patient-card";
import { OutreachControls } from "@/components/outreach-controls";
import { MessageOutput } from "@/components/message-output";
import { patients } from "@/lib/data/patients";
import { generateMessages } from "@/lib/api";
import { Patient, GenerateResponse } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, Sparkles } from "lucide-react";

export default function Home() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (settings: Parameters<typeof generateMessages>[0] extends infer T ? Omit<T, "patientId"> : never) => {
    if (!selectedPatient) return;

    setIsGenerating(true);
    setError(null);
    setResponse(null);

    try {
      const result = await generateMessages({
        patientId: selectedPatient.id,
        ...settings,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate messages");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — Patient selection + controls */}
        <aside className="flex w-80 flex-col border-r border-border bg-card">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Patient Profiles
            </div>
            <div className="space-y-2">
              {patients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  compact
                  selected={selectedPatient?.id === patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setResponse(null);
                    setError(null);
                  }}
                />
              ))}
            </div>
          </div>

          <Separator />

          <ScrollArea className="flex-1 p-4">
            <OutreachControls
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={!selectedPatient}
            />
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {!selectedPatient ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold">Select a Patient</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a patient profile to generate personalized outreach
                  messages
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mx-auto max-w-3xl space-y-6">
                {/* Patient context card */}
                <PatientCard patient={selectedPatient} />

                {/* Generated messages or empty state */}
                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-3 h-8 w-8 animate-pulse text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Generating personalized outreach messages...
                      </p>
                    </div>
                  </div>
                )}

                {response && !isGenerating && (
                  <MessageOutput response={response} />
                )}

                {!response && !isGenerating && !error && (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Configure outreach settings and click Generate to create
                        personalized messages
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

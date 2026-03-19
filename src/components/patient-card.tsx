"use client";

import { Patient } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  lifecycleStageLabels,
  careProgramLabels,
  riskLevelLabels,
  lifecycleStageColors,
  riskLevelColors,
  formatDate,
  daysSince,
} from "@/lib/utils/format";
import {
  User,
  Calendar,
  AlertTriangle,
  Clock,
  Shield,
  Stethoscope,
  MessageSquare,
} from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function PatientCard({
  patient,
  selected,
  onClick,
  compact,
}: PatientCardProps) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full rounded-lg border p-2.5 text-left transition-all duration-150 ${
          selected
            ? "border-teal-400/50 bg-teal-50/50 shadow-[0_0_0_1px_oklch(0.68_0.105_178_/_0.15)]"
            : "border-border/60 bg-card hover:border-teal-300/40 hover:bg-teal-50/20"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              selected
                ? "bg-teal-100 ring-1 ring-teal-300/40"
                : "bg-muted"
            }`}
          >
            <User
              className={`h-3.5 w-3.5 ${
                selected ? "text-teal-600" : "text-muted-foreground"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[13px] font-medium">{patient.name}</p>
              <Badge
                variant="secondary"
                className={`shrink-0 text-[10px] leading-none px-1.5 py-0.5 ${lifecycleStageColors[patient.lifecycleStage]}`}
              >
                {lifecycleStageLabels[patient.lifecycleStage]}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {careProgramLabels[patient.careProgram]}
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 ring-1 ring-teal-200/40">
            <User className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              {patient.name}
            </h3>
            <p className="text-[13px] text-muted-foreground">
              {patient.age} years old &middot; {patient.language} &middot;{" "}
              {patient.insuranceType}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Badge
            variant="secondary"
            className={`text-[11px] ${lifecycleStageColors[patient.lifecycleStage]}`}
          >
            {lifecycleStageLabels[patient.lifecycleStage]}
          </Badge>
          <Badge
            variant="secondary"
            className={`text-[11px] ${riskLevelColors[patient.riskLevel]}`}
          >
            {riskLevelLabels[patient.riskLevel]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg bg-muted/30 px-4 py-3 text-[13px] sm:grid-cols-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Stethoscope className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span>{careProgramLabels[patient.careProgram]}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span>Prefers {patient.preferredChannel.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span>
            {patient.enrollmentDate
              ? `Enrolled ${formatDate(patient.enrollmentDate)}`
              : "Not enrolled"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span>
            {patient.lastInteractionDate
              ? `Last contact ${daysSince(patient.lastInteractionDate)}d ago`
              : "No prior contact"}
          </span>
        </div>
      </div>

      {patient.riskFactors.length > 0 && (
        <div>
          <SectionLabel icon={<AlertTriangle className="h-3 w-3" />}>
            Risk Factors
          </SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {patient.riskFactors.map((factor) => (
              <Badge
                key={factor}
                variant="outline"
                className="border-border/60 text-[11px] font-normal text-muted-foreground"
              >
                {factor}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionLabel icon={<Shield className="h-3 w-3" />}>
          Care Team
        </SectionLabel>
        <p className="text-[13px]">
          {patient.careTeam.nurseName} &middot; {patient.careTeam.providerName}
        </p>
      </div>

      <div>
        <SectionLabel>Clinical Context</SectionLabel>
        <p className="text-[13px] leading-[1.6] text-muted-foreground">
          {patient.clinicalNotes}
        </p>
      </div>

      {patient.recentInteractions.length > 0 && (
        <div>
          <SectionLabel>Recent Interactions</SectionLabel>
          <div className="space-y-1.5">
            {patient.recentInteractions.map((interaction) => (
              <div
                key={`${interaction.date}-${interaction.type}`}
                className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 text-[13px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{interaction.type}</span>
                  <span className="text-[11px] text-muted-foreground/60">
                    {formatDate(interaction.date)}
                  </span>
                </div>
                <p className="mt-0.5 leading-[1.5] text-muted-foreground">
                  {interaction.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
      {icon}
      {children}
    </div>
  );
}

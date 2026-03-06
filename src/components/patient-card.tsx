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
        className={`w-full rounded-lg border p-3 text-left transition-colors ${
          selected
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{patient.name}</p>
              <p className="text-xs text-muted-foreground">
                {patient.age} yrs &middot;{" "}
                {careProgramLabels[patient.careProgram]}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs ${lifecycleStageColors[patient.lifecycleStage]}`}
          >
            {lifecycleStageLabels[patient.lifecycleStage]}
          </Badge>
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.age} years old &middot; {patient.language} &middot;{" "}
              {patient.insuranceType}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className={lifecycleStageColors[patient.lifecycleStage]}
          >
            {lifecycleStageLabels[patient.lifecycleStage]}
          </Badge>
          <Badge
            variant="secondary"
            className={riskLevelColors[patient.riskLevel]}
          >
            {riskLevelLabels[patient.riskLevel]}
          </Badge>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Stethoscope className="h-3.5 w-3.5" />
          <span>{careProgramLabels[patient.careProgram]}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Prefers {patient.preferredChannel.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {patient.enrollmentDate
              ? `Enrolled ${formatDate(patient.enrollmentDate)}`
              : "Not enrolled"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {patient.lastInteractionDate
              ? `Last contact ${daysSince(patient.lastInteractionDate)}d ago`
              : "No prior contact"}
          </span>
        </div>
      </div>

      {/* Risk factors */}
      {patient.riskFactors.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <AlertTriangle className="h-3 w-3" />
            Risk Factors
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.riskFactors.map((factor) => (
              <Badge key={factor} variant="outline" className="text-xs font-normal">
                {factor}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Care team */}
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Shield className="h-3 w-3" />
          Care Team
        </div>
        <p className="text-sm">
          {patient.careTeam.nurseName} &middot; {patient.careTeam.providerName}
        </p>
      </div>

      {/* Clinical notes */}
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Clinical Context
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {patient.clinicalNotes}
        </p>
      </div>

      {/* Recent interactions */}
      {patient.recentInteractions.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recent Interactions
          </p>
          <div className="space-y-2">
            {patient.recentInteractions.map((interaction, i) => (
              <div key={i} className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{interaction.type}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(interaction.date)}
                  </span>
                </div>
                <p className="mt-0.5 text-muted-foreground">
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

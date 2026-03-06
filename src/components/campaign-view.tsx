"use client";

import { patients } from "@/lib/data/patients";
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
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  MessageSquareWarning,
  TrendingUp,
} from "lucide-react";

const suggestedActions: Record<
  string,
  { label: string; icon: React.ReactNode; priority: "urgent" | "normal" }
> = {
  maria: {
    label: "Initial enrollment outreach",
    icon: <UserPlus className="h-3.5 w-3.5" />,
    priority: "normal",
  },
  ashley: {
    label: "Schedule first appointment",
    icon: <Calendar className="h-3.5 w-3.5" />,
    priority: "normal",
  },
  keisha: {
    label: "Urgent re-engagement needed",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    priority: "urgent",
  },
  jennifer: {
    label: "Gentle re-engagement check-in",
    icon: <MessageSquareWarning className="h-3.5 w-3.5" />,
    priority: "normal",
  },
};

interface CampaignViewProps {
  onSelectPatient: (patient: Patient) => void;
}

export function CampaignView({ onSelectPatient }: CampaignViewProps) {
  return (
    <div className="animate-fade-in-up p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Patient Outreach
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            Select a patient to generate AI-powered, personalized outreach
            messages across channels.
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-3 stagger-children sm:grid-cols-4">
          <StatCard
            label="Total Patients"
            value={patients.length}
            icon={<User className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Needs Enrollment"
            value={
              patients.filter((p) => p.lifecycleStage === "eligible").length
            }
            icon={<UserPlus className="h-3.5 w-3.5" />}
            accent="teal"
          />
          <StatCard
            label="At Risk"
            value={
              patients.filter((p) => p.lifecycleStage === "at-risk").length
            }
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            accent="amber"
          />
          <StatCard
            label="Engaged"
            value={
              patients.filter((p) => p.lifecycleStage === "engaged").length
            }
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Section label */}
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Active Cohort
          </span>
        </div>

        {/* Patient cards */}
        <div className="grid grid-cols-1 gap-4 stagger-children sm:grid-cols-2">
          {patients.map((patient) => {
            const action = suggestedActions[patient.id];
            return (
              <button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className="group relative rounded-xl border border-border/80 bg-card p-5 text-left transition-all duration-200 hover:border-teal-300/60 hover:shadow-[0_2px_12px_-2px_oklch(0.565_0.115_178_/_0.12)]"
              >
                {/* Urgent indicator */}
                {action?.priority === "urgent" && (
                  <div className="absolute -top-px -right-px h-2.5 w-2.5 rounded-bl-lg rounded-tr-xl bg-amber-400" />
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 ring-1 ring-teal-200/40">
                      <User className="h-4.5 w-4.5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight">
                        {patient.name}
                      </h3>
                      <p className="text-[12px] text-muted-foreground">
                        {patient.age} yrs &middot;{" "}
                        {careProgramLabels[patient.careProgram]}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-teal-500" />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
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

                <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground/50" />
                    {patient.enrollmentDate
                      ? `Enrolled ${formatDate(patient.enrollmentDate)}`
                      : "Not enrolled"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground/50" />
                    {patient.lastInteractionDate
                      ? `${daysSince(patient.lastInteractionDate)}d since contact`
                      : "No prior contact"}
                  </div>
                </div>

                {/* Suggested action */}
                <div
                  className={`mt-3 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
                    action?.priority === "urgent"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-teal-50/70 text-teal-700"
                  }`}
                >
                  {action?.icon}
                  {action?.label}
                </div>

                {/* Risk factors */}
                {patient.riskFactors.length > 0 && (
                  <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground/70">
                    {patient.riskFactors.slice(0, 2).join(" · ")}
                    {patient.riskFactors.length > 2 && (
                      <span className="text-muted-foreground/50">
                        {" "}
                        · +{patient.riskFactors.length - 2} more
                      </span>
                    )}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: "teal" | "amber";
}) {
  return (
    <div
      className={`rounded-lg border p-3.5 transition-colors ${
        accent === "teal"
          ? "border-teal-200/50 bg-teal-50/40"
          : accent === "amber"
            ? "border-amber-200/50 bg-amber-50/40"
            : "border-border/60 bg-card"
      }`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  );
}

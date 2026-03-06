"use client";

import { Patient } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { careProgramLabels, lifecycleStageLabels } from "@/lib/utils/format";
import { Users } from "lucide-react";

interface PatientSelectProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
}

export function PatientSelect({
  patients,
  selectedPatient,
  onSelectPatient,
}: PatientSelectProps) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
        <Users className="h-3 w-3" />
        Patient
      </label>
      <Select
        value={selectedPatient.id}
        onValueChange={(id) => {
          const patient = patients.find((p) => p.id === id);
          if (patient) onSelectPatient(patient);
        }}
      >
        <SelectTrigger className="w-full text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id} className="text-[13px]">
              <div className="flex items-center gap-2">
                <span className="font-medium">{patient.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {lifecycleStageLabels[patient.lifecycleStage]} · {careProgramLabels[patient.careProgram]}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

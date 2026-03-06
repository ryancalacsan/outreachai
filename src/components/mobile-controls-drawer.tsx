"use client";

import { Patient } from "@/lib/types";
import { PatientSelect } from "@/components/patient-select";
import { OutreachControls } from "@/components/outreach-controls";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SlidersHorizontal, Users } from "lucide-react";

interface MobileControlsDrawerProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onGenerate: Parameters<typeof OutreachControls>[0]["onGenerate"];
  isGenerating: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileControlsDrawer({
  patients,
  selectedPatient,
  onSelectPatient,
  onGenerate,
  isGenerating,
  open,
  onOpenChange,
}: MobileControlsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3 text-left shadow-sm transition-colors active:bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 ring-1 ring-teal-200/40">
              <Users className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <div>
              <p className="text-[13px] font-medium">{selectedPatient.name}</p>
              <p className="text-[11px] text-muted-foreground">
                Tap to change patient or configure
              </p>
            </div>
          </div>
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground/50" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">Patient & Outreach Configuration</DrawerTitle>
        <div className="mx-auto w-full max-w-md p-4 space-y-4">
          <PatientSelect
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={onSelectPatient}
          />

          <OutreachControls
            onGenerate={(settings) => {
              onGenerate(settings);
              onOpenChange(false);
            }}
            isGenerating={isGenerating}
            disabled={false}
            patient={selectedPatient}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

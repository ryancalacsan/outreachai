"use client";

import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-14 items-center gap-3 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-none tracking-tight">
              OutreachAI
            </h1>
            <p className="text-xs text-muted-foreground">
              Patient Engagement Platform
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

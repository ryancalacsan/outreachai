"use client";

import { Activity, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 shadow-sm">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
              OutreachAI
            </h1>
            <span className="hidden text-[11px] font-medium tracking-wide text-muted-foreground/60 uppercase sm:inline">
              Patient Engagement
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
          <Heart className="h-3 w-3" />
          <span className="hidden sm:inline">Maternal & Women&apos;s Health</span>
        </div>
      </div>
    </header>
  );
}

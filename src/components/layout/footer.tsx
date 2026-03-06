import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 py-4 px-6">
      <div className="mx-auto flex max-w-4xl items-center justify-between text-[11px] text-muted-foreground/50">
        <span>
          Built by{" "}
          <a
            href="https://ryancalacsan.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/70 underline decoration-muted-foreground/20 underline-offset-2 transition-colors hover:text-foreground"
          >
            Ryan Calacsan
          </a>
        </span>
        <a
          href="https://github.com/ryancalacsan/outreachai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Source</span>
        </a>
      </div>
    </footer>
  );
}

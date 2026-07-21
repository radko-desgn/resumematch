import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-8 sm:p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Stop guessing. Know your match.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Run your CV against any job in seconds — free to start.
          </p>
          <Button asChild size="lg" className="mt-6">
            <a href="#analyze">Analyze my CV</a>
          </Button>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <span className="size-5 rounded-md brand-gradient" />
            <span className="font-display font-semibold text-foreground">ResumeMatch</span>
          </div>
          <p className="font-mono text-xs">Built with Next.js + FastAPI · demo project</p>
        </div>
      </div>
    </footer>
  );
}

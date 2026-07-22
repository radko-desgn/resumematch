import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl sm:text-5xl leading-[1.05]">
            Stop guessing. Know your match.
          </h2>
          <p className="mt-4 text-white/60 sm:text-lg">Run your CV against any job in seconds — free to start.</p>
          <Button asChild variant="invert" size="lg" className="mt-8 w-full sm:w-auto">
            <a href="#analyze">Analyze my CV</a>
          </Button>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50">
          <Image
            src="/logo-white.png"
            alt="ResumeMatch"
            width={1476}
            height={261}
            className="h-[22px] w-auto"
          />
          <p className="text-xs">Built with Next.js + FastAPI · demo project</p>
        </div>
      </div>
    </footer>
  );
}

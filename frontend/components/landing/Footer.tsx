import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMING_SOON, INSTAGRAM_URL } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="text-center">
          {COMING_SOON ? (
            <>
              <h2 className="mx-auto max-w-2xl font-display text-3xl sm:text-5xl leading-[1.05]">
                Match your CV to any job offer, on another level.
              </h2>
              <p className="mt-4 text-white/60 sm:text-lg">Coming soon. Follow along and know the day it launches.</p>
              <Button asChild variant="invert" size="lg" className="mt-8 w-full sm:w-auto">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Follow for launch</a>
              </Button>
            </>
          ) : (
            <>
              <h2 className="mx-auto max-w-2xl font-display text-3xl sm:text-5xl leading-[1.05]">
                Stop guessing. Know your match.
              </h2>
              <p className="mt-4 text-white/60 sm:text-lg">Run your CV against any job in seconds — free to start.</p>
              <Button asChild variant="invert" size="lg" className="mt-8 w-full sm:w-auto">
                <a href="#analyze">Analyze my CV</a>
              </Button>
            </>
          )}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50">
          <Image
            src="/logo-white.png"
            alt="ResumeMatch"
            width={1476}
            height={261}
            className="h-[22px] w-auto"
          />
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <nav className="flex items-center gap-5 text-xs">
              <Link href="/terms" className="text-white/50 transition-colors hover:text-white">Terms</Link>
              <Link href="/privacy" className="text-white/50 transition-colors hover:text-white">Privacy</Link>
            </nav>
            <div className="text-center text-xs sm:text-right">
              <p className="text-white/40">© {year} ResumeMatch. All rights reserved.</p>
              <p className="mt-1 text-white/30">Created by Radostin Armenov</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { LegalDoc } from "@/lib/legal";

/**
 * Shared shell for the Terms and Privacy pages.
 *
 * Reuses the site's identity — the same dark header band as the hero, Montserrat
 * display type, the monochrome palette — so the legal pages read as part of the
 * product rather than a bolted-on afterthought. The prose styling mirrors the
 * tailored-CV preview (headings, lists, tables) instead of pulling in a
 * typography plugin.
 */
const COMPONENTS = {
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-12 mb-3 scroll-mt-24 font-display text-xl sm:text-2xl" {...p} />
  ),
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-7 mb-2 font-display text-base" {...p} />
  ),
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 text-[15px] leading-relaxed text-muted-foreground" {...p} />
  ),
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-3 space-y-2" {...p} />,
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => <ol className="my-3 list-decimal space-y-2 pl-5" {...p} />,
  li: (p: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="relative pl-5 text-[15px] leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-foreground/30 [ol>&]:pl-1 [ol>&]:before:hidden" {...p} />
  ),
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-foreground" {...p} />,
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-foreground underline underline-offset-2 hover:no-underline" {...p} />
  ),
  // The disclaimer is authored as a blockquote so it can be visually loud.
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 rounded-xl border border-foreground/15 bg-muted px-4 py-3 text-[15px] leading-relaxed [&>p]:my-0 [&>p]:text-foreground"
      {...p}
    />
  ),
  table: (p: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  thead: (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-muted" {...p} />,
  th: (p: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-border px-4 py-2.5 text-left font-semibold" {...p} />
  ),
  td: (p: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-border px-4 py-2.5 align-top text-muted-foreground" {...p} />
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const other = doc.slug === "terms" ? "privacy" : "terms";
  const otherLabel = other === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <div className="bg-background">
      {/* dark band, seamless with the rest of the site's header treatment */}
      <header className="bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-3xl px-5 pb-14 pt-8 sm:pt-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
              <ArrowLeft className="size-4" /> Back to ResumeMatch
            </Link>
            <Image src="/logo-white.png" alt="ResumeMatch" width={1476} height={261} className="h-[20px] w-auto" priority />
          </div>
          <span className="eyebrow mt-12 block text-white/45">Legal</span>
          <h1 className="mt-3 font-display text-3xl leading-[1.05] sm:text-5xl">{doc.title}</h1>
          <p className="mt-3 max-w-xl text-white/60">{doc.summary}</p>
          <p className="mt-5 text-xs text-white/40">Last updated {doc.updated}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14">
        <article>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
            {doc.body}
          </ReactMarkdown>
        </article>

        <nav className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/${other}`} className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
            Read the {otherLabel} →
          </Link>
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </nav>
      </main>
    </div>
  );
}

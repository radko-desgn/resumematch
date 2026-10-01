/**
 * FAQ copy — rendered by components/landing/FAQ.tsx and published as FAQPage
 * structured data (lib/structuredData.ts), so the two can't drift apart.
 *
 * Plain data in a non-client module: values exported from a "use client" file
 * reach server components as client references, not as the strings themselves.
 */
export const FAQ_ITEMS = [
  {
    q: "How do I get the most accurate match score?",
    a: "Paste the full text or upload a clean PDF/DOCX rather than a low-resolution screenshot. The more complete the CV and job description, the sharper the gap analysis.",
  },
  {
    q: "What's free vs. paid?",
    a: "You choose before we scan. The free quick check gives you the overall match percentage and a verdict, and never costs a credit. The deep AI analysis costs 1 scan credit and adds the executive summary, pain points, missing keywords, every gap with its evidence, and a branded PDF you can download. Credits start at €3.99 for a single pass, or €9.99 for six scans plus a tailored-CV credit. You can start free and upgrade afterwards. Payments are handled securely by Stripe.",
  },
  {
    q: "Will it invent experience to make me look good?",
    a: "Never. Rewrites only rephrase what's already in your CV to match the job's language — no fabricated skills, tools, or metrics. Every judgment cites evidence from your resume.",
  },
  {
    q: "Does it work for any role or industry?",
    a: "Yes. It reads the requirements from whatever job you give it and matches them against your CV, so it works across roles and fields.",
  },
  {
    q: "What happens to my data?",
    a: "Your CV and the job text are used only to run the analysis for your session — they aren't part of any training set.",
  },
];

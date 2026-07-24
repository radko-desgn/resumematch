import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service — ResumeMatch",
  description: TERMS.summary,
  robots: { index: false }, // draft/placeholder — keep out of search for now
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}

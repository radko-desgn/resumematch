import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — ResumeMatch",
  description: PRIVACY.summary,
  robots: { index: false }, // draft/placeholder — keep out of search for now
};

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />;
}

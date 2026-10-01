import type { Metadata } from "next";
import { WizardProvider } from "@/lib/store";
import { homeJsonLd } from "@/lib/structuredData";
import { CreditsProvider } from "@/lib/credits";
import { AuthProvider } from "@/lib/auth";
import { AuthGateProvider } from "@/components/auth/AuthGate";
import { CheckoutReturn } from "@/components/checkout/CheckoutReturn";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

// self-referencing canonical, resolved against metadataBase (the www origin)
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <AuthProvider>
      {/* structured data (see lib/structuredData.ts); `<` escaped per the Next JSON-LD guide */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "\\u003c") }}
      />
      <AuthGateProvider>
        <CreditsProvider>
      <WizardProvider>
        <CheckoutReturn />
        <SiteHeader />
        <main>
          <Hero />
          <HowItWorks />
          <Benefits />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </WizardProvider>
        </CreditsProvider>
      </AuthGateProvider>
    </AuthProvider>
  );
}

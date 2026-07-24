import { WizardProvider } from "@/lib/store";
import { CreditsProvider } from "@/lib/credits";
import { AuthProvider } from "@/lib/auth";
import { AuthGateProvider } from "@/components/auth/AuthGate";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <AuthProvider>
      <AuthGateProvider>
        <CreditsProvider>
      <WizardProvider>
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

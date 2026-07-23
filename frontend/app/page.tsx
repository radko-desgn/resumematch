import { WizardProvider } from "@/lib/store";
import { CreditsProvider } from "@/lib/credits";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
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
  );
}

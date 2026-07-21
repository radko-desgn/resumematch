import { WizardProvider } from "@/lib/store";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <WizardProvider>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <FAQ />
      </main>
      <Footer />
    </WizardProvider>
  );
}

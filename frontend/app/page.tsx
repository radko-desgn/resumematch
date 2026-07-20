import { WizardProvider } from "@/lib/store";
import { Wizard } from "@/components/wizard/Wizard";

export default function Home() {
  return (
    <WizardProvider>
      <Wizard />
    </WizardProvider>
  );
}

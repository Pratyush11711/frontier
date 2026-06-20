import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { StorySection } from "@/components/StorySection";
import { TelemedicineSection } from "@/components/TelemedicineSection";
import { StrategicCTA } from "@/components/StrategicCTA";
import { ComplianceSection } from "@/components/ComplianceSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
export default function Home() {
  return (
    <main className="bg-deep-teal">
      <Navbar />
      <Hero />
      <TrustStrip />
      <StorySection />
      <TelemedicineSection />
      <StrategicCTA />
      <ComplianceSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}

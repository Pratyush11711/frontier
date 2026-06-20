import type { Metadata } from "next";
import { ConfirmationContent } from "@/components/ConfirmationContent";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "You're on the list | Frontier BioMed",
  description:
    "Thank you for joining the Frontier BioMed waitlist. Watch how we help clinics source, prescribe, and dispense from one platform.",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-gradient-hero-section">
      <div className="px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6 sm:pb-20">
        <ConfirmationContent />
      </div>

      <Footer />
    </main>
  );
}

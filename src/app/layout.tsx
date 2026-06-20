import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { WaitlistProvider } from "@/context/WaitlistContext";
import { WaitlistModal } from "@/components/WaitlistModal";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { assets } from "@/lib/assets";
import "./globals.css";

const aspekta = localFont({
  src: "../../public/fonts/AspektaVF.woff2",
  variable: "--font-aspekta",
  display: "swap",
  weight: "50 1000",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "800"],
});

export const metadata: Metadata = {
  title: "Frontier BioMed | One Platform for Clinic Sourcing & Dispensing",
  description:
    "Source 1,000+ pharmacy products, 100+ peptides, and 20+ lab supplies from one platform. Integrated telemedicine, vetted supply, and hands-off fulfillment for modern clinics.",
  icons: {
    icon: assets.logo,
    apple: assets.logo,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${aspekta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <SmoothScrollProvider>
          <WaitlistProvider>
            {children}
            <WaitlistModal />
          </WaitlistProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

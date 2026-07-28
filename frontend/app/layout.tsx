import type { Metadata } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const display = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display-next" });
const body = Inter({ subsets: ["latin"], variable: "--font-body-next" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-next" });

const TITLE = "ResumeMatch — Know if your CV fits, before you apply";
const DESCRIPTION =
  "AI match score, an evidence-backed gap analysis, and a tailored ATS CV — in seconds, with nothing made up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ResumeMatch — AI job match analyzer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        {/* Vercel Web Analytics — cookieless, GDPR-friendly page-view tracking.
            Only records once Web Analytics is enabled in the Vercel dashboard. */}
        <Analytics />
      </body>
    </html>
  );
}

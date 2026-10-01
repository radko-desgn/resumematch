import type { Metadata } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { IntroLoader, INTRO_SCRIPT } from "@/components/IntroLoader";
import { SITE_DESCRIPTION as DESCRIPTION, SITE_NAME, SITE_TITLE as TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display-next" });
const body = Inter({ subsets: ["latin"], variable: "--font-body-next" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-next" });

export const metadata: Metadata = {
  // resolves relative OG/Twitter image URLs (and page canonicals) against the live origin
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
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
    // suppressHydrationWarning: INTRO_SCRIPT sets data-intro on <html> before React hydrates
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* runs before first paint so the intro is decided without a flash */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <IntroLoader />
        {children}
        {/* Vercel Web Analytics — cookieless, GDPR-friendly page-view tracking.
            Only records once Web Analytics is enabled in the Vercel dashboard. */}
        <Analytics />
      </body>
    </html>
  );
}

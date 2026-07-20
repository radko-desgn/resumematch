import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display-next" });
const body = Inter({ subsets: ["latin"], variable: "--font-body-next" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-next" });

export const metadata: Metadata = {
  title: "ResumeMatch — Job Match Analyzer",
  description: "See how well your CV fits a job, with an evidence-backed gap analysis and tailored rewrites.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

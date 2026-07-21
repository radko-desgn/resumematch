import type { Metadata } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display-next" });
const body = Inter({ subsets: ["latin"], variable: "--font-body-next" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-next" });

export const metadata: Metadata = {
  title: "ResumeMatch — Job Match Analyzer",
  description: "See how well your CV fits a job, with an evidence-backed gap analysis and tailored rewrites.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

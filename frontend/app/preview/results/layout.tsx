import type { Metadata } from "next";

// The page is a client component, so its metadata lives on this segment layout.
// It's a design sandbox rendering example data, not a page for search results.
export const metadata: Metadata = {
  title: "Results preview — ResumeMatch",
  robots: { index: false },
};

export default function ResultsPreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

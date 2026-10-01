import type { Metadata } from "next";

// The page is a client component, so its metadata lives on this segment layout.
// A password form has no business in search results.
export const metadata: Metadata = {
  title: "Set a new password — ResumeMatch",
  robots: { index: false },
};

export default function ResetPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

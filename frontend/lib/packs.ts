/**
 * Pricing packs — the single source of truth for the pricing section, the
 * in-wizard credit gate, and what a completed checkout grants.
 *
 * Kept as plain data (no JSX) so the backend contract and the UI can't drift:
 * `id` is what gets POSTed to /api/checkout, and `grants` is what the server
 * echoes back for the client to apply.
 */

export type PackId = "free" | "single" | "hunter" | "pro";

export type FeatureState =
  | "credit" // a quantity of credits this pack hands you
  | "included" // capability you get
  | "locked"; // deliberately not in this tier

export interface Feature {
  state: FeatureState;
  text: string;
}

export interface Pack {
  id: PackId;
  name: string;
  badge: string;
  /** True for the badge that should read as promotional rather than neutral. */
  hotBadge?: boolean;
  blurb: string;
  price: string;
  priceNote: string;
  features: Feature[];
  cta: string;
  /** Renders as the emphasised card. */
  featured?: boolean;
  /** What lands in the user's balance once checkout completes. */
  grants: { scans: number; cvs: number; unlimited?: boolean };
}

export const PACKS: Pack[] = [
  {
    id: "free",
    name: "Free Basic Scan",
    badge: "Getting Started",
    blurb: "Quick compatibility estimate to test the waters.",
    price: "€0",
    priceNote: "free forever",
    features: [
      { state: "included", text: "Basic percentage match score estimate" },
      { state: "included", text: "Simple heuristic job-to-CV visual preview" },
      { state: "locked", text: "Blurred / locked pain points and keyword gaps" },
      { state: "locked", text: "No AI tailored CV generation" },
    ],
    cta: "Try Free Scan",
    grants: { scans: 0, cvs: 0 },
  },
  {
    id: "single",
    name: "Single Scan Pass",
    badge: "Single Application",
    blurb: "Perfect for targeting one specific dream job opportunity.",
    price: "€3.99",
    priceNote: "one-time payment",
    features: [
      { state: "credit", text: "1 AI Deep Scan Credit" },
      { state: "included", text: "Full AI algorithm processing & match breakdown" },
      { state: "included", text: "In-depth pain points & missing keyword gaps analysis" },
      { state: "included", text: "Actionable ATS optimization recommendations" },
      { state: "locked", text: "Tailored CV generation sold separately or in the Pack" },
    ],
    cta: "Get Single Pass",
    grants: { scans: 1, cvs: 0 },
  },
  {
    id: "hunter",
    name: "Job Hunter Pack",
    badge: "Most Popular — Save 60%",
    hotBadge: true,
    blurb: "Designed for active job seekers sending multiple applications.",
    price: "€9.99",
    priceNote: "one-time payment",
    features: [
      { state: "credit", text: "5 + 1 free bonus AI scan credits (6 scans total)" },
      { state: "credit", text: "1 free tailored CV generator credit" },
      { state: "included", text: "Complete strengths, weaknesses & pain points breakdown" },
      { state: "included", text: "Export the full analysis as a PDF report" },
      { state: "included", text: "Priority AI processing queue" },
    ],
    cta: "Unlock Job Hunter Pack",
    featured: true,
    grants: { scans: 6, cvs: 1 },
  },
  {
    id: "pro",
    name: "Pro Career Pass",
    badge: "Monthly Plan",
    blurb: "A steady monthly allowance for an active, ongoing job search.",
    price: "€19.99",
    priceNote: "per month",
    features: [
      { state: "credit", text: "20 AI deep scans every month" },
      { state: "credit", text: "5 ATS tailored CV generations every month (.pdf, .docx)" },
      { state: "included", text: "Fresh quota each billing cycle — unused scans don't roll over" },
      { state: "included", text: "Full pain points, keyword gaps & PDF export" },
      { state: "included", text: "Cancel anytime" },
    ],
    cta: "Start Pro Pass",
    grants: { scans: 20, cvs: 5 },
  },
];

export const PACKS_BY_ID: Record<PackId, Pack> = Object.fromEntries(
  PACKS.map((p) => [p.id, p])
) as Record<PackId, Pack>;

/** Cheapest paid entry point — quoted in upsell copy so the two can't diverge. */
export const ENTRY_PRICE = PACKS_BY_ID.single.price;

/**
 * Legal document content.
 *
 * NOT LEGAL ADVICE. These reflect what the app actually does (accounts, credits,
 * real Stripe payments, CV analysis, the free-scan email gate, the marketing
 * opt-in). Before launch, two things remain: fill in LEGAL_ENTITY + LEGAL_ADDRESS
 * (your registered sole-trader details), remove DISCLAIMER, and have a lawyer
 * review the remaining flagged items (Art. 9 special-category basis, liability
 * cap, breach-notification wording, withdrawal-waiver + VAT). The operator is
 * EU-based and the service processes CVs, which can contain special-category data.
 *
 * Kept as data (Markdown strings) so the same branded page shell renders both.
 */

export const LEGAL_EFFECTIVE_DATE = "28 July 2026";

// Registered sole-trader details. Remove DISCLAIMER (below) once a lawyer has
// reviewed the flagged items; the identity fields are now complete.
export const LEGAL_ENTITY = "Radostin Valentinov Armenov";
export const LEGAL_ADDRESS = "Yadenitsa Street 14, 4400 Pazardzhik, Bulgaria";
export const LEGAL_CONTACT = "privacy@resumematch.pro";

export interface LegalDoc {
  slug: "terms" | "privacy";
  title: string;
  updated: string;
  /** One-line summary for the page header. */
  summary: string;
  body: string;
}

const DISCLAIMER = `> **Draft pending final review.** We are finalising our registered business details and a legal review before launch. Questions in the meantime: ${LEGAL_CONTACT}.`;

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  updated: LEGAL_EFFECTIVE_DATE,
  summary: "What we collect, why, and the rights you have over it.",
  body: `${DISCLAIMER}

ResumeMatch ("we", "us") helps you compare a CV against a job post. This policy explains what personal data we handle and how. It is written to reflect the EU General Data Protection Regulation (GDPR), since we operate from **Bulgaria (EU)**.

**Controller:** ${LEGAL_ENTITY}, ${LEGAL_ADDRESS}. Contact: ${LEGAL_CONTACT}.

## 1. What we collect

- **Account data** — your email address and a password. Passwords are hashed by our authentication provider; we never see or store them in plain text. If you sign in with Google, we receive your email and basic profile from Google instead of a password.
- **The content you submit** — the CV text and job-post text you paste or upload for analysis. **A CV can contain special-category data** (for example health, ethnicity, or religious information). We ask you not to include anything you don't want processed; see §4.
- **Free-scan email** — if you use the free scan without an account, the email you enter, so we can apply the one-free-scan-per-address limit.
- **Marketing consent** — if you tick the optional box, a record that you consented, plus the time and place you did so. Kept so we can demonstrate consent and honour withdrawal.
- **Credits and purchases** — your credit balance and a record of packs bought. **Card details** are handled directly by our payment provider (Stripe); we never see or store your full card number.
- **Technical logs** — standard server logs (IP address, timestamps, error traces) generated automatically when you use the site.

We do **not** use advertising trackers or third-party analytics cookies. \\[⚠️ LEGAL REVIEW REQUIRED — confirm before launch and add a cookie notice if any non-essential cookies are introduced.]

## 2. Why we use it, and our legal basis

| What | Why | GDPR basis |
|---|---|---|
| Email + password | Create and secure your account | Contract (Art. 6(1)(b)) |
| CV & job text | Produce your match analysis | Contract (Art. 6(1)(b)) |
| Free-scan email | Enforce the free-scan limit; deliver the result | Contract / legitimate interests (Art. 6(1)(f)) |
| Marketing emails | Send tips and product updates | **Consent (Art. 6(1)(a))** — only if you opt in |
| Logs & security | Keep the service running and prevent abuse | Legitimate interests (Art. 6(1)(f)) |

Marketing is **never** a condition of using the service. You get your scan whether or not you opt in, and you can withdraw consent at any time.

\\[⚠️ LEGAL REVIEW REQUIRED — where special-category data appears in a CV, the appropriate Art. 9 condition (typically explicit consent) must be confirmed with a lawyer.]

## 3. Who we share it with

We use these processors to run the service. Each acts on our instructions under a data-processing agreement:

- **Supabase** — accounts and database (EU region).
- **Render** — backend hosting.
- **Vercel** — frontend hosting.
- **Anthropic** (US) — the AI model that performs the analysis on the CV and job text you submit.
- **Stripe** — payment processing; card details go directly to Stripe and never to us.
- **Resend** — sending transactional emails (such as password resets), when configured.

Some of these may process data **outside the EU** (for example in the United States). Where that happens, transfers rely on the appropriate safeguards, such as Standard Contractual Clauses. \\[⚠️ LEGAL REVIEW REQUIRED — confirm each processor's location and transfer mechanism.]

We do **not** sell your personal data.

## 4. What you submit — your responsibility

Please don't paste anything into the CV or job boxes that you don't want us to process. If your CV includes sensitive details, submitting it is your decision, and by doing so you ask us to process that text to produce your analysis.

## 5. How long we keep it

- **Account data** — until you delete your account, then removed within **30 days**.
- **CV and job text** — stored with your saved scan history so you can revisit a result. Removed when you delete the scan or your account (within 30 days). If you use the free scan without an account, the text is processed to produce the result and not stored beyond it.
- **Free-scan records** — the email and a counter, kept for **12 months** to enforce the one-free-scan limit.
- **Marketing consent records** — kept while consent stands and for **up to 3 years** afterwards as proof.
- **Logs** — up to **90 days**.

## 6. Your rights

Under the GDPR you can: access your data, correct it, delete it ("right to be forgotten"), restrict or object to processing, receive it in a portable format, and withdraw consent at any time. You also have the right to complain to your supervisory authority — in Bulgaria, the **Commission for Personal Data Protection (CPDP)**.

To exercise any of these, email ${LEGAL_CONTACT}. We aim to respond within **one month**.

## 7. Security

Passwords are hashed by our authentication provider. Traffic is encrypted in transit (HTTPS). Credit balances and every paid action are enforced on our servers, not in your browser. No system is perfectly secure, but we take reasonable measures to protect your data. \\[⚠️ LEGAL REVIEW REQUIRED — describe breach-notification process.]

## 8. Children

ResumeMatch is not intended for anyone under **16**, and we do not knowingly collect their data.

## 9. Changes

We may update this policy. Material changes will be notified on this page and, where appropriate, by email. The date below shows the current version.

_Last updated: ${LEGAL_EFFECTIVE_DATE}._`,
};

export const TERMS: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  updated: LEGAL_EFFECTIVE_DATE,
  summary: "The rules for using ResumeMatch, in plain language.",
  body: `${DISCLAIMER}

These terms govern your use of ResumeMatch. By using the service you agree to them.

**Operator:** ${LEGAL_ENTITY}, ${LEGAL_ADDRESS}. Contact: ${LEGAL_CONTACT}.

## 1. What the service does

ResumeMatch compares a CV against a job post and returns a match score, a gap analysis, and — on the paid tier — tailored rewrites and a downloadable report. It is a **decision-support tool**, not a guarantee of any job outcome. The output may contain mistakes; use your own judgement.

## 2. Accounts

You need an account for anything that uses credits. You're responsible for keeping your password safe and for activity under your account. Provide accurate information and keep it current.

## 3. The free scan

The free quick check is available without an account, limited to **one scan per email address**. It gives an estimated score and a preview only. We may change or withdraw the free tier at any time.

## 4. Credits and payments

- The deep analysis and tailored-CV generation cost **credits**, which you buy in packs. The Pro plan is a monthly subscription with a fixed monthly allowance that resets each billing cycle and does not roll over.
- Payments are processed by **Stripe**. Prices and any applicable VAT are shown before you pay.
- Credits have no cash value and are non-transferable.
- **Refunds and the EU right of withdrawal.** Credits are digital content delivered immediately. By buying, you ask us to make them available straight away and you acknowledge that once a credit has been **used** (a scan run or a CV generated), you lose the 14-day right of withdrawal for that credit and it is non-refundable. **Unused** credits can be refunded within **14 days** of purchase — email ${LEGAL_CONTACT}.
- **Subscriptions.** You can cancel the Pro plan at any time; it stops at the end of the current paid period and the remaining allowance is not pro-rated or refunded.
- \\[A lawyer should confirm the withdrawal-waiver wording and VAT/invoicing before launch.]

## 5. Acceptable use

Don't: submit content you have no right to share; try to break, overload, or reverse-engineer the service; resell it; or use it to unlawfully process other people's personal data. We may suspend accounts that abuse the service.

## 6. Your content

You keep all rights to the CV and job text you submit. You grant us a limited licence to process that text solely to provide the analysis you asked for. We don't claim ownership and don't use it to train models.

## 7. Our intellectual property

ResumeMatch is proprietary. Its name, logo, branding, website, visual design, text, the layout and format of its analysis, the underlying software and source code, and all related materials are owned by ${LEGAL_ENTITY} and protected by copyright and other intellectual-property laws. **All rights reserved.**

You may **not** copy, reproduce, republish, scrape, frame, mirror, modify, translate, distribute, sell, sublicense, or create derivative works from any part of the service or its content, and you may **not** reverse-engineer, decompile, or clone the platform, in whole or in part, without our prior **written** permission. Unauthorised copying or use infringes our rights and may be pursued through civil claims (including damages and injunctions) and, where applicable, criminal proceedings under Bulgarian and EU law.

Nothing in this section affects your rights to the CV and job text you submit (see §6).

## 8. AI output

Analyses are generated automatically and can be wrong, incomplete, or out of date. Rewrites only rephrase what your CV already contains — they don't invent experience — but you are responsible for checking everything before you rely on or send it.

## 9. Availability

The service is provided "as is" and "as available". It's an early-stage product; we don't promise uninterrupted or error-free operation, and we may change features at any time.

## 10. Liability

\\[⚠️ LEGAL REVIEW REQUIRED — to the extent permitted by law, our liability is limited; consumer protections under Bulgarian/EU law that cannot be excluded still apply. A lawyer must set the exact wording and cap.]

## 11. Termination

You can stop using the service and delete your account at any time. We may suspend or end access for breach of these terms.

## 12. Governing law

These terms are governed by the laws of **Bulgaria**, without prejudice to mandatory consumer-protection rights you have where you live.

## 13. Changes

We may update these terms; material changes will be posted here and, where appropriate, notified by email.

_Last updated: ${LEGAL_EFFECTIVE_DATE}._`,
};

export const LEGAL_DOCS: Record<"terms" | "privacy", LegalDoc> = {
  terms: TERMS,
  privacy: PRIVACY,
};

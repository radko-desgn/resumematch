/**
 * JSON-LD for the landing page — built only from facts already on the page:
 * prices from lib/packs.ts, answers from lib/faq.ts, the brand from lib/site.ts.
 *
 * Deliberately absent: AggregateRating / Review. There are no real reviews yet,
 * and the product's promise is "nothing made up". Add them only from real data.
 */
import { COMING_SOON, INSTAGRAM_URL } from "@/lib/config";
import { FAQ_ITEMS } from "@/lib/faq";
import { PACKS } from "@/lib/packs";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** "€3.99" → "3.99"; packs.ts is the source of truth, priced in euros. */
const amount = (price: string) => price.replace(/[^0-9.]/g, "");

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/mark-black.png`,
        sameAs: [INSTAGRAM_URL],
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        inLanguage: "en",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any (web browser)",
        publisher: { "@id": ORG_ID },
        // while in coming-soon mode nothing can be bought, so no offers are claimed
        ...(COMING_SOON
          ? {}
          : {
              offers: PACKS.map((p) => ({
                "@type": "Offer",
                name: p.name,
                description: p.blurb,
                price: amount(p.price),
                priceCurrency: "EUR",
                ...(p.priceNote === "per month" && {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: amount(p.price),
                    priceCurrency: "EUR",
                    billingDuration: "P1M",
                  },
                }),
              })),
            }),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

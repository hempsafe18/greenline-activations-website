// Shared pricing source of truth for UI (backend is authoritative).
// Keep in sync with /app/backend/server.py TIERS array.

export type Tier = {
  id: string;
  name: string;
  tagline: string;
  min_qty: number;
  max_qty: number;
  price_per: number;
  recommended_qty: number;
  badge: string;
  description: string;
  highlights: string[];
};

export const TIERS: Tier[] = [
  {
    id: "test_sprint",
    name: "Test Sprint",
    tagline: "Validate in market",
    min_qty: 1,
    max_qty: 11,
    price_per: 200,
    recommended_qty: 6,
    badge: "Start small",
    description:
      "Perfect for brands testing a new market, SKU, or channel. Get 1–6 activations executed with full reporting before you commit to a sprint.",
    highlights: [
      "1–6 branded activations",
      "HempSafe-certified ambassadors",
      "Per-activation recap & photos",
      "No long-term contract",
    ],
  },
  {
    id: "sprint_1",
    name: "Sprint 1",
    tagline: "Get into rhythm",
    min_qty: 12,
    max_qty: 29,
    price_per: 190,
    recommended_qty: 20,
    badge: "Most popular",
    description:
      "The entry sprint for brands ready to move product every week. Builds repetition in priority accounts and generates real velocity data.",
    highlights: [
      "12–29 activations",
      "Priority account selection",
      "Weekly performance recap",
      "Dedicated field lead",
    ],
  },
  {
    id: "sprint_2",
    name: "Sprint 2",
    tagline: "Scale the state",
    min_qty: 30,
    max_qty: 59,
    price_per: 180,
    recommended_qty: 45,
    badge: "Best value",
    description:
      "A proper statewide push. Ideal for brands that need consistent Florida coverage across chains and independents.",
    highlights: [
      "30–59 activations",
      "Multi-region coverage",
      "Bi-weekly strategy sync",
      "Shelf & merchandising audits",
    ],
  },
  {
    id: "sprint_3",
    name: "Sprint 3",
    tagline: "Own the shelf",
    min_qty: 60,
    max_qty: 9999,
    price_per: 165,
    recommended_qty: 75,
    badge: "Volume pricing",
    description:
      "Heavy-weight sell-through program for brands defending distribution. Lowest per-activation price, fastest deployment windows.",
    highlights: [
      "60+ activations",
      "Dedicated account manager",
      "Monthly executive recap",
      "First-call on new markets",
    ],
  },
];

export function getTierForQty(qty: number): Tier {
  // 7-11 falls back to Test Sprint pricing with an upsell nudge
  if (qty >= 1 && qty <= 11) return TIERS[0];
  const t = TIERS.find((t) => qty >= t.min_qty && qty <= t.max_qty);
  return t ?? TIERS[TIERS.length - 1];
}

export function priceQuote(qty: number) {
  const tier = getTierForQty(qty);
  const subtotal = tier.price_per * qty;
  const gapNudge =
    qty >= 7 && qty <= 11
      ? {
          nextTier: TIERS[1],
          add: 12 - qty,
          savings: (200 - 190) * 12,
        }
      : null;
  return { tier, subtotal, gapNudge };
}

export const formatUSD = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

"use client";

import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { priceQuote, formatUSD } from "@/lib/pricing";
import { apiFetch } from "@/lib/api";

type EventBrief = {
  brand_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  product_skus: string;
  preferred_start_date: string;
  preferred_end_date: string;
  locations: string;
  staffing_notes: string;
  additional_notes: string;
};

const emptyBrief: EventBrief = {
  brand_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  product_skus: "",
  preferred_start_date: "",
  preferred_end_date: "",
  locations: "",
  staffing_notes: "",
  additional_notes: "",
};

export default function CartPage() {
  return (
    <Suspense fallback={<div className="section container-xl px-4">Loading cart…</div>}>
      <CartPageInner />
    </Suspense>
  );
}

function CartPageInner() {
  const params = useSearchParams();
  const cancelled = params.get("cancelled") === "1";
  const { lines, setLineQty, removeLine, subtotal, totalQty } = useCart();

  const [skipDetails, setSkipDetails] = useState(false);
  const [brief, setBrief] = useState<EventBrief>(emptyBrief);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverReady, setServerReady] = useState(false);

  // Warmup ping — Render free tier sleeps after inactivity; fire a cheap request
  // on mount so the server is awake by the time the user clicks checkout.
  useEffect(() => {
    apiFetch<unknown>("/api/tiers")
      .then(() => setServerReady(true))
      .catch(() => {
        // Ignore warmup failures — real error surfaces on checkout attempt.
      });
  }, []);

  const updateBrief = (k: keyof EventBrief, v: string) => {
    setBrief((b) => ({ ...b, [k]: v }));
  };

  const canCheckout = lines.length > 0 && !submitting;

  const onCheckout = async () => {
    setError(null);
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    // Basic validation
    if (!skipDetails) {
      if (!brief.brand_name || !brief.contact_name || !brief.contact_email) {
        setError("Brand name, contact name, and email are required.");
        return;
      }
    } else {
      if (!brief.contact_name || !brief.contact_email) {
        setError("Contact name and email are required.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const payload = {
        items: lines.map((l) => ({ tier_id: l.tier_id, qty: l.qty })),
        origin_url: origin,
        event_brief: {
          brand_name: brief.brand_name || "—",
          contact_name: brief.contact_name,
          contact_email: brief.contact_email,
          contact_phone: brief.contact_phone,
          product_skus: brief.product_skus,
          preferred_start_date: brief.preferred_start_date,
          preferred_end_date: brief.preferred_end_date,
          locations: brief.locations,
          staffing_notes: brief.staffing_notes,
          additional_notes: brief.additional_notes,
        },
        skip_details: skipDetails,
      };
      const res = await apiFetch<{ url: string }>("/api/checkout/session", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      window.location.href = res.url;
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : String(e);
      // "Failed to fetch" means the browser couldn't reach the API at all —
      // most likely a CORS preflight rejection or the Render instance is still
      // waking up. Give the user an actionable message instead of the raw error.
      const isNetworkError =
        raw.toLowerCase().includes("failed to fetch") ||
        raw.toLowerCase().includes("networkerror") ||
        raw.toLowerCase().includes("load failed");
      setError(
        isNetworkError
          ? "Could not reach the payment server. The server may be waking up — please wait 15 seconds and try again."
          : raw
      );
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <section className="section bg-bone">
        <div className="container-xl px-4 max-w-3xl text-center py-16">
          <span className="tag-street">Your Cart</span>
          <h1 className="mt-5 font-display font-black uppercase text-5xl md:text-6xl leading-[0.9] tracking-tighter">
            Cart is empty.
          </h1>
          <p className="mt-5 text-ink/70">
            Head over to Sprints to pick a tier, or build a custom quantity on the homepage.
          </p>
          {cancelled && (
            <div className="mt-6 inline-block bg-street/10 border-2 border-street px-4 py-2 text-sm">
              Checkout was cancelled. Your cart is saved if you come back.
            </div>
          )}
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/sprints" className="btn-canopy" data-testid="cart-empty-shop">
              Shop Sprints →
            </Link>
            <Link href="/" className="btn-ghost text-sm">
              Back home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bone border-b-2 border-ink">
      <div className="container-xl px-4 py-12 md:py-16">
        {cancelled && (
          <div className="mb-6 bg-street/10 border-2 border-street px-4 py-3 text-sm">
            Checkout cancelled. Your cart is still here — continue whenever you're ready.
          </div>
        )}

        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="tag">Step 2 of 3</span>
            <h1 className="mt-4 font-display font-black uppercase text-5xl md:text-6xl leading-[0.9] tracking-tighter">
              Review &<br />
              <span className="bg-ink text-bone px-2 inline-block">checkout.</span>
            </h1>
          </div>
          <div className="bg-white border-2 border-ink p-4 shadow-brutal">
            <div className="text-[11px] uppercase tracking-widest text-ink/50">Total activations</div>
            <div className="font-display font-black text-3xl text-ink leading-none mt-1">{totalQty}</div>
          </div>
        </div>

        {/* Skip the details toggle */}
        <div className="bg-ink text-bone border-2 border-ink p-5 shadow-brutal mb-8 flex items-start md:items-center gap-4 flex-col md:flex-row md:justify-between">
          <div>
            <div className="tag-street inline-block mb-2">Optional</div>
            <h3 className="font-display font-black uppercase text-xl leading-none">
              Skip event details — schedule an onboarding call instead.
            </h3>
            <p className="text-bone/70 text-sm mt-2 max-w-xl">
              Prefer to talk through the brief on a call? We'll collect just your name + email at checkout, then
              schedule an onboarding session after payment.
            </p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none shrink-0">
            <span className="text-sm font-display font-bold uppercase tracking-wider">
              {skipDetails ? "On" : "Off"}
            </span>
            <span
              className={`relative w-14 h-7 border-2 border-bone transition-colors ${
                skipDetails ? "bg-canopy" : "bg-ink"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-bone border-2 border-ink transition-transform ${
                  skipDetails ? "translate-x-[26px]" : "translate-x-0.5"
                }`}
              />
            </span>
            <input
              type="checkbox"
              checked={skipDetails}
              onChange={(e) => setSkipDetails(e.target.checked)}
              className="sr-only"
              data-testid="cart-skip-toggle"
            />
          </label>
        </div>

        <div className="grid lg:grid-cols-[1.4fr,1fr] gap-8">
          {/* Left column */}
          <div className="space-y-8">
            {/* Line items */}
            <div className="bg-white border-2 border-ink shadow-brutal">
              <div className="px-6 py-4 border-b-2 border-ink bg-canopy">
                <div className="eyebrow text-ink">Cart</div>
                <div className="font-display font-black text-2xl text-ink leading-none mt-1">Your Sprints</div>
              </div>
              <div className="divide-y-2 divide-ink/10">
                {lines.map((line, idx) => {
                  const { tier, subtotal: ls } = priceQuote(line.qty);
                  return (
                    <div key={idx} className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap" data-testid={`cart-page-line-${idx}`}>
                      <div>
                        <div className="tag mb-2">{tier.badge}</div>
                        <div className="font-display font-black text-xl">{tier.name}</div>
                        <div className="text-xs text-ink/60 mt-1">{formatUSD(tier.price_per)} / activation</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-ink">
                          <button
                            onClick={() => setLineQty(idx, Math.max(1, line.qty - 1))}
                            className="w-9 h-9 hover:bg-ink hover:text-bone"
                            data-testid={`cart-page-dec-${idx}`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={line.qty}
                            onChange={(e) => setLineQty(idx, Math.max(1, parseInt(e.target.value || "1", 10)))}
                            className="w-16 h-9 text-center font-display font-bold border-x-2 border-ink focus:outline-none"
                            data-testid={`cart-page-qty-${idx}`}
                          />
                          <button
                            onClick={() => setLineQty(idx, line.qty + 1)}
                            className="w-9 h-9 hover:bg-ink hover:text-bone"
                            data-testid={`cart-page-inc-${idx}`}
                          >
                            +
                          </button>
                        </div>
                        <div className="font-display font-black text-xl w-28 text-right">{formatUSD(ls)}</div>
                        <button
                          onClick={() => removeLine(idx)}
                          className="text-sm underline text-ink/60 hover:text-street"
                          data-testid={`cart-page-remove-${idx}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event brief or simple form */}
            {!skipDetails ? (
              <div className="bg-white border-2 border-ink shadow-brutal">
                <div className="px-6 py-4 border-b-2 border-ink bg-ink text-bone">
                  <div className="eyebrow text-bone/70">Event Brief</div>
                  <div className="font-display font-black text-2xl leading-none mt-1">Tell us about the activation</div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-brutal">Brand name *</label>
                    <input
                      className="input-brutal"
                      value={brief.brand_name}
                      onChange={(e) => updateBrief("brand_name", e.target.value)}
                      data-testid="brief-brand-name"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Products / SKUs</label>
                    <input
                      className="input-brutal"
                      placeholder="e.g. Señorita THC 10mg cans"
                      value={brief.product_skus}
                      onChange={(e) => updateBrief("product_skus", e.target.value)}
                      data-testid="brief-skus"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Contact name *</label>
                    <input
                      className="input-brutal"
                      value={brief.contact_name}
                      onChange={(e) => updateBrief("contact_name", e.target.value)}
                      data-testid="brief-contact-name"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Contact email *</label>
                    <input
                      type="email"
                      className="input-brutal"
                      value={brief.contact_email}
                      onChange={(e) => updateBrief("contact_email", e.target.value)}
                      data-testid="brief-contact-email"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Contact phone</label>
                    <input
                      className="input-brutal"
                      value={brief.contact_phone}
                      onChange={(e) => updateBrief("contact_phone", e.target.value)}
                      data-testid="brief-phone"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Preferred start date</label>
                    <input
                      type="date"
                      className="input-brutal"
                      value={brief.preferred_start_date}
                      onChange={(e) => updateBrief("preferred_start_date", e.target.value)}
                      data-testid="brief-start-date"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Preferred end date</label>
                    <input
                      type="date"
                      className="input-brutal"
                      value={brief.preferred_end_date}
                      onChange={(e) => updateBrief("preferred_end_date", e.target.value)}
                      data-testid="brief-end-date"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Staffing notes</label>
                    <input
                      className="input-brutal"
                      placeholder="e.g. 2 ambassadors per stop"
                      value={brief.staffing_notes}
                      onChange={(e) => updateBrief("staffing_notes", e.target.value)}
                      data-testid="brief-staffing"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-brutal">Locations / target accounts</label>
                    <textarea
                      className="input-brutal min-h-[100px]"
                      placeholder="Cities, neighborhoods, or specific retailer names"
                      value={brief.locations}
                      onChange={(e) => updateBrief("locations", e.target.value)}
                      data-testid="brief-locations"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-brutal">Additional notes</label>
                    <textarea
                      className="input-brutal min-h-[100px]"
                      value={brief.additional_notes}
                      onChange={(e) => updateBrief("additional_notes", e.target.value)}
                      data-testid="brief-notes"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-ink shadow-brutal">
                <div className="px-6 py-4 border-b-2 border-ink bg-ink text-bone">
                  <div className="eyebrow text-bone/70">Quick Contact</div>
                  <div className="font-display font-black text-2xl leading-none mt-1">We'll schedule onboarding after payment</div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-brutal">Your name *</label>
                    <input
                      className="input-brutal"
                      value={brief.contact_name}
                      onChange={(e) => updateBrief("contact_name", e.target.value)}
                      data-testid="brief-contact-name-skip"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Email *</label>
                    <input
                      type="email"
                      className="input-brutal"
                      value={brief.contact_email}
                      onChange={(e) => updateBrief("contact_email", e.target.value)}
                      data-testid="brief-contact-email-skip"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Brand name</label>
                    <input
                      className="input-brutal"
                      value={brief.brand_name}
                      onChange={(e) => updateBrief("brand_name", e.target.value)}
                      data-testid="brief-brand-name-skip"
                    />
                  </div>
                  <div>
                    <label className="label-brutal">Phone</label>
                    <input
                      className="input-brutal"
                      value={brief.contact_phone}
                      onChange={(e) => updateBrief("contact_phone", e.target.value)}
                      data-testid="brief-phone-skip"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column — sticky summary */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-canopy border-2 border-ink shadow-brutal">
              <div className="px-6 py-4 border-b-2 border-ink">
                <div className="eyebrow text-ink">Order Summary</div>
                <div className="font-display font-black text-2xl text-ink leading-none mt-1">Total</div>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm">
                  {lines.map((l, i) => {
                    const q = priceQuote(l.qty);
                    return (
                      <div key={i} className="flex justify-between">
                        <span>
                          {q.tier.name} × {l.qty}
                        </span>
                        <span className="font-display font-bold">{formatUSD(q.subtotal)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-5 border-t-2 border-dashed border-ink/30 flex items-end justify-between">
                  <span className="font-display font-bold uppercase tracking-wider text-sm">Subtotal</span>
                  <span className="font-display font-black text-3xl" data-testid="cart-summary-subtotal">
                    {formatUSD(subtotal)}
                  </span>
                </div>
                <button
                  onClick={onCheckout}
                  disabled={!canCheckout}
                  className="btn-street w-full justify-center mt-6 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  data-testid="cart-checkout-button"
                >
                  {submitting
                    ? "Connecting to Stripe…"
                    : !serverReady
                    ? "Checkout with Stripe →"
                    : "Checkout with Stripe →"}
                </button>
                {!serverReady && !submitting && (
                  <p className="mt-2 text-[11px] text-ink/50">
                    Waking up payment server…
                  </p>
                )}
                {error && (
                  <div className="mt-3" data-testid="cart-error">
                    <p className="text-sm text-street font-display font-bold">{error}</p>
                    <button
                      onClick={onCheckout}
                      className="mt-2 text-xs underline underline-offset-2 text-ink/70 hover:text-ink"
                    >
                      Try again →
                    </button>
                  </div>
                )}
                <p className="mt-4 text-[11px] text-ink/60 leading-relaxed">
                  Secure checkout via Stripe. Prices shown are server-verified.
                  {skipDetails
                    ? " We'll email you an onboarding scheduler after payment."
                    : " We'll confirm the brief + next steps after payment."}
                </p>
              </div>
            </div>

            <Link href="/sprints" className="btn-ghost text-xs w-full justify-center mt-4">
              ← Keep shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

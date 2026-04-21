"use client";

import { useState } from "react";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import SprintBuilder from "@/components/SprintBuilder";
import { TIERS, formatUSD } from "@/lib/pricing";
import { useCart } from "@/components/CartContext";

export default function SprintsPage() {
  const { addActivations } = useCart();
  const [pulseId, setPulseId] = useState<string | null>(null);

  const addTierRecommended = (tierId: string, qty: number) => {
    addActivations(qty);
    setPulseId(tierId);
    setTimeout(() => setPulseId(null), 600);
  };

  return (
    <>
      {/* HERO */}
      <section className="border-b-2 border-ink bg-bone">
        <div className="container-xl px-4 pt-16 pb-12">
          <div className="max-w-3xl">
            <span className="tag">Shop · 4 Sprint Tiers</span>
            <h1 className="mt-5 font-display font-black uppercase leading-[0.9] tracking-tighter text-ink text-5xl md:text-7xl">
              Pick a sprint.
              <br />
              <span className="bg-canopy border-2 border-ink px-3 inline-block -rotate-1">Add to cart.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/70 leading-relaxed">
              Every activation includes a HempSafe-certified ambassador, a branded demo setup, and a per-stop
              recap with photos and sell-through notes. Volume discounts apply automatically.
            </p>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "LOWEST PRICE GUARANTEED",
          "NO CONTRACTS",
          "HEMPSAFE™ CERTIFIED",
          "FLORIDA-FIRST",
          "BRIEF → IN-STORE IN ~7 DAYS",
        ]}
        accent="ink"
      />

      {/* TIER CARDS */}
      <section className="section bg-bone">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((t) => {
              const featured = t.id === "sprint_1";
              const accent =
                t.id === "sprint_3"
                  ? "bg-street text-bone"
                  : t.id === "sprint_2"
                  ? "bg-canopy text-ink"
                  : t.id === "sprint_1"
                  ? "bg-ink text-bone"
                  : "bg-bone text-ink";
              return (
                <div
                  key={t.id}
                  id={t.id}
                  className={`relative bg-white border-2 border-ink p-6 shadow-brutal transition-all ${
                    featured ? "lg:-translate-y-4" : ""
                  } ${pulseId === t.id ? "animate-pop-in" : ""}`}
                  data-testid={`tier-card-${t.id}`}
                >
                  <div
                    className={`inline-block px-3 py-1 border-2 border-ink font-display font-black text-[10px] uppercase tracking-widest ${accent}`}
                  >
                    {t.badge}
                  </div>
                  <h3 className="mt-4 font-display font-black text-3xl uppercase tracking-tight leading-none">
                    {t.name}
                  </h3>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-ink/50">{t.tagline}</div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display font-black text-5xl text-ink leading-none">
                      {formatUSD(t.price_per)}
                    </span>
                    <span className="text-sm text-ink/60">/ activation</span>
                  </div>
                  <div className="mt-2 text-xs text-ink/60">
                    Range: {t.min_qty}–{t.max_qty === 9999 ? "∞" : t.max_qty} activations
                  </div>

                  <ul className="mt-5 space-y-2">
                    {t.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-ink/80">
                        <span className="w-4 h-4 bg-canopy border-2 border-ink flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ✓
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-xs text-ink/60 leading-relaxed">{t.description}</p>

                  <div className="mt-6 pt-5 border-t-2 border-dashed border-ink/20 space-y-2">
                    <button
                      onClick={() => addTierRecommended(t.id, t.recommended_qty)}
                      className="btn-canopy w-full justify-center text-sm"
                      data-testid={`tier-${t.id}-add-recommended`}
                    >
                      Add {t.recommended_qty} activations
                    </button>
                    <a
                      href="#builder"
                      className="block text-center text-xs font-display font-bold uppercase tracking-widest text-ink/60 hover:text-ink underline underline-offset-4"
                    >
                      Or pick a custom qty ↓
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CUSTOM BUILDER */}
      <section id="builder" className="section bg-ink text-bone border-y-2 border-ink">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-[1fr,1.1fr] gap-10 items-center">
            <div>
              <span className="tag-street">Custom Quantity</span>
              <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.9] tracking-tight">
                Know your number? <br />
                <span className="text-canopy">Slide it in.</span>
              </h2>
              <p className="mt-5 text-bone/70 leading-relaxed max-w-lg">
                Move the slider. Price re-tiers automatically. Hit the sweet spot between your budget and the
                volume discount. No spreadsheets, no procurement calls.
              </p>
              <div className="mt-6 space-y-2 text-sm text-bone/70">
                <div>• 1–6 activations: <b>$200/ea</b> (Test Sprint)</div>
                <div>• 12–29 activations: <b>$190/ea</b> (Sprint 1)</div>
                <div>• 30–59 activations: <b>$180/ea</b> (Sprint 2)</div>
                <div>• 60+ activations: <b>$165/ea</b> (Sprint 3)</div>
              </div>
            </div>
            <div>
              <SprintBuilder initialQty={30} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-ish */}
      <section className="section bg-bone">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                q: "How fast can we deploy?",
                a: "From brief to in-store in ~7 days. Larger sprints (60+) take a bit longer to scope.",
              },
              {
                q: "Do I need to sign a contract?",
                a: "No. Every sprint is purchased individually. You can stop, scale, or restack at any time.",
              },
              {
                q: "What if my quantity falls between tiers?",
                a: "Add a few activations to unlock the next tier — the slider flags the savings automatically.",
              },
              {
                q: "What's included in every activation?",
                a: "A HempSafe-certified ambassador, branded demo setup, compliance-ready sampling, and a post-stop recap.",
              },
              {
                q: "What if I need something custom?",
                a: "Book an onboarding call. We'll scope a custom sprint and drop a link in your inbox.",
              },
              {
                q: "Do you offer refunds?",
                a: "If an activation can't be executed for any reason on our side, we reschedule or refund the activation line item.",
              },
            ].map((item) => (
              <div key={item.q} className="card card-hover">
                <h4 className="font-display font-black uppercase text-lg tracking-tight">{item.q}</h4>
                <p className="mt-3 text-sm text-ink/70 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/cart" className="btn-street text-base" data-testid="sprints-go-to-cart">
              Go to Cart →
            </Link>
            <Link
              href="/schedule-an-intro-call"
              className="ml-2 btn-ghost text-sm"
              data-testid="sprints-book-call"
            >
              Talk to us first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

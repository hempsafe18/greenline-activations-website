"use client";

import { useMemo, useState } from "react";
import { priceQuote, formatUSD, TIERS } from "@/lib/pricing";
import { useCart } from "./CartContext";

const MIN_QTY = 1;
const MAX_QTY = 120;

type Props = {
  initialQty?: number;
  compact?: boolean;
};

export default function SprintBuilder({ initialQty = 20, compact = false }: Props) {
  const [qty, setQty] = useState<number>(initialQty);
  const { addActivations } = useCart();

  const quote = useMemo(() => priceQuote(qty), [qty]);
  const { tier, subtotal, gapNudge } = quote;

  // Tier background flashes when we cross into a new tier
  const tierAccent =
    tier.id === "sprint_3"
      ? "bg-street text-bone"
      : tier.id === "sprint_2"
      ? "bg-canopy text-ink"
      : tier.id === "sprint_1"
      ? "bg-ink text-bone"
      : "bg-bone text-ink";

  return (
    <div
      className={`relative ${compact ? "p-6" : "p-8"} bg-white border-2 border-ink shadow-brutal-lg`}
      data-testid="sprint-builder"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="eyebrow">Build Your Sprint</div>
        <div
          className={`px-3 py-1 border-2 border-ink font-display font-black text-[11px] uppercase tracking-widest ${tierAccent} transition-colors duration-200`}
          data-testid="sprint-builder-tier-badge"
        >
          {tier.badge}
        </div>
      </div>

      {/* Tier + per-price */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="font-display font-black text-ink text-3xl md:text-4xl leading-none uppercase" data-testid="sprint-builder-tier-name">
            {tier.name}
          </div>
          <div className="text-ink/60 text-sm mt-1" data-testid="sprint-builder-tier-tagline">
            {tier.tagline} · Range {tier.min_qty}–{tier.max_qty === 9999 ? "∞" : tier.max_qty}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-widest text-ink/50">Per activation</div>
          <div
            className="font-display font-black text-3xl md:text-4xl text-ink leading-none"
            data-testid="sprint-builder-price-per"
          >
            {formatUSD(tier.price_per)}
          </div>
        </div>
      </div>

      {/* Quantity display */}
      <div className="mt-6 flex items-end gap-3">
        <div className="font-display font-black text-ink text-[72px] md:text-[96px] leading-none tracking-tighter" data-testid="sprint-builder-qty">
          {qty}
        </div>
        <div className="pb-4 text-ink/60 font-display font-bold uppercase tracking-wider">activations</div>
      </div>

      {/* Slider */}
      <div className="mt-4">
        <input
          type="range"
          min={MIN_QTY}
          max={MAX_QTY}
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value, 10))}
          className="slider-brutal"
          data-testid="sprint-builder-slider"
          aria-label="Quantity of activations"
        />
        <div className="mt-2 grid grid-cols-4 text-[10px] font-display font-bold uppercase tracking-widest text-ink/50">
          <span>1</span>
          <span className="text-center">12</span>
          <span className="text-center">30</span>
          <span className="text-right">60+</span>
        </div>
      </div>

      {/* Qty stepper buttons */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center border-2 border-ink">
          <button
            onClick={() => setQty((q) => Math.max(MIN_QTY, q - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-ink hover:text-bone transition-colors"
            aria-label="Decrease"
            data-testid="sprint-builder-dec"
          >
            −
          </button>
          <input
            type="number"
            min={MIN_QTY}
            max={MAX_QTY}
            value={qty}
            onChange={(e) => {
              const v = parseInt(e.target.value || "1", 10);
              if (!Number.isNaN(v)) setQty(Math.min(MAX_QTY, Math.max(MIN_QTY, v)));
            }}
            className="w-16 h-10 text-center font-display font-bold border-x-2 border-ink focus:outline-none"
            data-testid="sprint-builder-qty-input"
          />
          <button
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-ink hover:text-bone transition-colors"
            aria-label="Increase"
            data-testid="sprint-builder-inc"
          >
            +
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[6, 20, 45, 75].map((preset) => (
            <button
              key={preset}
              onClick={() => setQty(preset)}
              className={`px-3 h-10 text-xs font-display font-bold uppercase tracking-wider border-2 border-ink transition-colors ${
                qty === preset ? "bg-ink text-bone" : "bg-white text-ink hover:bg-canopy"
              }`}
              data-testid={`sprint-builder-preset-${preset}`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Gap nudge */}
      {gapNudge && (
        <div
          className="mt-5 p-4 bg-street/10 border-2 border-street text-ink text-sm"
          data-testid="sprint-builder-upsell"
        >
          <span className="font-display font-bold uppercase tracking-wider mr-1">Tip:</span>
          Add <span className="font-display font-bold">{gapNudge.add}</span> more activation
          {gapNudge.add === 1 ? "" : "s"} to unlock <span className="font-display font-bold">Sprint 1</span> pricing at
          <span className="font-display font-bold"> $190/ea</span>.
        </div>
      )}

      {/* Total + CTA */}
      <div className="mt-6 flex items-end justify-between gap-4 pt-6 border-t-2 border-dashed border-ink/30">
        <div>
          <div className="eyebrow">Total</div>
          <div className="font-display font-black text-4xl md:text-5xl text-ink leading-none mt-1" data-testid="sprint-builder-subtotal">
            {formatUSD(subtotal)}
          </div>
        </div>
        <button
          onClick={() => addActivations(qty)}
          className="btn-street text-base"
          data-testid="sprint-builder-add-to-cart"
        >
          Add to Cart →
        </button>
      </div>

      {/* Tier ladder preview */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {TIERS.map((t) => {
          const active = t.id === tier.id;
          return (
            <button
              key={t.id}
              onClick={() => setQty(t.recommended_qty)}
              className={`px-2 py-2 text-left border-2 border-ink transition-all ${
                active ? "bg-ink text-bone" : "bg-white text-ink hover:-translate-y-[2px] hover:shadow-brutal"
              }`}
              data-testid={`sprint-builder-tier-${t.id}`}
            >
              <div className="text-[10px] uppercase tracking-widest opacity-70">{t.name}</div>
              <div className="font-display font-black text-base">{formatUSD(t.price_per)}</div>
              <div className="text-[10px] opacity-70">
                {t.min_qty}–{t.max_qty === 9999 ? "∞" : t.max_qty}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

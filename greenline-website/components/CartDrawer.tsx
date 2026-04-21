"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { TIERS, priceQuote, formatUSD } from "@/lib/pricing";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, setLineQty, removeLine, subtotal, totalQty } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        data-testid="cart-backdrop"
        aria-hidden={!isOpen}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-bone border-l-2 border-ink z-[70] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        data-testid="cart-drawer"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-ink bg-canopy">
          <div>
            <div className="eyebrow text-ink">Your Cart</div>
            <div className="font-display font-black text-2xl text-ink leading-none mt-1">
              {totalQty} activation{totalQty === 1 ? "" : "s"}
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-10 h-10 flex items-center justify-center border-2 border-ink bg-bone hover:bg-ink hover:text-bone transition-colors"
            data-testid="cart-close-button"
          >
            ✕
          </button>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {lines.length === 0 && (
            <div className="text-center py-16">
              <div className="font-display font-black text-3xl text-ink uppercase">Cart is empty</div>
              <p className="mt-3 text-ink/60">Build a sprint to get started.</p>
              <Link
                href="/sprints"
                className="btn-canopy mt-6"
                onClick={closeCart}
                data-testid="cart-empty-browse-sprints"
              >
                Browse Sprints →
              </Link>
            </div>
          )}
          {lines.map((line, idx) => {
            const { tier, subtotal: lineSubtotal } = priceQuote(line.qty);
            return (
              <div
                key={idx}
                className="bg-white border-2 border-ink p-4 shadow-brutal"
                data-testid={`cart-line-${idx}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="tag mb-2">{tier.badge}</div>
                    <div className="font-display font-black text-xl leading-none">{tier.name}</div>
                    <div className="text-xs text-ink/60 mt-1">{formatUSD(tier.price_per)} / activation</div>
                  </div>
                  <button
                    onClick={() => removeLine(idx)}
                    aria-label="Remove"
                    className="text-ink/60 hover:text-street text-sm underline"
                    data-testid={`cart-line-remove-${idx}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border-2 border-ink">
                    <button
                      onClick={() => setLineQty(idx, Math.max(1, line.qty - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-ink hover:text-bone transition-colors"
                      aria-label="Decrease"
                      data-testid={`cart-line-dec-${idx}`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={line.qty}
                      onChange={(e) => setLineQty(idx, Math.max(1, parseInt(e.target.value || "1", 10)))}
                      className="w-14 h-9 text-center font-display font-bold border-x-2 border-ink bg-white focus:outline-none"
                      data-testid={`cart-line-qty-${idx}`}
                    />
                    <button
                      onClick={() => setLineQty(idx, line.qty + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-ink hover:text-bone transition-colors"
                      aria-label="Increase"
                      data-testid={`cart-line-inc-${idx}`}
                    >
                      +
                    </button>
                  </div>
                  <div className="font-display font-black text-xl">{formatUSD(lineSubtotal)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary + CTA */}
        {lines.length > 0 && (
          <div className="border-t-2 border-ink p-6 bg-white">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="eyebrow">Subtotal</div>
                <div className="text-xs text-ink/60 mt-1">Event brief & payment next</div>
              </div>
              <div className="font-display font-black text-3xl" data-testid="cart-drawer-subtotal">
                {formatUSD(subtotal)}
              </div>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-street w-full justify-center text-base"
              data-testid="cart-drawer-checkout-button"
            >
              Review & Checkout →
            </Link>
            <Link
              href="/sprints"
              onClick={closeCart}
              className="block text-center mt-3 text-sm font-display font-bold uppercase tracking-wider text-ink/70 hover:text-ink underline underline-offset-4"
              data-testid="cart-drawer-continue"
            >
              Keep building
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

// Re-export TIERS tooltip
export { TIERS };

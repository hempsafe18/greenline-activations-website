"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { apiFetch } from "@/lib/api";
import { formatUSD } from "@/lib/pricing";

type StatusResponse = {
  session_id: string;
  status: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  metadata: Record<string, string>;
};

type OrderLine = {
  tier_id: string;
  tier_name: string;
  qty: number;
  price_per: number;
  subtotal: number;
};

type OrderResponse = {
  order_id: string;
  status: string;
  payment_status: string;
  subtotal: number;
  currency: string;
  line_items: OrderLine[];
  event_brief: Record<string, string> | null;
  skip_details: boolean;
  created_at: string;
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="section container-xl px-4">Loading…</div>}>
      <OrderSuccessInner />
    </Suspense>
  );
}

function OrderSuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const orderId = params.get("order_id");
  const { clear } = useCart();

  const [polling, setPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const pollStatus = useCallback(
    async (attempt: number) => {
      if (!sessionId) {
        setError("Missing session id");
        setPolling(false);
        return;
      }
      if (attempt >= 10) {
        setError("Timed out checking payment status. Please refresh or email hello@greenlineactivations.com.");
        setPolling(false);
        return;
      }
      try {
        const s = await apiFetch<StatusResponse>(`/api/checkout/status/${sessionId}`);
        setStatus(s);
        if (s.payment_status === "paid") {
          setPolling(false);
          if (orderId) {
            try {
              const o = await apiFetch<OrderResponse>(`/api/orders/${orderId}`);
              setOrder(o);
            } catch {}
          }
          clear();
          return;
        }
        if (s.status === "expired") {
          setPolling(false);
          setError("Checkout session expired.");
          return;
        }
        setTimeout(() => pollStatus(attempt + 1), 2000);
      } catch (e: unknown) {
        setTimeout(() => pollStatus(attempt + 1), 2000);
        const msg = e instanceof Error ? e.message : String(e);
        console.error(msg);
      }
    },
    [sessionId, orderId, clear]
  );

  useEffect(() => {
    pollStatus(0);
  }, [pollStatus]);

  const paid = status?.payment_status === "paid";

  return (
    <section className="bg-bone min-h-[70vh]">
      <div className="container-xl px-4 py-16 max-w-3xl">
        {polling && !paid && (
          <div className="text-center py-16">
            <div className="inline-block bg-ink text-bone px-4 py-2 font-display font-black text-[11px] uppercase tracking-widest animate-pulse">
              Verifying payment…
            </div>
            <h1 className="mt-6 font-display font-black uppercase text-5xl md:text-6xl leading-[0.9] tracking-tighter">
              Locking in your sprint.
            </h1>
            <p className="mt-4 text-ink/60">This usually takes under 5 seconds.</p>
          </div>
        )}

        {error && (
          <div className="bg-street/10 border-2 border-street p-6">
            <h1 className="font-display font-black uppercase text-2xl text-ink">Something went wrong</h1>
            <p className="mt-3 text-ink/70">{error}</p>
            <Link href="/cart" className="btn-ghost mt-5 text-sm">
              Back to cart
            </Link>
          </div>
        )}

        {paid && (
          <div data-testid="order-success-content">
            <div className="inline-block bg-canopy text-ink border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 shadow-brutal">
              Payment confirmed
            </div>
            <h1 className="mt-6 font-display font-black uppercase text-5xl md:text-7xl leading-[0.9] tracking-tighter">
              Sprint <br />
              <span className="bg-ink text-bone px-3 inline-block">secured.</span>
            </h1>
            <p className="mt-5 text-lg text-ink/70 max-w-xl">
              Thanks for buying activations like a SKU. Your order is locked in and our ops team is already
              booking staff and confirming accounts.
            </p>

            {/* Receipt card */}
            <div className="mt-10 bg-white border-2 border-ink shadow-brutal-lg">
              <div className="px-6 py-4 border-b-2 border-dashed border-ink/30 flex items-center justify-between">
                <div>
                  <div className="eyebrow">Order</div>
                  <div className="font-display font-black text-ink text-xl leading-none mt-1" data-testid="order-id">
                    {order?.order_id?.slice(0, 8) ?? orderId?.slice(0, 8)}…
                  </div>
                </div>
                <div className="text-right">
                  <div className="eyebrow">Total</div>
                  <div className="font-display font-black text-2xl mt-1" data-testid="order-total">
                    {order ? formatUSD(order.subtotal) : formatUSD((status?.amount_total ?? 0) / 100)}
                  </div>
                </div>
              </div>
              <div className="px-6 py-5 divide-y-2 divide-dashed divide-ink/20">
                {order?.line_items?.map((li, i) => (
                  <div key={i} className="flex justify-between py-3">
                    <div>
                      <div className="font-display font-bold">{li.tier_name}</div>
                      <div className="text-xs text-ink/60">
                        {li.qty} × {formatUSD(li.price_per)}
                      </div>
                    </div>
                    <div className="font-display font-black">{formatUSD(li.subtotal)}</div>
                  </div>
                )) ?? (
                  <div className="py-3 text-ink/60">Order details loading…</div>
                )}
              </div>
              <div className="px-6 py-4 bg-ink text-bone flex justify-between items-center">
                <div className="text-[11px] uppercase tracking-widest text-bone/60">
                  {order
                    ? new Date(order.created_at).toLocaleString()
                    : ""}
                </div>
                <div className="tag-street">Paid</div>
              </div>
            </div>

            {/* Next steps */}
            <div className="mt-10">
              <h2 className="font-display font-black uppercase text-3xl tracking-tight">What happens next</h2>
              <div className="mt-5 grid md:grid-cols-3 gap-4">
                {[
                  {
                    n: "01",
                    t: "Onboarding",
                    d: order?.skip_details
                      ? "We'll email you a scheduler to book an onboarding call within 1 business day."
                      : "Ops will review your brief and confirm the scope + schedule within 1 business day.",
                  },
                  {
                    n: "02",
                    t: "Staffing",
                    d: "We match HempSafe-certified ambassadors to your dates, territory, and product.",
                  },
                  {
                    n: "03",
                    t: "Activation",
                    d: "Ambassadors execute in-store, capture recaps, photos, and sell-through data.",
                  },
                ].map((s) => (
                  <div key={s.n} className="card card-hover">
                    <div className="eyebrow">{s.n}</div>
                    <h3 className="font-display font-black text-xl uppercase mt-2">{s.t}</h3>
                    <p className="text-sm text-ink/70 mt-2 leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/sprints" className="btn-canopy">
                Buy more activations
              </Link>
              <Link href="/schedule-an-intro-call" className="btn-ghost text-sm">
                Schedule onboarding call
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

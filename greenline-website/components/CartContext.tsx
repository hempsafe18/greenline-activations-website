"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { TIERS, getTierForQty, priceQuote } from "@/lib/pricing";

export type CartLine = {
  tier_id: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  justAdded: boolean;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  justAdded: boolean;
  openCart: () => void;
  closeCart: () => void;
  addActivations: (qty: number) => void;
  setLineQty: (index: number, qty: number) => void;
  removeLine: (index: number) => void;
  clear: () => void;
  totalQty: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "gl.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    lines: [],
    isOpen: false,
    justAdded: false,
  });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          setState((s) => ({ ...s, lines: parsed }));
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {}
  }, [state.lines, hydrated]);

  const openCart = useCallback(() => setState((s) => ({ ...s, isOpen: true, justAdded: false })), []);
  const closeCart = useCallback(() => setState((s) => ({ ...s, isOpen: false })), []);

  const addActivations = useCallback((qty: number) => {
    if (qty < 1) return;
    const tier = getTierForQty(qty);
    setState((s) => {
      // Merge by tier: if a line for this tier exists, sum qty then re-tier
      const existingIndex = s.lines.findIndex((l) => l.tier_id === tier.id);
      let nextLines: CartLine[];
      if (existingIndex >= 0) {
        nextLines = [...s.lines];
        nextLines[existingIndex] = {
          tier_id: tier.id,
          qty: nextLines[existingIndex].qty + qty,
        };
      } else {
        nextLines = [...s.lines, { tier_id: tier.id, qty }];
      }
      return { ...s, lines: nextLines, isOpen: true, justAdded: true };
    });
    setTimeout(() => setState((s) => ({ ...s, justAdded: false })), 1200);
  }, []);

  const setLineQty = useCallback((index: number, qty: number) => {
    if (qty < 1) return;
    setState((s) => {
      const tier = getTierForQty(qty);
      const nextLines = [...s.lines];
      nextLines[index] = { tier_id: tier.id, qty };
      return { ...s, lines: nextLines };
    });
  }, []);

  const removeLine = useCallback((index: number) => {
    setState((s) => {
      const nextLines = s.lines.filter((_, i) => i !== index);
      return { ...s, lines: nextLines };
    });
  }, []);

  const clear = useCallback(() => setState((s) => ({ ...s, lines: [] })), []);

  const { totalQty, subtotal } = useMemo(() => {
    let qty = 0;
    let sum = 0;
    for (const l of state.lines) {
      qty += l.qty;
      sum += priceQuote(l.qty).subtotal;
    }
    return { totalQty: qty, subtotal: sum };
  }, [state.lines]);

  const value: CartContextValue = {
    lines: state.lines,
    isOpen: state.isOpen,
    justAdded: state.justAdded,
    openCart,
    closeCart,
    addActivations,
    setLineQty,
    removeLine,
    clear,
    totalQty,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { TIERS };

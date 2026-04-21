"use client";

import { ReactNode } from "react";

type Props = {
  items: string[];
  accent?: "ink" | "canopy" | "street";
  speed?: "slow" | "fast";
};

const accentMap = {
  ink: "bg-ink text-bone",
  canopy: "bg-canopy text-ink",
  street: "bg-street text-bone",
};

export default function Marquee({ items, accent = "street", speed = "slow" }: Props) {
  const dup = [...items, ...items, ...items, ...items];
  return (
    <div
      className={`w-full border-y-2 border-ink overflow-hidden ${accentMap[accent]}`}
      data-testid="marquee"
    >
      <div
        className="marquee-track py-3"
        style={{ animationDuration: speed === "fast" ? "18s" : "32s" }}
      >
        {dup.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-4 font-display font-black uppercase tracking-tight text-lg px-4 shrink-0"
          >
            <span>{item}</span>
            <Dot />
          </span>
        ))}
      </div>
    </div>
  );
}

function Dot(): ReactNode {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <circle cx="5" cy="5" r="4" />
    </svg>
  );
}

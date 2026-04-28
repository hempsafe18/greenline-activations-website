"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";

const navLinks = [
  { label: "Sprints", href: "/sprints" },
  { label: "Blog", href: "/blog" },
  { label: "Pilot Program", href: "/pilot-program" },
  { label: "ROI Calculator", href: "/retail-activation-roi-calculator" },
  { label: "Ambassadors", href: "/brand-ambassador-opportunities" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalQty, openCart, justAdded } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b-2 ${
        scrolled
          ? "bg-bone/80 backdrop-blur-xl border-ink/20"
          : "bg-bone border-transparent"
      }`}
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          data-testid="header-logo"
        >
          <span className="inline-block w-3 h-3 bg-canopy border-2 border-ink" aria-hidden />
          <span className="font-display font-black text-xl text-ink tracking-tight uppercase">
            Greenline<span className="text-street">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm font-bold text-ink hover:text-street transition-colors uppercase tracking-wider"
              data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/schedule-an-intro-call"
            className="hidden md:inline-flex font-display text-xs font-bold text-ink hover:text-street uppercase tracking-wider px-3 py-2"
            data-testid="header-book-call"
          >
            Book Call
          </Link>
          <Link
            href="/sprints"
            className="hidden sm:inline-flex btn-ghost text-xs py-2 px-4"
            data-testid="header-pricing-button"
          >
            Pricing
          </Link>
          {/* Cart button */}
          <button
            onClick={openCart}
            className={`relative flex items-center gap-2 border-2 border-ink bg-canopy px-3 py-2 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all ${
              justAdded ? "animate-pop-in" : ""
            }`}
            data-testid="header-cart-button"
            aria-label={`Open cart. ${totalQty} items.`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-ink"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="19" cy="21" r="1.5" />
            </svg>
            <span className="font-display font-black text-ink text-sm" data-testid="header-cart-qty">
              {totalQty}
            </span>
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-street border-2 border-ink rounded-full" />
            )}
          </button>

          <button
            className="lg:hidden p-2 border-2 border-ink bg-white ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            data-testid="header-mobile-toggle"
          >
            <div className="w-4 h-0.5 bg-ink mb-1" />
            <div className="w-4 h-0.5 bg-ink mb-1" />
            <div className="w-4 h-0.5 bg-ink" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-bone border-t-2 border-ink px-4 py-6 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display font-bold text-ink uppercase text-sm py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/schedule-an-intro-call"
            className="font-display font-bold text-ink uppercase text-sm py-1"
            onClick={() => setMenuOpen(false)}
          >
            Book an Onboarding Call
          </Link>
        </div>
      )}
    </header>
  );
}

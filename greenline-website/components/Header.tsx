"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Pilot Program", href: "/pilot-program" },
  { label: "Ambassadors", href: "/brand-ambassador-opportunities" },
  { label: "ROI Calculator", href: "/retail-activation-roi-calculator" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-sans font-bold text-xl text-dark">
            <span className="text-green">Greenline</span> Activations
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-dark hover:text-green transition-colors duration-200 text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/brand-ambassador-application" className="font-sans text-dark hover:text-green transition-colors text-base">
            Join Our Team
          </Link>
          <Link href="/schedule-an-intro-call" className="btn-primary text-sm px-6 py-2.5">
            Schedule a Call
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-dark mb-1.5 transition-all" />
          <div className="w-5 h-0.5 bg-dark mb-1.5 transition-all" />
          <div className="w-5 h-0.5 bg-dark transition-all" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-dark hover:text-green text-base py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/brand-ambassador-application"
            className="font-sans text-dark hover:text-green text-base py-1"
            onClick={() => setMenuOpen(false)}
          >
            Join Our Team
          </Link>
          <Link
            href="/schedule-an-intro-call"
            className="btn-primary text-center text-sm mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Schedule a Call
          </Link>
        </div>
      )}
    </header>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Field Marketing for Beverage Brands",
  description:
    "Greenline Activations drives sell-through for hemp and functional beverage brands with on-the-ground field marketing, sampling, and retail execution across Florida.",
};

const services = [
  {
    icon: "🚀",
    title: "Market Launch Pilots",
    description:
      "Test your brand in real retail environments with structured 30–60 day pilots. Get sell-through data before committing to a full rollout.",
    href: "/pilot-program",
    cta: "Launch a Pilot",
  },
  {
    icon: "🏪",
    title: "On-Premise Activations",
    description:
      "Sampling events and in-store demos executed by trained brand ambassadors who know how to convert conversations into cases sold.",
    href: "/schedule-an-intro-call",
    cta: "Get Started",
  },
  {
    icon: "📊",
    title: "Merchandising Blitzes",
    description:
      "Protect your shelf space and drive impulse purchases with targeted merchandising runs, resets, and visibility audits.",
    href: "/schedule-an-intro-call",
    cta: "Learn More",
  },
  {
    icon: "🎪",
    title: "Event & Festival Support",
    description:
      "Staff and execute high-traffic events with brand-trained ambassadors who represent your product the right way.",
    href: "/schedule-an-intro-call",
    cta: "Get Started",
  },
  {
    icon: "👥",
    title: "Expert Ambassadors",
    description:
      "A vetted roster of Florida brand ambassadors with beverage experience, recruited, trained, and managed by our team.",
    href: "/brand-ambassador-opportunities",
    cta: "Meet Our Team",
  },
  {
    icon: "📈",
    title: "Monthly Field Programs",
    description:
      "Ongoing retail support that keeps your brand visible, your shelf organized, and your accounts reordering — month after month.",
    href: "/schedule-an-intro-call",
    cta: "Build a Program",
  },
];

const stats = [
  { value: "Florida-First", label: "Market Focus" },
  { value: "No Contracts", label: "Flexible Engagements" },
  { value: "Data-Driven", label: "Field Execution" },
  { value: "Rapid Deploy", label: "From Brief to In-Store" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream section">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-6">Florida Field Marketing</span>
            <h1 className="text-5xl md:text-6xl font-bold text-dark leading-tight mt-4 mb-6">
              Magnify Your{" "}
              <span className="text-green">Retail Presence</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl font-body">
              Field marketing, sampling, and retail execution for hemp and functional beverage brands.
              Drive sell-through, protect shelf space, and move inventory faster —
              without the hiring headaches.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/schedule-an-intro-call" className="btn-primary text-base">
                Schedule a Free Call
              </Link>
              <Link href="/pilot-program" className="btn-secondary text-base">
                Launch a Pilot
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-5 font-body">
              No long-term contracts. No hiring headaches. Just results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-green py-10 px-4">
        <div className="container-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-white font-sans font-bold text-xl md:text-2xl">{stat.value}</div>
                <div className="text-green-100 text-sm font-body mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="section">
        <div className="container-lg">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag mb-4">The Problem</span>
              <h2 className="text-4xl font-bold text-dark mt-3 mb-6 leading-tight">
                Most brands win distribution —<br />
                <span className="text-coral">then lose at execution</span>
              </h2>
              <div className="space-y-4 font-body text-gray-600">
                <p>You fought to get on the shelf. But without consistent sampling, merchandising, and in-store presence, your velocity stalls and retailers deauthorize your SKU.</p>
                <p>Hiring and managing a field team is expensive, slow, and distracting from your core business. Greenline solves that with a ready-to-deploy activation team, on-demand.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Hidden logistics costs draining margin", solved: true },
                { label: "Reps who don't know your product", solved: true },
                { label: "No visibility into field performance", solved: true },
                { label: "Stale shelves, missing SKUs, poor placement", solved: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 card py-4">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-body text-dark text-sm line-through text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-gray-50">
        <div className="container-lg">
          <div className="text-center mb-14">
            <span className="tag mb-4">What We Do</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              Field Marketing That <span className="text-green">Moves Inventory</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto font-body">
              Every service is designed around one goal: turning shelf space into sell-through.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="card flex flex-col hover:shadow-md transition-shadow duration-200">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-sans font-bold text-xl text-dark mb-2">{s.title}</h3>
                <p className="font-body text-gray-600 text-sm leading-relaxed flex-1">{s.description}</p>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1 text-green font-sans font-semibold text-sm mt-5 hover:gap-2 transition-all"
                >
                  {s.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HempSafe callout */}
      <section className="section">
        <div className="container-lg">
          <div className="bg-dark rounded-3xl p-10 md:p-14 text-white flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <span className="inline-block text-sm font-sans font-semibold text-green bg-green/10 px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                HempSafe™
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Compliance-Ready Activations
              </h2>
              <p className="text-gray-300 font-body leading-relaxed max-w-lg">
                Our HempSafe™ certification ensures every ambassador understands hemp regulations,
                age restrictions, and responsible sampling practices — protecting your brand and your accounts.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="https://hempsafe.org" className="btn-coral text-base" target="_blank" rel="noopener noreferrer">
                Learn About HempSafe™
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator CTA */}
      <section className="section bg-green-50">
        <div className="container-lg text-center">
          <span className="tag mb-4">Free Tool</span>
          <h2 className="text-4xl font-bold text-dark mt-3 mb-4">
            Audit Your Activation ROI <span className="text-green">Before You Launch</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-body mb-8">
            Stop guessing. Use our free calculator to find your break-even point,
            project sell-through, and understand if field marketing makes sense for your brand right now.
          </p>
          <Link href="/retail-activation-roi-calculator" className="btn-primary text-base">
            Open Free Calculator
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-cream">
        <div className="container-lg text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Ready to move more product?
          </h2>
          <p className="text-gray-600 max-w-md mx-auto font-body mb-8 text-lg">
            15 minutes. No pitch. Just an honest conversation about your brand&apos;s field marketing needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/schedule-an-intro-call" className="btn-primary text-base">
              Schedule an Intro Call
            </Link>
            <Link href="/pilot-program" className="btn-secondary text-base">
              View Pilot Program
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

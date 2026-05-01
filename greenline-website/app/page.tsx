import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SprintBuilder from "@/components/SprintBuilder";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "Greenline Activations · Retail Activations. Add to Cart.",
  description:
    "Productized field marketing for hemp and functional beverage brands. Build your sprint, checkout with Stripe, ship ambassadors to retail markets nationwide — no proposals, no contracts.",
};

const MARQUEE_ITEMS = [
  "ADD SPRINT TO CART",
  "NATIONAL RETAIL ACTIVATION",
  "HEMPSAFE™ CERTIFIED",
  "NO PROPOSALS · NO CONTRACTS",
  "FIELD MARKETING · PRODUCTIZED",
];

const SERVICES = [
  {
    kicker: "01 / Launch",
    title: "Market Launch Pilots",
    body: "Structured 30–60 day pilots that validate SKU velocity in real accounts across any market before a full rollout.",
    href: "/pilot-program",
    cta: "Launch a pilot",
  },
  {
    kicker: "02 / Sample",
    title: "On-Premise Activations",
    body: "Demos and sampling executed by trained ambassadors who know how to convert conversations into cases.",
    href: "/sprints",
    cta: "Book activations",
  },
  {
    kicker: "03 / Protect",
    title: "Merchandising Blitzes",
    body: "Targeted merchandising runs, resets, and shelf audits to protect placement and drive impulse.",
    href: "/sprints",
    cta: "Shop sprints",
  },
  {
    kicker: "04 / Scale",
    title: "Monthly Field Programs",
    body: "Ongoing retail support that keeps your brand visible, your shelf organized, and accounts reordering.",
    href: "/sprints",
    cta: "Scale your sprint",
  },
];

const STATS = [
  { value: "4", label: "Sprint tiers" },
  { value: "$165", label: "Lowest per-activation" },
  { value: "0", label: "Long-term contracts" },
  { value: "~7 days", label: "Brief → in-store" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO — Build Your Sprint instant quote */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #0A0A0A 0, #0A0A0A 1px, transparent 1px, transparent 12px)",
            }}
          />
        </div>
        <div className="container-xl px-4 pt-12 md:pt-20 pb-14 md:pb-24 relative">
          <div className="grid lg:grid-cols-[1.05fr,1fr] gap-12 items-center">
            <div>
              <span className="tag-street">National · Hemp + Functional Beverage</span>
              <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[44px] sm:text-6xl lg:text-[80px]">
                Shelf work,
                <br />
                sold like a <span className="bg-canopy border-2 border-ink inline-block px-3 -rotate-2 ml-1">SKU.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-ink/80">
                Greenline is the first <span className="font-display font-bold">productized retail activation agency</span>.
                Pick a tier, pick a quantity, checkout with Stripe, and we deploy trained ambassadors into accounts across the country.
                No proposals. No procurement. No long-term contracts.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/sprints" className="btn-street text-base" data-testid="hero-shop-sprints">
                  Shop Sprints →
                </Link>
                <Link href="/retail-activation-roi-calculator" className="btn-ghost text-sm">
                  ROI Calculator
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-black text-3xl text-ink leading-none">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-widest text-ink/60 mt-2">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: instant quote */}
            <div className="relative">
              <div className="absolute -top-3 -left-3 rotate-[-4deg] bg-ink text-bone px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest border-2 border-ink shadow-brutal z-10">
                Instant Quote
              </div>
              <SprintBuilder initialQty={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <Marquee items={MARQUEE_ITEMS} accent="street" />

      {/* Activation Gallery */}
      <section className="section bg-bone">
        <div className="container-xl px-4">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <span className="tag">Real Work</span>
              <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight max-w-xl">
                Activations across <span className="text-canopy">the country</span>.
              </h2>
            </div>
            <p className="max-w-sm text-ink/70">
              Smoke shops. Liquor stores. Natural grocers. Summer festivals. Our ambassadors show up trained,
              branded, and ready to convert.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden border-2 border-ink shadow-brutal bg-white h-[420px]">
              <Image
                src="/images/11.jpg"
                alt="3Chi sampling event setup"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-ink text-bone px-3 py-1 text-[11px] font-display font-black uppercase tracking-wider">
                3Chi · Sampling
              </div>
            </div>
            <div className="relative overflow-hidden border-2 border-ink shadow-brutal bg-white h-[420px]">
              <Image
                src="/images/senorita-sampling-event-setup.jpg"
                alt="Señorita sampling event setup"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-canopy text-ink px-3 py-1 text-[11px] font-display font-black uppercase tracking-wider">
                Señorita · Sampling
              </div>
            </div>
            <div className="relative overflow-hidden border-2 border-ink shadow-brutal bg-white h-[420px]">
              <Image
                src="/images/the-good-poor-event-sampling.jpg"
                alt="The Good & Poor event sampling"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-street text-bone px-3 py-1 text-[11px] font-display font-black uppercase tracking-wider">
                The Good &amp; Poor · Event
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="section bg-ink text-bone border-y-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="tag-street">The shelf problem</span>
            <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Most brands win distribution — then <span className="text-street">lose at execution</span>.
            </h2>
            <p className="mt-5 text-bone/80 leading-relaxed max-w-lg">
              Without consistent sampling, merchandising, and in-store presence, velocity stalls and retailers
              deauthorize your SKU. Hiring a field team is slow, expensive, and off-mission for a brand operator.
            </p>
            <p className="mt-4 text-bone/60">
              We fix that with a productized field team, deployed by <span className="text-canopy font-display font-bold">sprint</span>.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Hidden logistics costs draining margin",
              "Reps who don't know your product",
              "No visibility into field performance",
              "Stale shelves. Missing SKUs. Poor placement.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 bg-bone text-ink border-2 border-ink p-4 shadow-brutal"
              >
                <div className="w-8 h-8 bg-street text-bone border-2 border-ink flex items-center justify-center font-display font-black">
                  ✕
                </div>
                <span className="font-display font-bold uppercase tracking-tight text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section bg-bone">
        <div className="container-xl px-4">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <span className="tag">What We Do</span>
              <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight max-w-xl">
                Field marketing that <span className="text-canopy">moves inventory</span>.
              </h2>
            </div>
            <Link href="/sprints" className="btn-ghost text-xs">
              See Pricing →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="card card-hover block group"
                data-testid={`service-card-${s.kicker.split(" ")[0]}`}
              >
                <div className="eyebrow mb-4">{s.kicker}</div>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight leading-none mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>
                <div className="mt-5 font-display font-bold uppercase text-xs tracking-widest text-ink group-hover:text-street">
                  {s.cta} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HempSafe callout */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-[1.2fr,1fr] gap-10 items-center">
          <div>
            <span className="tag-ink">HempSafe™</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Compliance-ready activations. No fine-print surprises.
            </h2>
            <p className="mt-5 text-ink/80 max-w-lg">
              Every ambassador is HempSafe™ certified — understands hemp regs, age restrictions, and responsible sampling.
              Protect your brand and your accounts on every stop.
            </p>
            <div className="mt-6">
              <a
                href="https://hempsafe.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                data-testid="hempsafe-learn-more"
              >
                Learn About HempSafe™
              </a>
            </div>
          </div>
          <div className="bg-ink text-bone border-2 border-ink p-8 shadow-brutal-lg">
            <div className="grid grid-cols-2 gap-6 text-center">
              {[
                ["100%", "Trained"],
                ["0", "Compliance incidents"],
                ["National", "Coverage"],
                ["2015", "Ambassador program est."],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display font-black text-4xl text-canopy leading-none">{v}</div>
                  <div className="text-[11px] uppercase tracking-widest text-bone/60 mt-2">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-bone">
        <div className="container-xl px-4 text-center relative">
          <div className="inline-block bg-street text-bone border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 mb-6 shadow-brutal">
            Stop booking calls. Start buying activations.
          </div>
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Your shelf is <br className="hidden md:block" />
            <span className="bg-ink text-bone px-3 inline-block">waiting.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            Build a sprint in under a minute. Checkout with Stripe. We handle the rest —
            staffing, training, execution, and recaps — from brief to in-store in about a week.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/sprints" className="btn-street text-base" data-testid="final-cta-shop-sprints">
              Shop Sprints →
            </Link>
            <Link href="/schedule-an-intro-call" className="btn-ghost text-sm" data-testid="final-cta-book-call">
              Prefer to chat first?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

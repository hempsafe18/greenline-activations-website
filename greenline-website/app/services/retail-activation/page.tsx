import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatStrip } from "@/components/StatStrip";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Retail Activation Services Florida | Greenline Activations — Sampling, Merchandising & In-Store Demos",
  description:
    "Productized retail activation for hemp and functional beverage brands in Florida. In-store demos, shelf audits, and merchandising blitzes — HempSafe-certified and Tally-tracked. No contracts. Book online.",
  openGraph: {
    title: "Retail Activation Services Florida | Greenline Activations",
    description:
      "In-store demos, shelf audits, and merchandising for hemp and functional beverage brands. HempSafe-certified. Tally-tracked. No contracts.",
    url: "https://www.greenlineactivations.com/services/retail-activation/",
    siteName: "Greenline Activations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retail Activation Services Florida | Greenline Activations",
    description: "Retail activation for hemp and functional beverage brands. Sampling, merchandising, shelf audits. No contracts.",
  },
  alternates: { canonical: "https://www.greenlineactivations.com/services/retail-activation/" },
};

const BREADCRUMB = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services/brand-activation/" },
  { name: "Retail Activation", href: "/services/retail-activation/" },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Retail Activation Services",
  provider: { "@type": "Organization", name: "Greenline Activations" },
  areaServed: "Florida",
  description:
    "Retail activation for hemp and functional beverage brands — in-store demos, shelf audits, and merchandising blitzes across Florida retail accounts.",
};

const SERVICES = [
  {
    kicker: "01",
    title: "In-Store Sampling & Demos",
    body: "HempSafe™-certified ambassadors deployed to retail accounts for product demonstrations and sampling. Tally-tracked from first pour. 50-point recap delivered within 48 hours.",
    detail: "Smoke shops, specialty retailers, natural grocers",
  },
  {
    kicker: "02",
    title: "Shelf Audits & Placement Checks",
    body: "Field reps visit your accounts to verify shelf placement, check inventory levels, confirm pricing accuracy, and identify display opportunities. All observations captured in recap format.",
    detail: "Any Florida retail account",
  },
  {
    kicker: "03",
    title: "Merchandising Blitzes",
    body: "Rapid, targeted merchandising runs to reset shelf position, correct facings, install displays, and protect placement across multiple accounts in a compressed time window.",
    detail: "Multi-account single-day runs",
  },
  {
    kicker: "04",
    title: "New Account Introductions",
    body: "Field reps introduce your brand to accounts that haven't yet stocked it — brand presentations, sample leave-behinds, and first conversation data captured for your team's follow-up.",
    detail: "Prospecting and distribution expansion",
  },
  {
    kicker: "05",
    title: "Monthly Field Programs",
    body: "Ongoing retail support programs that keep your brand visible, your shelf organized, and your accounts reordering — deployed on a recurring sprint schedule with no long-term contract.",
    detail: "Ongoing / Sprint-based",
  },
  {
    kicker: "06",
    title: "Product Launch Activations",
    body: "Market entry activations for new SKUs — introduction sampling, first velocity data, and a launch-specific 50-point recap with metrics your team can take to buyers and investors.",
    detail: "New SKU or market entry",
  },
];

const WHY_RETAIL = [
  {
    stat: "67%",
    label: "Purchase decisions made in-store",
    body: "Most retail purchases for functional and hemp beverages are decided at shelf. An ambassador who can intercept and convert that moment is worth more than any digital ad dollar.",
  },
  {
    stat: "3×",
    label: "Velocity lift with active sampling",
    body: "Retail accounts with active sampling programs see significantly higher sell-through velocity than accounts with passive shelf placement only.",
  },
  {
    stat: "30%",
    label: "Greenline avg. conversion rate",
    body: "Twice the industry average. The gap comes from certified, product-trained ambassadors — not from increased sample distribution volume.",
  },
];

const FLORIDA_CITIES = [
  { city: "Miami / Dade County", href: "/florida/miami/brand-activation-staff/" },
  { city: "Tampa Bay", href: "/florida/tampa/brand-activation-staff/" },
  { city: "Orlando", href: "/florida/orlando/brand-activation-staff/" },
  { city: "Jacksonville", href: "/florida/jacksonville/brand-activation-staff/" },
  { city: "Fort Lauderdale", href: "/florida/fort-lauderdale/brand-activation-staff/" },
];

const FAQ = [
  {
    question: "What types of retail accounts do you activate?",
    answer:
      "Greenline activates across Florida's primary retail channels for hemp and functional beverages — smoke shops, specialty retailers, natural grocers, health food stores, and convenience channels. We match ambassador training and approach to the specific account type on each activation.",
  },
  {
    question: "What is the difference between a sampling activation and a merchandising blitz?",
    answer:
      "A sampling activation deploys a HempSafe™-certified ambassador to a retail account to sample your product directly with consumers at shelf — the goal is first-purchase conversion. A merchandising blitz sends a field rep to verify and correct shelf position, facings, pricing, and display across multiple accounts in a compressed time window — the goal is protecting placement and retail compliance.",
  },
  {
    question: "Do you offer ongoing retail support or only one-off activations?",
    answer:
      "Both. Greenline's sprint model supports one-time market test activations (Test Sprint) as well as ongoing monthly field programs (Sprint 1, Sprint 2, Sprint 3). All tiers use the same Tally tracking and 50-point recap system. No long-term contracts required for any tier.",
  },
  {
    question: "How quickly can you deploy after booking?",
    answer:
      "Greenline's standard brief-to-in-store turnaround is approximately 7 days. After checkout, your brand completes an event brief with location preferences, staffing notes, and product details. We handle staffing, training, and logistics from there.",
  },
  {
    question: "What does a 50-point recap include for retail activations?",
    answer:
      "Your 50-point recap covers five categories: sampling metrics (samples distributed, hourly rate, portion compliance), conversion metrics (observed purchases, conversion rate by time block), consumer conversations (top questions, objections, preferences), retailer observations (staff engagement, shelf positioning, reorder signals), and ambassador performance (compliance, brand accuracy, next-activation recommendations). Delivered within 48 hours of each activation.",
  },
  {
    question: "Can I book retail activation without a long-term commitment?",
    answer:
      "Yes. Greenline is the only retail activation agency with a fully productized, no-contract model. Choose your tier, choose your quantity, checkout with Stripe. Your only commitment is the activation sprint you purchase.",
  },
];

export default function RetailActivationPage() {
  return (
    <>
      <JsonLd data={SERVICE_SCHEMA} />
      <Breadcrumb items={BREADCRUMB} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="tag-street">Retail Activation</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-5xl lg:text-[64px]">
              Retail Activation Services —{" "}
              <span className="text-canopy">Sampling, Merchandising, and In-Store Execution</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              From first-pour sampling to shelf audit to full merchandising blitz — Greenline handles the full retail activation stack for hemp and functional beverage brands. HempSafe™ certified. Tally-tracked. No contracts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-street text-base">
                Book Retail Activation →
              </Link>
              <Link href="/results/" className="btn-ghost text-sm">
                See Conversion Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip />

      {/* Why retail activation */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">The Case for Field Execution</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Why Retail Activation Moves Inventory
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_RETAIL.map((item) => (
              <div key={item.label} className="bg-bone text-ink border-2 border-ink p-6 shadow-brutal">
                <div className="font-display font-black text-5xl text-canopy leading-none mb-2">{item.stat}</div>
                <div className="font-display font-bold uppercase tracking-tight text-sm mb-3 border-b-2 border-ink pb-3">{item.label}</div>
                <p className="text-sm text-ink/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Service Menu</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Retail Activation Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.kicker} className="card border-2 border-ink shadow-brutal flex flex-col">
                <div className="font-display font-black text-4xl text-canopy/30 leading-none mb-3">{s.kicker}</div>
                <h3 className="font-display font-black uppercase tracking-tight text-lg mb-3">{s.title}</h3>
                <p className="text-sm text-ink/80 leading-relaxed flex-1">{s.body}</p>
                <div className="mt-4 pt-3 border-t border-ink/10">
                  <span className="text-[10px] uppercase tracking-widest text-ink/40 font-display font-bold">{s.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The sprint model */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-[1.2fr,1fr] gap-12 items-center">
          <div>
            <span className="tag-ink">The Productized Model</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Retail Activation Bought Like a SKU
            </h2>
            <p className="mt-5 text-ink/80 leading-relaxed">
              No proposals. No procurement process. No retainer. Greenline's productized sprint model means you pick a tier, pick a quantity, checkout with Stripe, and ambassadors deploy to your accounts.
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              Four tiers — from a 6-activation test sprint to 60+ activation volume programs. All tiers use the same Tally tracking, the same HempSafe™-certified ambassadors, and the same 50-point recap system.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sprints/" className="btn-primary">
                View Sprint Tiers →
              </Link>
              <Link href="/book/" className="btn-ghost text-sm">
                Book Now
              </Link>
            </div>
          </div>
          <div className="bg-ink text-bone border-2 border-ink p-8 shadow-brutal-lg">
            <div className="space-y-5">
              {[
                { tier: "Test Sprint", qty: "6 activations", note: "Validate before you scale" },
                { tier: "Sprint 1", qty: "12–29 activations", note: "Most popular" },
                { tier: "Sprint 2", qty: "30–59 activations", note: "Best value" },
                { tier: "Sprint 3", qty: "60+ activations", note: "Volume pricing" },
              ].map((t) => (
                <div key={t.tier} className="flex items-center justify-between border-b border-bone/10 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-display font-black text-sm uppercase tracking-tight">{t.tier}</div>
                    <div className="text-xs text-bone/50 mt-0.5">{t.note}</div>
                  </div>
                  <div className="font-display font-bold text-canopy text-sm">{t.qty}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Florida markets */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">Coverage</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Retail Activation Across Florida
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FLORIDA_CITIES.map(({ city, href }) => (
              <Link key={href} href={href}
                className="flex items-center justify-between gap-4 bg-bone text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group">
                <span className="font-display font-bold uppercase tracking-tight text-sm">{city} Retail Activation</span>
                <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">→</span>
              </Link>
            ))}
            <Link href="/florida/brand-activation/"
              className="flex items-center justify-between gap-4 bg-canopy text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow">
              <span className="font-display font-bold uppercase tracking-tight text-sm">All Florida Markets</span>
              <span className="font-display font-black text-xs">→</span>
            </Link>
          </div>
        </div>
      </section>

      <FaqSection items={FAQ} heading="Retail Activation FAQs" />

      {/* CTA */}
      <section className="section bg-bone border-t-2 border-ink">
        <div className="container-xl px-4 text-center">
          <div className="inline-block bg-street text-bone border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 mb-6 shadow-brutal">
            Brief to in-store in ~7 days.
          </div>
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Your shelf is
            <br className="hidden md:block" />{" "}
            <span className="bg-ink text-bone px-3 inline-block">waiting.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            No proposals. No long-term contracts. Pick a tier, checkout online, and Greenline deploys HempSafe™-certified ambassadors to your retail accounts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base">Book Retail Activation →</Link>
            <Link href="/sprints/" className="btn-ghost text-sm">View Sprint Tiers</Link>
          </div>
        </div>
      </section>
    </>
  );
}

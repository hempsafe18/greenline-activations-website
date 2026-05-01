import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatStrip } from "@/components/StatStrip";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Brand Activation Staff for Hire | Greenline Activations — Beverage & Hemp Specialists",
  description:
    "Hire trained brand activation staff for your next campaign. Greenline Activations provides HempSafe-certified ambassadors for retail demos, festivals, and sampling events across Florida. Book online in minutes — no contracts required.",
  openGraph: {
    title: "Brand Activation Staff for Hire | Greenline Activations",
    description:
      "HempSafe-certified brand activation staff for hemp, THC, and adult beverage brands. Book online, no contracts.",
    url: "https://www.greenlineactivations.com/services/brand-activation/",
    siteName: "Greenline Activations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Activation Staff for Hire | Greenline Activations",
    description:
      "HempSafe-certified brand activation staff for hemp, THC, and adult beverage brands.",
  },
  alternates: { canonical: "https://www.greenlineactivations.com/services/brand-activation/" },
};

const BREADCRUMB = [
  { name: "Home", href: "/" },
  { name: "Brand Activation", href: "/services/brand-activation/" },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Brand Activation Staff",
  provider: { "@type": "Organization", name: "Greenline Activations" },
  areaServed: "Florida",
  description:
    "Hire trained brand activation staff for hemp, THC, and adult beverage brands. HempSafe-certified ambassadors for retail demos, festivals, and sampling events across Florida.",
};

const SERVICES = [
  {
    title: "Retail Sampling Activations",
    body: "In-store product demonstrations at smoke shops, liquor stores, and natural grocers. The core Greenline service — high-frequency, Tally-tracked, 50-point recap included.",
  },
  {
    title: "Festival & Event Sampling",
    body: "High-volume sampling at Florida summer festivals, craft markets, and outdoor events. Rapid throughput, age verification at scale, brand story delivery under real-world conditions.",
  },
  {
    title: "Trade Show & Brand Presence Staff",
    body: "Professional brand representation at trade shows, buyer events, and industry conferences. Ambassadors briefed on your brand story, product specs, and buyer conversation goals.",
  },
  {
    title: "Product Launch Activations",
    body: "Market entry activations designed to introduce new SKUs to retail accounts and generate initial purchase conversion data. Includes priority recap with launch-specific metrics.",
  },
  {
    title: "Street Team & Mobile Sampling",
    body: "Mobile activations that follow your distribution footprint. Flexible, fast-to-deploy, and fully tracked.",
  },
  {
    title: "On-Premise Alcohol Demos",
    body: "Licensed, compliant on-premise demonstrations for spirits, RTD cocktails, and wine brands at bars and restaurants.",
  },
];

const RECAP_CATEGORIES = [
  {
    num: "1",
    title: "Sampling Metrics",
    body: "Total samples poured, hourly distribution rate, sample waste, portion compliance, and tasting sequence.",
  },
  {
    num: "2",
    title: "Conversion Metrics",
    body: "Observed purchase conversions, conversion rate by time block, retailer POS correlation, reorder intent signals.",
  },
  {
    num: "3",
    title: "Consumer Conversations",
    body: "Most common questions, purchase objections logged, flavor preference data, demographic observations.",
  },
  {
    num: "4",
    title: "Retailer Observations",
    body: "Staff engagement, shelf positioning feedback, reorder interest, competitive placement notes.",
  },
  {
    num: "5",
    title: "Ambassador Performance",
    body: "Compliance observations, brand message accuracy, escalation handling, next-activation recommendations.",
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
    question: "How much does brand activation staff cost?",
    answer:
      "Greenline Activations uses a productized tier model — no custom proposals, no contracts. Pick your tier and quantity, checkout via Stripe, and we deploy. Pricing is transparent and available at greenlineactivations.com/book.",
  },
  {
    question: "Do your ambassadors need product knowledge training?",
    answer:
      "Every Greenline ambassador completes HempSafe™ certification before their first activation. That covers hemp regulations, THC compliance, age restrictions, responsible sampling protocols, and product category knowledge specific to beverage brands.",
  },
  {
    question: "Can I book activation staff without a long-term contract?",
    answer:
      "Yes. Greenline is the only activation agency with a fully productized model — pick a tier, pick a quantity, checkout with Stripe. No proposals, no contracts, no minimums beyond your selected tier.",
  },
  {
    question: "How do you measure activation ROI?",
    answer:
      "Every activation is tracked with Tally in real time. After each event, your brand receives a 50-point activation recap covering samples distributed, consumer conversations, purchase conversions, retailer feedback, and next-step recommendations.",
  },
  {
    question: "Do you work with hemp and THC beverage brands?",
    answer:
      "Yes — hemp and THC beverage activation is our core specialization. Every ambassador is HempSafe™ certified and trained in state-specific hemp regulations, age verification, and responsible sampling for regulated products.",
  },
  {
    question: "Which Florida cities do you serve?",
    answer:
      "Greenline Activations deploys across Florida including Miami/Dade, Tampa Bay, Orlando, Jacksonville, Fort Lauderdale, and surrounding markets. Contact us for coverage in other areas.",
  },
];

export default function BrandActivationPage() {
  return (
    <>
      <JsonLd data={SERVICE_SCHEMA} />
      <Breadcrumb items={BREADCRUMB} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="tag-street">Brand Activation Services</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-5xl lg:text-[68px]">
              Brand Activation Staff for Hire —{" "}
              <span className="text-canopy">Trained, Certified, Conversion-Ready</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              Greenline Activations deploys HempSafe™-certified brand ambassadors to Florida retail accounts and events — no proposals, no contracts, real conversion data after every activation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-street text-base">
                Book Activation Staff →
              </Link>
              <Link href="/book/#tiers" className="btn-ghost text-sm">
                View Activation Tiers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip />

      {/* H2: What Makes Greenline Different */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="max-w-3xl">
            <span className="tag">The Greenline Difference</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6">
              What Makes Greenline Activation Staff Different
            </h2>
            <p className="text-ink/80 leading-relaxed mb-6">
              Most activation agencies send you generic event staff. Greenline sends certified beverage specialists. Every ambassador on the Greenline roster:
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "HempSafe™ Certification",
                  body: "Trained in hemp regulations, age restrictions, and responsible sampling before their first activation.",
                },
                {
                  label: "Tally-Tracked From Pour One",
                  body: "No estimates, no manual tallies, no guessing at results. Every sample counted in real time.",
                },
                {
                  label: "50-Point Post-Activation Recap",
                  body: "Samples distributed, purchase conversions, consumer conversation notes, retailer observations, and next-step recommendations.",
                },
                {
                  label: "Category Expert",
                  body: "Not just how to hand out samples, but how to have accurate, compliant, persuasive conversations about your brand.",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 border-2 border-ink p-4 shadow-brutal bg-bone">
                  <div className="w-6 h-6 mt-0.5 flex-shrink-0 bg-canopy border-2 border-ink flex items-center justify-center font-display font-black text-[10px]">
                    ✓
                  </div>
                  <div>
                    <span className="font-display font-black uppercase tracking-tight text-sm">{item.label} — </span>
                    <span className="text-sm text-ink/80">{item.body}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink/70 font-display font-bold uppercase tracking-tight">
              This is what separates a 30% sample-to-purchase conversion rate from an industry average of 15–20%.
            </p>
          </div>
        </div>
      </section>

      {/* H2: Services */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">What We Offer</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Our Brand Activation Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-bone text-ink border-2 border-ink p-6 shadow-brutal">
                <h3 className="font-display font-black text-lg uppercase tracking-tight mb-2">{s.title}</h3>
                <p className="text-sm text-ink/80 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: Industry Specializations */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">By Category</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6 max-w-2xl">
            Industry Specializations: Who We Activate For
          </h2>
          <p className="max-w-2xl text-ink/80 leading-relaxed mb-8">
            Greenline is not a generalist agency. We specialize in regulated and complex beverage categories.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {[
              { label: "Hemp & CBD Beverages", href: "/services/hemp-thc-beverage-activation/" },
              { label: "THC / Delta-8 / Delta-9 Drinks", href: "/services/hemp-thc-beverage-activation/" },
              { label: "Spirits, Wine & RTD Cocktails", href: "/services/alcohol-beverage-activation/" },
              { label: "Functional & Better-For-You Beverages", href: "/services/functional-beverage-activation/" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between gap-4 border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group bg-bone"
              >
                <span className="font-display font-bold uppercase tracking-tight text-sm">{item.label}</span>
                <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* H2: 50-Point Recap */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-ink">Accountability System</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6 max-w-2xl">
            The 50-Point Activation Recap System
          </h2>
          <p className="max-w-2xl text-ink/80 leading-relaxed mb-10">
            Every Greenline activation closes with a 50-point recap delivered within 48 hours. The recap covers five categories — ten data points each:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECAP_CATEGORIES.map((cat) => (
              <div key={cat.num} className="bg-ink text-bone border-2 border-ink p-6 shadow-brutal">
                <div className="font-display font-black text-4xl text-canopy/40 leading-none mb-3">{cat.num}</div>
                <h3 className="font-display font-black uppercase tracking-tight text-base mb-2">{cat.title}</h3>
                <p className="text-sm text-bone/70 leading-relaxed">{cat.body}</p>
              </div>
            ))}
            <div className="bg-bone text-ink border-2 border-ink p-6 shadow-brutal flex items-center justify-center">
              <p className="font-display font-bold uppercase tracking-tight text-sm text-center text-ink/70">
                No other activation agency in Florida delivers this level of post-event accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H2: Tally Tracking */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag">Real-Time Data</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Tally Tracking: Real-Time Conversion Data
            </h2>
            <p className="mt-5 text-ink/80 leading-relaxed">
              Greenline uses Tally to track every activation in real time — not after the fact, not from memory.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Live conversion counts during the activation window",
                "Time-stamped data so you see peak performance hours",
                "Honest numbers — no inflated sample counts, no rounding up",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/80">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 bg-ink text-canopy flex items-center justify-center font-display font-black text-[10px]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink/70 leading-relaxed">
              Your 50-point recap is built from Tally data, not ambassador recollection. That&apos;s why our conversion figures are verifiable — and why our 30% average is a real number, not a marketing claim.
            </p>
          </div>
          <div className="bg-ink text-bone border-2 border-ink p-8 shadow-brutal-lg text-center">
            <div className="font-display font-black text-7xl text-canopy leading-none">30%</div>
            <div className="text-[13px] uppercase tracking-widest text-bone/60 mt-3">
              Average Sample-to-Purchase Conversion
            </div>
            <div className="mt-6 pt-6 border-t border-bone/20 text-xs text-bone/40 uppercase tracking-widest">
              vs. 15–20% industry average
            </div>
            <div className="mt-4">
              <Link href="/results/" className="btn-canopy text-sm">
                See Conversion Data →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* H2: Florida Markets */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">Florida Coverage</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Brand Activation Staff Across Florida
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FLORIDA_CITIES.map(({ city, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between gap-4 bg-bone text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group"
              >
                <span className="font-display font-bold uppercase tracking-tight text-sm">{city} Brand Activation Staff</span>
                <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">→</span>
              </Link>
            ))}
            <Link
              href="/florida/brand-activation/"
              className="flex items-center justify-between gap-4 bg-canopy text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group"
            >
              <span className="font-display font-bold uppercase tracking-tight text-sm">View All Florida Markets</span>
              <span className="font-display font-black text-xs group-hover:text-street transition-colors">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection items={FAQ} heading="Frequently Asked Questions" />

      {/* H2: Book CTA */}
      <section className="section bg-bone border-t-2 border-ink">
        <div className="container-xl px-4 text-center">
          <span className="tag">Ready to Deploy?</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Book Your Activation Today
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            No proposals. No contracts. No waiting on an account manager. Pick your tier, checkout online, and Greenline deploys certified ambassadors to your accounts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base">
              Book Activation Staff →
            </Link>
            <Link href="/results/" className="btn-ghost text-sm">
              See Results &amp; Conversion Data
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

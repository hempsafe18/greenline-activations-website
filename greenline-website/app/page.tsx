import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SprintBuilder from "@/components/SprintBuilder";
import Marquee from "@/components/Marquee";
import { StatStrip } from "@/components/StatStrip";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Greenline Activations | Brand Activation Agency for Beverage & Hemp Brands",
  description:
    "Greenline Activations deploys HempSafe-certified brand ambassadors for hemp, THC, and adult beverage brands. Pick your tier, checkout online, and ship trained staff to National retail — no contracts, no proposals. 30% avg. sample-to-purchase conversion.",
  openGraph: {
    title: "Greenline Activations | Brand Activation Agency for Beverage & Hemp Brands",
    description:
      "HempSafe-certified brand activation staff for hemp, THC, and adult beverage brands. Book online, no contracts. 30% avg. sample-to-purchase conversion.",
    url: "https://www.greenlineactivations.com/",
    siteName: "Greenline Activations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenline Activations | Brand Activation Agency for Beverage & Hemp Brands",
    description:
      "HempSafe-certified brand activation staff for hemp, THC, and adult beverage brands. Book online, no contracts.",
  },
  alternates: { canonical: "https://www.greenlineactivations.com/" },
};

const MARQUEE_ITEMS = [
  "ADD SPRINT TO CART",
  "NATIONAL RETAIL ACTIVATION",
  "HEMPSAFE™ CERTIFIED",
  "NO PROPOSALS · NO CONTRACTS",
  "FIELD MARKETING · PRODUCTIZED",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick Your Tier & Quantity",
    body: "Choose how many activations you need and at what market intensity. Tiers are priced transparently — no hidden fees, no add-ons.",
  },
  {
    step: "02",
    title: "Checkout via Stripe",
    body: "Secure checkout in under two minutes. No contract to sign. No account manager to wait on.",
  },
  {
    step: "03",
    title: "Ambassadors Deploy",
    body: "Your HempSafe™-certified team shows up trained, branded, and ready. Tally tracking starts from the first pour.",
  },
  {
    step: "04",
    title: "Receive Your 50-Point Recap",
    body: "Within 48 hours of each activation, your brand receives a full performance recap — data, observations, and next-step recommendations.",
  },
];

const CHANNELS = [
  {
    name: "Smoke Shops & Head Shops",
    body: "The highest-density channel for hemp and THC drinks. Ambassadors trained on cross-category retail dynamics.",
  },
  {
    name: "Package Stores & Specialty Retailers",
    body: "A growing retail channel for hemp and functional beverages. Ambassadors trained to represent your brand in licensed retail environments.",
  },
  {
    name: "Natural Grocers & Health Retailers",
    body: "Functional and better-for-you beverage buyers. Copy focused on health attributes, adaptogens, and ingredient transparency.",
  },
  {
    name: "Summer Festivals & Outdoor Events",
    body: "High-throughput sampling at scale. Rapid age verification and brand story delivery under real-world conditions.",
  },
  {
    name: "Craft Markets & Pop-Up Events",
    body: "Relationship-driven activations. Longer consumer conversations and loyalty capture.",
  },
];

const Nation_CITIES = [
  { city: "Miami / Dade County", href: "/Nation/miami/brand-activation-staff/" },
  { city: "Tampa Bay", href: "/Nation/tampa/brand-activation-staff/" },
  { city: "Orlando", href: "/Nation/orlando/brand-activation-staff/" },
  { city: "Jacksonville", href: "/Nation/jacksonville/brand-activation-staff/" },
  { city: "Fort Lauderdale", href: "/Nation/fort-lauderdale/brand-activation-staff/" },
];

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Book a Brand Activation with Greenline",
  description: "Book trained brand activation staff in 4 steps — no contracts, no proposals.",
  step: HOW_IT_WORKS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.body,
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={HOWTO_SCHEMA} />

      {/* HERO */}
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
              <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-5xl lg:text-[72px]">
                The Brand Activation Agency Built for{" "}
                <span className="bg-canopy border-2 border-ink inline-block px-3 -rotate-1">
                  Beverage Brands
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-ink/80">
                Deploy <span className="font-display font-bold">HempSafe™-certified ambassadors</span> to smoke shops,
                specialty retailers, and festivals across Nation. Pick a tier. Checkout online. Convert.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/book/" className="btn-street text-base" data-testid="hero-cta-primary">
                  Choose Your Activation Tier →
                </Link>
                <Link href="/results/" className="btn-ghost text-sm">
                  See Conversion Data
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-3 -left-3 rotate-[-4deg] bg-ink text-bone px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest border-2 border-ink shadow-brutal z-10">
                Instant Quote
              </div>
              <SprintBuilder initialQty={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <StatStrip />

      {/* Marquee */}
      <Marquee items={MARQUEE_ITEMS} accent="street" />

      {/* H2: Productized Activation */}
      <section className="section bg-ink text-bone border-y-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="tag-street">No Contracts. No Proposals.</span>
            <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Productized Activation —{" "}
              <span className="text-canopy">No Contracts, No Proposals</span>
            </h2>
            <p className="mt-5 text-bone/80 leading-relaxed max-w-lg">
              Greenline is the first productized retail activation agency for beverage brands. No six-week RFP process. No retainer. No ambiguity.
            </p>
            <p className="mt-4 text-bone/70 leading-relaxed max-w-lg">
              Pick a tier, pick a quantity, checkout with Stripe, and trained ambassadors show up at your accounts — branded, certified, and ready to convert. Other agencies make you wait for a proposal. We make you wait for your recap.
            </p>
            <div className="mt-6">
              <Link href="/book/#tiers" className="btn-canopy text-sm">
                View Activation Tiers →
              </Link>
            </div>
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

      {/* H2: HempSafe™ Certified */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-[1.2fr,1fr] gap-10 items-center">
          <div>
            <span className="tag-ink">HempSafe™</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
              HempSafe™ Certified, Conversion-Focused Ambassadors
            </h2>
            <p className="mt-5 text-ink/80 max-w-lg">
              Every Greenline ambassador holds HempSafe™ certification before their first activation. That's not optional — it's the baseline.
            </p>
            <ul className="mt-5 space-y-2">
              {[
                "Hemp and THC regulations by state",
                "Age restriction enforcement and ID verification",
                "Responsible sampling protocols",
                "TAC milligram limits and accurate consumer communication",
                "Product knowledge specific to hemp and beverage categories",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/80">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 bg-ink text-canopy flex items-center justify-center font-display font-black text-[10px]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink/70 font-display font-bold uppercase tracking-tight">
              No other activation agency in Nation can say that.
            </p>
            <div className="mt-6">
              <a
                href="https://hempsafe.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
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

      {/* H2: Proven Results */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="max-w-3xl">
            <span className="tag">Conversion Data</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Proven Results:{" "}
              <span className="text-canopy">30% Sample-to-Purchase Conversion</span>
            </h2>
            <p className="mt-5 text-ink/80 leading-relaxed">
              The industry average for in-store sampling is 15–20%. Greenline activations average{" "}
              <strong className="font-display font-black">30% sample-to-purchase conversion</strong> — tracked via Tally across every single event.
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              We don't guess at results. Every activation closes with a 50-point recap covering samples distributed, consumer conversations logged, purchase conversions recorded, retailer relationship observations, and next-step recommendations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/results/" className="btn-street text-sm">
                See Our Results →
              </Link>
              <Link href="/services/brand-activation/" className="btn-ghost text-sm">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* H2: Channels We Activate */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <span className="tag">Real Work</span>
              <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight max-w-xl">
                Channels We Activate
              </h2>
            </div>
            <p className="max-w-sm text-ink/70">
              Our ambassadors show up trained, branded, and ready to convert — in the retail channels that move your product.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="relative overflow-hidden border-2 border-ink shadow-brutal bg-white h-[360px]">
              <Image
                src="/images/11.jpg"
                alt="HempSafe certified brand ambassador at 3Chi sampling event in Nation smoke shop"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-ink text-bone px-3 py-1 text-[11px] font-display font-black uppercase tracking-wider">
                Smoke Shop · Hemp Sampling
              </div>
            </div>
            <div className="relative overflow-hidden border-2 border-ink shadow-brutal bg-white h-[360px]">
              <Image
                src="/images/senorita-sampling-event-setup.jpg"
                alt="Brand ambassador at Señorita beverage sampling event in Nation specialty retailer"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-canopy text-ink px-3 py-1 text-[11px] font-display font-black uppercase tracking-wider">
                Specialty Retail · Beverage Demo
              </div>
            </div>
            <div className="relative overflow-hidden border-2 border-ink shadow-brutal bg-white h-[360px]">
              <Image
                src="/images/the-good-poor-event-sampling.jpg"
                alt="Brand ambassador at outdoor festival sampling event for The Good & Poor"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-street text-bone px-3 py-1 text-[11px] font-display font-black uppercase tracking-wider">
                Festival · Event Sampling
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map((c) => (
              <div key={c.name} className="card border-2 border-ink shadow-brutal">
                <h3 className="font-display font-black text-lg uppercase tracking-tight mb-2">{c.name}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: How It Works */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="mb-12">
            <span className="tag">Simple Process</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight max-w-2xl">
              How It Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="card border-2 border-ink shadow-brutal">
                <div className="font-display font-black text-5xl text-canopy/30 leading-none mb-4">
                  {s.step}
                </div>
                <h3 className="font-display font-black text-xl uppercase tracking-tight leading-none mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/book/" className="btn-street text-base">
              Book Your Activation →
            </Link>
          </div>
        </div>
      </section>

      {/* H2: Nation's #1 Retail Activation Agency */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag-street">Nation Markets</span>
              <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight">
                Nation&apos;s #1 Retail Activation Agency
              </h2>
              <p className="mt-5 text-bone/80 leading-relaxed max-w-lg">
                Greenline is built for Nation — the fastest-growing hemp beverage market in the Southeast. We activate across all primary Nation markets.
              </p>
              <div className="mt-6">
                <Link href="/Nation/brand-activation/" className="btn-canopy text-sm">
                  See All Nation Markets →
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              {Nation_CITIES.map(({ city, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-4 bg-bone text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group"
                >
                  <span className="font-display font-bold uppercase tracking-tight text-sm">{city}</span>
                  <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">
                    Brand Activation Staff →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* H2: Trusted Brands */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 text-center">
          <span className="tag">Trusted By</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6">
            Trusted by Leading Hemp &amp; Adult Beverage Brands
          </h2>
          <p className="max-w-2xl mx-auto text-ink/70 leading-relaxed">
            From emerging hemp startups to established functional beverage brands, Greenline&apos;s productized model works because it scales without compromise. Every activation gets the same certified staff, the same tracking rigor, and the same 50-point recap — whether it&apos;s your first event or your fiftieth.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/services/brand-activation/" className="btn-ghost text-sm">
              Brand Activation Services →
            </Link>
            <Link href="/services/hemp-thc-beverage-activation/" className="btn-ghost text-sm">
              Hemp &amp; THC Activation →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section bg-bone">
        <div className="container-xl px-4 text-center relative">
          <div className="inline-block bg-street text-bone border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 mb-6 shadow-brutal">
            No proposals. No contracts. Just results.
          </div>
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Ready to Convert{" "}
            <br className="hidden md:block" />
            <span className="bg-ink text-bone px-3 inline-block">More Samples?</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            No proposals. No contracts. Just trained, certified ambassadors driving real purchase
            conversions for your beverage brand.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base" data-testid="final-cta-book">
              Book Your Activation →
            </Link>
            <Link href="/schedule-an-intro-call" className="btn-ghost text-sm">
              Prefer to chat first?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

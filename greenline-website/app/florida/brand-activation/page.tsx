import type { Metadata } from "next";
import Link from "next/link";
import { StatStrip } from "@/components/StatStrip";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Florida Brand Activation | Greenline Activations — Statewide Hemp & Beverage Coverage",
  description:
    "Greenline Activations deploys HempSafe-certified brand ambassadors across all major Florida markets — Miami, Tampa, Orlando, Jacksonville, Fort Lauderdale and beyond. 30% avg. sample-to-purchase conversion. No contracts.",
  openGraph: {
    title: "Florida Brand Activation | Greenline Activations",
    description:
      "Statewide Florida brand activation for hemp and functional beverage brands. HempSafe-certified. Tally-tracked. No contracts.",
    url: "https://www.greenlineactivations.com/florida/brand-activation/",
    siteName: "Greenline Activations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Florida Brand Activation | Greenline Activations",
    description: "Statewide brand activation for hemp and functional beverage brands across Florida.",
  },
  alternates: { canonical: "https://www.greenlineactivations.com/florida/brand-activation/" },
};

const FLORIDA_STATS = [
  { value: "30%", label: "Avg. Sample-to-Purchase Conversion" },
  { value: "5", label: "Major Florida Markets" },
  { value: "100%", label: "HempSafe™ Certified" },
  { value: "~7 days", label: "Brief → In-Store" },
];

const CITIES = [
  {
    slug: "miami",
    displayName: "Miami",
    region: "Miami / Dade County",
    headline: "Florida's Largest Consumer Market",
    body: "High tourist density, diverse demographics, and a concentrated smoke shop and specialty retail footprint. Miami is a priority activation market for hemp and functional beverage brands entering Florida.",
    channels: ["Smoke shops in Wynwood and Little Havana", "Specialty beverage retailers countywide", "Natural grocers", "Festivals and outdoor events"],
    href: "/florida/miami/brand-activation-staff/",
  },
  {
    slug: "tampa",
    displayName: "Tampa",
    region: "Tampa Bay",
    headline: "Florida's Fastest-Growing Hemp Market",
    body: "Ybor City, South Tampa, and St. Pete represent high-density activation corridors with strong smoke shop networks and specialty retailers rapidly expanding hemp and functional beverage sections.",
    channels: ["Smoke shops in Ybor City and South Tampa", "Specialty beverage retailers", "Natural grocers in South Tampa and St. Pete", "Gasparilla and Tampa Bay Beer Week"],
    href: "/florida/tampa/brand-activation-staff/",
  },
  {
    slug: "orlando",
    displayName: "Orlando",
    region: "Orlando / Central Florida",
    headline: "Tourism Economy + Millennial Demand",
    body: "Orlando's tourism economy and large millennial population create strong demand for hemp, functional, and better-for-you beverages. I-Drive, Mills 50, and Thornton Park are high-traffic activation zones.",
    channels: ["Smoke shops along International Drive and Mills Avenue", "Specialty beverage retailers", "Natural grocers and health food stores", "Convention and event activations"],
    href: "/florida/orlando/brand-activation-staff/",
  },
  {
    slug: "jacksonville",
    displayName: "Jacksonville",
    region: "Jacksonville / Northeast Florida",
    headline: "High Opportunity, Early Mover Advantage",
    body: "Florida's largest city by area and one of the most underserved markets for premium beverage activation. An expanding smoke shop network and growing specialty retailer base make it a high-opportunity market.",
    channels: ["Smoke shops in Riverside and San Marco", "Package stores and specialty retailers", "Natural grocers", "Jacksonville Jazz Festival and beach events"],
    href: "/florida/jacksonville/brand-activation-staff/",
  },
  {
    slug: "fort-lauderdale",
    displayName: "Fort Lauderdale",
    region: "Fort Lauderdale / Broward County",
    headline: "Broward's Premium Activation Corridor",
    body: "Fort Lauderdale's dense retail corridor along Federal Highway and the Las Olas district, combined with strong tourist demographics, make it a premium market. Broward County's smoke shop density is among the highest in Florida.",
    channels: ["Smoke shops along Federal Highway and Broward Boulevard", "Package stores and specialty retailers", "Natural grocers in Boca/Deerfield", "SunFest and Fort Lauderdale Boat Show"],
    href: "/florida/fort-lauderdale/brand-activation-staff/",
  },
];

const WHY_FLORIDA = [
  {
    stat: "#1",
    label: "Hemp Beverage Market in the Southeast",
    body: "Florida's legal hemp framework, high retail density, and large tourist population make it the highest-volume hemp beverage activation market in the Southeast region.",
  },
  {
    stat: "22M+",
    label: "State Population",
    body: "The third-largest state by population, with major consumer markets across both coasts and a year-round activation window — no seasonal slowdown.",
  },
  {
    stat: "5",
    label: "Primary Markets Covered",
    body: "Miami, Tampa, Orlando, Jacksonville, and Fort Lauderdale — five distinct consumer markets, each with unique retail channel dynamics and demographics, all covered by the Greenline network.",
  },
];

const FAQ = [
  {
    question: "Which Florida markets does Greenline cover?",
    answer:
      "Greenline operates in Miami / Dade County, Tampa Bay, Orlando / Central Florida, Jacksonville / Northeast Florida, and Fort Lauderdale / Broward County. Coverage also extends to nearby markets including St. Petersburg, Clearwater, Boca Raton, West Palm Beach, and surrounding areas. Contact us for activation availability in specific locations outside our primary markets.",
  },
  {
    question: "Can you activate in multiple Florida cities simultaneously?",
    answer:
      "Yes. Sprint 2 and Sprint 3 tiers are designed for multi-market deployments — running activations across two or more Florida cities in overlapping time windows. All activations use the same Tally tracking and 50-point recap system regardless of market.",
  },
  {
    question: "How does Greenline select ambassadors for each Florida market?",
    answer:
      "Greenline matches ambassadors to accounts based on market familiarity, retail channel experience, and product category knowledge. All ambassadors hold current HempSafe™ certification and have been through Greenline's brand briefing process before deployment.",
  },
  {
    question: "What is the primary retail channel for hemp beverages in Florida?",
    answer:
      "Smoke shops and specialty retailers are the highest-density channel for hemp and THC beverages in Florida — particularly in South Florida, Tampa, and Jacksonville. Natural grocers and health retailers are the primary channel for CBD and functional beverage positioning. Greenline activates in both channels with ambassadors trained specifically for each retail environment.",
  },
  {
    question: "Is Florida a good market for new hemp beverage brands?",
    answer:
      "Yes. Florida has one of the most developed legal hemp frameworks in the Southeast, a large and growing smoke shop network, and a consumer base familiar with hemp-derived products. Greenline's market launch pilot program is specifically designed for brands entering Florida for the first time — 30-day validated activation with conversion data and account-by-account recap.",
  },
  {
    question: "How do I know which Florida cities to activate in first?",
    answer:
      "For most hemp and functional beverage brands entering Florida, Tampa Bay and Miami are the highest-priority first markets — Tampa for smoke shop density and demographic alignment, Miami for scale and retail variety. Greenline's market launch pilot includes account selection guidance based on your SKU and target consumer profile.",
  },
];

const PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Florida Brand Activation | Greenline Activations",
  description:
    "Statewide Florida brand activation for hemp and functional beverage brands. HempSafe-certified ambassadors in Miami, Tampa, Orlando, Jacksonville, and Fort Lauderdale.",
  url: "https://www.greenlineactivations.com/florida/brand-activation/",
};

export default function FloridaBrandActivationPage() {
  return (
    <>
      <JsonLd data={PAGE_SCHEMA} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" aria-hidden>
          <div className="absolute inset-0"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #0A0A0A 0, #0A0A0A 1px, transparent 1px, transparent 12px)" }}
          />
        </div>
        <div className="container-xl px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <span className="tag-street">Florida Markets</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-6xl lg:text-[76px]">
              Florida Brand Activation —{" "}
              <span className="bg-canopy border-2 border-ink px-3 inline-block -rotate-1">
                The Southeast&apos;s #1
              </span>{" "}
              Hemp Market
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              Greenline deploys HempSafe™-certified brand ambassadors across all primary Florida markets — from Miami to Jacksonville, Tampa to Fort Lauderdale. 30% avg. conversion. Tally-tracked. No contracts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-street text-base">
                Book Florida Activation →
              </Link>
              <Link href="/results/" className="btn-ghost text-sm">
                See Florida Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip stats={FLORIDA_STATS} />

      {/* Why Florida */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">Why Florida</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Florida&apos;s #1 Retail Activation Agency
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_FLORIDA.map((item) => (
              <div key={item.label} className="bg-bone text-ink border-2 border-ink p-6 shadow-brutal">
                <div className="font-display font-black text-4xl text-canopy leading-none mb-2">{item.stat}</div>
                <div className="font-display font-bold uppercase tracking-tight text-sm border-b-2 border-ink pb-3 mb-3">{item.label}</div>
                <p className="text-sm text-ink/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City cards */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Markets</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Florida Activation Markets
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {CITIES.map((city) => (
              <div key={city.slug} className="border-2 border-ink shadow-brutal bg-bone flex flex-col">
                {/* City header */}
                <div className="bg-ink text-bone px-6 py-4 border-b-2 border-ink flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-black uppercase tracking-tight text-xl">{city.displayName}</h3>
                    <div className="text-[11px] uppercase tracking-widest text-canopy mt-0.5">{city.region}</div>
                  </div>
                  <Link href={city.href}
                    className="text-[11px] font-display font-bold uppercase tracking-widest text-bone/60 hover:text-canopy transition-colors">
                    View Market →
                  </Link>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="font-display font-bold uppercase tracking-tight text-sm text-canopy mb-2">{city.headline}</div>
                  <p className="text-sm text-ink/80 leading-relaxed mb-5">{city.body}</p>

                  {/* Channels */}
                  <div className="mt-auto">
                    <div className="text-[10px] uppercase tracking-widest text-ink/40 font-display font-bold mb-2">Primary Channels</div>
                    <ul className="space-y-1.5">
                      {city.channels.map((ch) => (
                        <li key={ch} className="flex items-start gap-2 text-xs text-ink/70">
                          <span className="w-3 h-3 mt-0.5 flex-shrink-0 bg-canopy border border-ink rounded-full" />
                          {ch}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={city.href}
                    className="mt-5 self-start font-display font-bold uppercase tracking-tight text-xs text-canopy hover:text-street transition-colors">
                    {city.displayName} Brand Activation Staff →
                  </Link>
                </div>
              </div>
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
              Every Florida Activation — HempSafe™ Certified
            </h2>
            <p className="mt-5 text-ink/80 leading-relaxed max-w-lg">
              Every ambassador deployed across Florida holds HempSafe™ certification. That means compliance on every activation — in every market, in every retail channel — without exception.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services/hempsafe-certified-brand-ambassadors/" className="btn-primary">
                About HempSafe™ Certification →
              </Link>
            </div>
          </div>
          <div className="bg-ink text-bone border-2 border-ink p-8 shadow-brutal-lg">
            <div className="grid grid-cols-2 gap-6 text-center">
              {[
                ["100%", "HempSafe™ Certified"],
                ["Zero", "Compliance Incidents"],
                ["30%", "Avg. Conversion"],
                ["2015", "Est."],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display font-black text-3xl text-canopy leading-none">{v}</div>
                  <div className="text-[11px] uppercase tracking-widest text-bone/60 mt-2">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services links */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Florida Activation Services</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-8 max-w-2xl">
            What We Activate Across Florida
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
            {[
              { label: "Brand Activation Staff", href: "/services/brand-activation/" },
              { label: "Hemp & THC Beverage Activation", href: "/services/hemp-thc-beverage-activation/" },
              { label: "Functional Beverage Activation", href: "/services/functional-beverage-activation/" },
              { label: "HempSafe™ Certified Ambassadors", href: "/services/hempsafe-certified-brand-ambassadors/" },
              { label: "Retail Activation", href: "/services/retail-activation/" },
              { label: "Results & Case Studies", href: "/results/" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between gap-4 border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group bg-bone">
                <span className="font-display font-bold uppercase tracking-tight text-sm">{item.label}</span>
                <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection items={FAQ} heading="Florida Brand Activation FAQs" />

      {/* CTA */}
      <section className="section bg-bone border-t-2 border-ink">
        <div className="container-xl px-4 text-center">
          <div className="inline-block bg-street text-bone border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 mb-6 shadow-brutal">
            Florida&apos;s hemp market is moving fast.
          </div>
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Activate
            <br className="hidden md:block" />{" "}
            <span className="bg-ink text-bone px-3 inline-block">in Florida</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            No proposals. No contracts. HempSafe™-certified ambassadors deployed to Florida retail accounts in about a week.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base">Book Florida Activation →</Link>
            <Link href="/schedule-an-intro-call" className="btn-ghost text-sm">Prefer to talk first?</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatStrip } from "@/components/StatStrip";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Hemp & THC Beverage Brand Activation | HempSafe-Certified Ambassadors | Greenline",
  description:
    "Greenline Activations is the only brand activation agency with HempSafe-certified staff for hemp and THC beverage brands. We deploy compliant, product-trained ambassadors to smoke shops, specialty retailers, and festivals in Florida. 30% avg. conversion. Book online.",
  openGraph: {
    title: "Hemp & THC Beverage Brand Activation | HempSafe-Certified Ambassadors | Greenline",
    description:
      "HempSafe-certified staff for hemp and THC beverage brands. Compliant demos. Real conversion data. No contracts.",
    url: "https://www.greenlineactivations.com/services/hemp-thc-beverage-activation/",
    siteName: "Greenline Activations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hemp & THC Beverage Brand Activation | Greenline Activations",
    description:
      "HempSafe-certified activation staff for hemp and THC beverage brands. 30% avg. conversion.",
  },
  alternates: {
    canonical: "https://www.greenlineactivations.com/services/hemp-thc-beverage-activation/",
  },
};

const BREADCRUMB = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services/brand-activation/" },
  { name: "Hemp & THC Beverage Activation", href: "/services/hemp-thc-beverage-activation/" },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hemp & THC Beverage Brand Activation",
  provider: { "@type": "Organization", name: "Greenline Activations" },
  areaServed: "Florida",
  description:
    "HempSafe-certified brand activation staff for hemp and THC beverage brands. Compliant demos at smoke shops, specialty retailers, and festivals in Florida.",
};

const HEMP_STATS = [
  { value: "30%", label: "Avg. Sample-to-Purchase Conversion" },
  { value: "100%", label: "HempSafe™ Certified" },
  { value: "50-pt", label: "Activation Recap" },
  { value: "Zero", label: "Compliance Incidents" },
];

const CHANNELS = [
  {
    title: "Smoke Shops & Head Shops",
    body: "The primary distribution channel for hemp and THC drinks in Florida. High purchase intent, category-familiar shoppers, and retail staff open to brand education. Greenline ambassadors are trained on cross-category retail dynamics and know how to position hemp beverages alongside flower, vapes, and edibles.",
  },
  {
    title: "Package Stores & Specialty Retailers",
    body: "A rapidly growing channel for hemp-derived beverages. Ambassadors trained to navigate licensed retail environments and speak to the sober-curious and functional beverage buyer segments.",
  },
  {
    title: "Natural Grocers & Health Retailers",
    body: "Functional and wellness-positioned hemp drinks land here. Shoppers want to know about adaptogens, CBD ratios, sugar content, and health benefits. Ambassadors trained on ingredient transparency, better-for-you positioning, and functional beverage category dynamics.",
  },
  {
    title: "Summer Festivals & Outdoor Events",
    body: "Florida's festival season is a primary sampling opportunity for hemp brands. High volume, broad audience, and age-verification at scale. Greenline's festival teams are trained for rapid throughput without sacrificing compliance.",
  },
  {
    title: "Craft Markets & Pop-Up Events",
    body: "Relationship-building activations with more time per consumer conversation. Brand story, ingredient education, and first-purchase conversion in lower-pressure retail environments.",
  },
];

const WHAT_STAFF_KNOWS = [
  {
    category: "Regulatory Knowledge",
    items: [
      "What makes a hemp-derived beverage federally legal under the 2018 Farm Bill",
      "Florida-specific hemp beverage regulations and current enforcement posture",
      "The legal distinction between hemp-derived Delta-9 THC and marijuana-derived Delta-9 THC",
      "Age restriction requirements by retail channel in Florida",
    ],
  },
  {
    category: "Product Knowledge",
    items: [
      "How to explain TAC (Total Active Cannabinoids) to a first-time buyer",
      "Terpene profiles and flavor architecture for beverage formats",
      "Onset timing differences between hemp beverages and other consumption formats",
      "How to compare your product accurately to competitive SKUs without making prohibited health claims",
    ],
  },
  {
    category: "Compliance Behavior",
    items: [
      "How to check ID correctly and document the verification",
      "When and how to decline a sample request",
      "What to say (and not say) about effects, benefits, and medical claims",
      "How to handle a retailer or law enforcement inquiry",
    ],
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
    question: "Is it legal to sample hemp beverages in Florida retail stores?",
    answer:
      "Yes, with proper protocols. Florida permits hemp-derived beverage sampling under state hemp regulations, subject to age verification, responsible serving guidelines, and retailer authorization. Greenline's HempSafe™-certified ambassadors are trained in all applicable Florida requirements.",
  },
  {
    question: "What is HempSafe certification and why does it matter?",
    answer:
      "HempSafe™ is a compliance certification program covering hemp regulations, THC content limits, age restriction enforcement, responsible sampling standards, and product knowledge for hemp-derived beverages. Every Greenline ambassador holds this certification before deployment — protecting your brand and ensuring compliant activations.",
  },
  {
    question: "Can your staff handle age verification for THC products?",
    answer:
      "Yes. Age verification is a core component of HempSafe™ certification training. Greenline ambassadors are trained in ID verification procedures, documentation practices, and refusal protocols for age-restricted hemp and THC products.",
  },
  {
    question: "How do you track ROI on hemp beverage activations?",
    answer:
      "Every hemp activation is Tally-tracked in real time. You receive a 50-point activation recap after each event covering samples poured, consumer conversations logged, purchase conversions recorded, retailer feedback, and compliance observations. Our average sample-to-purchase conversion rate for hemp beverage activations is 30%.",
  },
  {
    question: "What is the difference between hemp beverage activation and standard product sampling?",
    answer:
      "Standard sampling staff have no training in hemp compliance, THC regulations, or age verification for regulated products. Greenline's hemp-specialized ambassadors are HempSafe™ certified, understand TAC milligram limits and state-specific legality, and are trained to have accurate, compliant consumer conversations about hemp and THC products.",
  },
  {
    question: "Do you work with Delta-9 THC and Delta-8 brands?",
    answer:
      "Yes. Greenline Activations works with hemp-derived Delta-8, Delta-9, and broad-spectrum THC beverage brands. All ambassadors are trained on the regulatory distinctions between Delta-8 and Delta-9 THC, Florida-specific compliance requirements, and responsible consumer communication for each product type.",
  },
];

export default function HempTHCBeverageActivationPage() {
  return (
    <>
      <JsonLd data={SERVICE_SCHEMA} />
      <Breadcrumb items={BREADCRUMB} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="tag-street">Hemp & THC Beverage Activation</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-5xl lg:text-[64px]">
              Hemp & THC Beverage Brand Activation —{" "}
              <span className="text-canopy">Compliant, Trained, Converting</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              Greenline is the only activation agency with HempSafe™-certified staff for hemp and THC beverage brands. Compliant demos. Real conversion data. No contracts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-street text-base">
                Book Hemp Activation Staff →
              </Link>
              <Link href="/florida-retail-activation-checklist" className="btn-ghost text-sm">
                Download Compliance Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip stats={HEMP_STATS} />

      {/* H2: Why Hemp Needs Specialized Staff */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="max-w-3xl">
            <span className="tag-street">The Compliance Problem</span>
            <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6">
              Why Hemp Beverages Need Specialized Activation Staff
            </h2>
            <p className="text-bone/80 leading-relaxed mb-6">
              Hemp and THC beverages aren&apos;t beer. Generic event staff create liability.
            </p>
            <p className="text-bone/70 leading-relaxed mb-8">
              Standard sampling agencies send staff who have no idea what Delta-9 THC is, can&apos;t explain TAC milligram limits to a curious consumer, and have never been trained in age verification for regulated products. That&apos;s a compliance risk your brand can&apos;t afford.
            </p>
            <div className="space-y-3">
              {[
                "State-specific hemp regulations — what's legal to sample, where, and under what conditions",
                "Age restriction enforcement — ID verification protocols that protect the retailer and your brand",
                "Responsible sampling standards — portion sizes, frequency limits, and consumer guidance",
                "Product accuracy — the ability to answer consumer questions about ingredients, potency, and effects without crossing compliance lines",
                "Retailer context — how to operate in a smoke shop vs. a natural grocer vs. a specialty retailer environment",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4 bg-bone text-ink border-2 border-ink p-4 shadow-brutal">
                  <div className="w-6 h-6 mt-0.5 flex-shrink-0 bg-canopy border-2 border-ink flex items-center justify-center font-display font-black text-[10px]">
                    ✓
                  </div>
                  <span className="text-sm text-ink/80 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 font-display font-bold uppercase tracking-tight text-sm text-canopy">
              Greenline&apos;s ambassadors have all of this. No other Florida activation agency can say the same.
            </p>
          </div>
        </div>
      </section>

      {/* H2: HempSafe Certification */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-ink">HempSafe™</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6 max-w-2xl">
            HempSafe™ Certification: What It Means for Your Brand
          </h2>
          <p className="max-w-2xl text-ink/80 leading-relaxed mb-8">
            Every Greenline ambassador completes HempSafe™ certification before their first hemp activation. HempSafe™ training covers:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {[
              "Florida hemp market regulations and federal 2018 Farm Bill compliance",
              "Delta-8 vs. Delta-9 THC — legal distinctions, consumer communication, and state-specific rules",
              "TAC milligram limits and accurate product representation",
              "Age verification requirements and enforcement procedures",
              "Responsible sampling protocols — portions, pacing, and refusal guidelines",
              "Consumer FAQ handling — how to answer questions accurately and compliantly",
              "Retail account protocols — how to behave as a brand representative in a licensed retail environment",
            ].map((item) => (
              <div key={item} className="bg-ink text-bone border-2 border-ink p-4 shadow-brutal">
                <div className="w-5 h-5 mb-3 bg-canopy border-2 border-ink flex items-center justify-center font-display font-black text-[10px] text-ink">
                  ✓
                </div>
                <p className="text-sm text-bone/80 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-ink/70 leading-relaxed font-display font-bold uppercase tracking-tight">
            When your ambassador walks into a smoke shop carrying your brand, they are your brand. HempSafe™ certification ensures they represent it correctly.
          </p>
        </div>
      </section>

      {/* H2: Where We Activate */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Activation Channels</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Where We Activate Hemp & THC Beverage Brands
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {CHANNELS.map((c) => (
              <div key={c.title} className="card border-2 border-ink shadow-brutal">
                <h3 className="font-display font-black text-lg uppercase tracking-tight mb-3">{c.title}</h3>
                <p className="text-sm text-ink/80 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: What Staff Knows */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">Training Depth</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-4 max-w-2xl">
            What Our Hemp Activation Staff Knows
          </h2>
          <p className="max-w-2xl text-bone/70 leading-relaxed mb-10">
            Before a Greenline ambassador represents your hemp beverage brand, they can answer all of this:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {WHAT_STAFF_KNOWS.map((section) => (
              <div key={section.category} className="bg-bone text-ink border-2 border-ink p-6 shadow-brutal">
                <h3 className="font-display font-black uppercase tracking-tight text-base mb-4 pb-3 border-b-2 border-ink">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink/80 leading-relaxed">
                      <span className="w-3 h-3 mt-1 flex-shrink-0 bg-canopy rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 font-display font-bold uppercase tracking-tight text-sm text-canopy">
            This is not standard event staff training. This is HempSafe™.
          </p>
        </div>
      </section>

      {/* H2: Conversion Data */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag">Verified Numbers</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
              Conversion Data: 30% Sample-to-Purchase
            </h2>
            <p className="mt-5 text-ink/80 leading-relaxed">
              Greenline hemp beverage activations average{" "}
              <strong className="font-display font-black">30% sample-to-purchase conversion</strong> — tracked via Tally across every event.
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              The industry average for in-store sampling is 15–20%. The gap is explained by three things:
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Certified staff who can answer product questions accurately — reducing consumer hesitation",
                "Real-time Tally tracking — ambassadors who know their conversion rate mid-activation perform differently than those who don't",
                "50-point recap accountability — when every activation is documented, performance compounds over time",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 border-2 border-ink p-4 shadow-brutal">
                  <span className="w-7 h-7 flex-shrink-0 bg-canopy border-2 border-ink flex items-center justify-center font-display font-black text-sm">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink/80 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/results/" className="mt-6 inline-block btn-ghost text-sm">
              See Conversion Data →
            </Link>
          </div>
          <div className="bg-ink text-bone border-2 border-ink p-8 shadow-brutal-lg text-center">
            <div className="font-display font-black text-7xl text-canopy leading-none">30%</div>
            <div className="text-[13px] uppercase tracking-widest text-bone/60 mt-3">
              Hemp Beverage Avg. Conversion
            </div>
            <div className="mt-6 pt-6 border-t border-bone/20 text-xs text-bone/40 uppercase tracking-widest">
              Tally-tracked · every activation
            </div>
          </div>
        </div>
      </section>

      {/* H2: Tally Tracking */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4 max-w-3xl">
          <span className="tag-ink">Real-Time Data</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6">
            The Tally Tracking Difference
          </h2>
          <p className="text-ink/80 leading-relaxed mb-8">
            Every hemp activation is tracked with Tally from the first sample poured. What you get:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Live conversion counts during the event",
              "Time-stamped data showing peak performance windows",
              "Accurate sample distribution numbers (no inflation, no estimates)",
              "Consumer conversation notes logged in real time",
            ].map((item) => (
              <div key={item} className="bg-ink text-bone border-2 border-ink p-4 shadow-brutal flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-canopy border-2 border-ink flex items-center justify-center font-display font-black text-[10px] text-ink">
                  ✓
                </div>
                <span className="text-sm text-bone/80 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink/70 leading-relaxed">
            Your 50-point post-activation recap is built from Tally data. That&apos;s why hemp brands that run Greenline activations can go back to their buyers and investors with real conversion proof, not marketing estimates.
          </p>
        </div>
      </section>

      {/* H2: Florida Markets */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">Market Coverage</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-4 max-w-2xl">
            Florida Hemp Beverage Activation Markets
          </h2>
          <p className="max-w-2xl text-bone/70 leading-relaxed mb-8">
            Florida is one of the largest and fastest-growing hemp beverage markets in the country. Greenline operates across all primary Florida markets.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FLORIDA_CITIES.map(({ city, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between gap-4 bg-bone text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group"
              >
                <span className="font-display font-bold uppercase tracking-tight text-sm">{city} Hemp Activation</span>
                <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">→</span>
              </Link>
            ))}
            <Link
              href="/florida/brand-activation/"
              className="flex items-center justify-between gap-4 bg-canopy text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow"
            >
              <span className="font-display font-bold uppercase tracking-tight text-sm">See All Florida Markets</span>
              <span className="font-display font-black text-xs">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection items={FAQ} heading="Hemp Activation FAQs" />

      {/* H2: Book CTA */}
      <section className="section bg-bone border-t-2 border-ink">
        <div className="container-xl px-4 text-center">
          <div className="inline-block bg-street text-bone border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 mb-6 shadow-brutal">
            Your brand is HempSafe™. Your ambassadors should be too.
          </div>
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Book a Hemp Beverage Activation
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            Pick a tier, checkout online, and Greenline deploys certified staff to your hemp beverage accounts — no contracts, no proposals, real conversion data after every event.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base">
              Book Hemp Activation Staff →
            </Link>
            <Link href="/results/" className="btn-ghost text-sm">
              See Results
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

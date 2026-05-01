import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StatStrip } from "@/components/StatStrip";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Results & Case Studies | Greenline Activations",
  description:
    "Real conversion data from Greenline Activations brand partners. 30% avg. sample-to-purchase conversion, Tally-tracked across every event. See how hemp and functional beverage brands perform with HempSafe™-certified ambassadors.",
  openGraph: {
    title: "Results & Case Studies | Greenline Activations",
    description:
      "Real conversion data from hemp and functional beverage brand activations. 30% avg. sample-to-purchase conversion, Tally-tracked.",
    url: "https://www.greenlineactivations.com/results/",
    siteName: "Greenline Activations",
    type: "website",
  },
  alternates: { canonical: "https://www.greenlineactivations.com/results/" },
};

const OVERALL_STATS = [
  { value: "30%", label: "Avg. Sample-to-Purchase Conversion" },
  { value: "8+", label: "Active Brand Partners" },
  { value: "50-pt", label: "Post-Activation Recap" },
  { value: "Zero", label: "Compliance Incidents" },
];

interface CaseStudy {
  brand: string;
  logo: string;
  logoBg: string; // tailwind bg class for logo tile
  category: string;
  categoryColor: string;
  market: string;
  channel: string;
  conversion: string;
  activations: string;
  accounts: string;
  objective: string;
  result: string;
  highlights: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    brand: "BLNCD",
    logo: "/images/blncd.png",
    logoBg: "bg-bone",
    category: "CBD / Functional Beverage",
    categoryColor: "bg-canopy/20 text-canopy-dark",
    market: "Tampa Bay + Orlando",
    channel: "Natural Grocers & Specialty Retail",
    conversion: "34%",
    activations: "22 activations",
    accounts: "14 accounts",
    objective:
      "Introduce BLNCD's CBD-infused functional line to Florida's wellness retail channel and build repeat reorder velocity.",
    result:
      "34% sample-to-purchase conversion across 22 activations. 14 natural grocer accounts reported increased reorder frequency within 60 days.",
    highlights: [
      "34% sample-to-purchase conversion rate",
      "14 accounts with confirmed reorder uptick",
      "100% HempSafe™ certified ambassador team",
    ],
  },
  {
    brand: "Cali Sober",
    logo: "/images/cali-sober.png",
    logoBg: "bg-bone",
    category: "Hemp THC Beverage",
    categoryColor: "bg-street/20 text-street-dark",
    market: "Miami / Dade County",
    channel: "Smoke Shops & Specialty Retail",
    conversion: "31%",
    activations: "18 activations",
    accounts: "11 accounts",
    objective:
      "Drive trial and first-purchase conversion for Cali Sober's hemp THC drink line among sober-curious consumers in Miami's dense smoke shop corridor.",
    result:
      "31% conversion rate across Miami smoke shops and specialty retailers. Strong sober-curious consumer engagement with brand story resonating in the Wynwood and Little Havana corridors.",
    highlights: [
      "31% sample-to-purchase conversion",
      "Age verification compliance: 100% on every activation",
      "11 Miami accounts onboarded as repeat stockists",
    ],
  },
  {
    brand: "calmezzi",
    logo: "/images/calmezzi.png",
    logoBg: "bg-bone",
    category: "Functional Calm Beverage",
    categoryColor: "bg-[#e0f4fb] text-[#0a7fa8]",
    market: "Orlando / Central Florida",
    channel: "Natural Grocers & Smoke Shops",
    conversion: "32%",
    activations: "15 activations",
    accounts: "10 accounts",
    objective:
      "Market launch pilot for calmezzi entering Florida for the first time — validate SKU velocity and gather first-purchase conversion data before full field commitment.",
    result:
      "32% conversion across a 30-day pilot. 10 accounts onboarded with initial reorder signals in weeks 3–4. Full Florida rollout authorized by brand at pilot close.",
    highlights: [
      "32% conversion across 30-day market launch pilot",
      "Full Florida rollout greenlit at pilot completion",
      "10 new accounts with reorder signals in first month",
    ],
  },
  {
    brand: "Collective Project",
    logo: "/images/collective-project.png",
    logoBg: "bg-bone",
    category: "Hemp Beverage",
    categoryColor: "bg-ink/10 text-ink",
    market: "Jacksonville + Tampa Bay",
    channel: "Smoke Shops & Specialty Retail",
    conversion: "29%",
    activations: "26 activations",
    accounts: "17 accounts",
    objective:
      "Scale retail sampling presence across two Florida markets simultaneously, covering a multi-SKU product line with consistent brand messaging across all activations.",
    result:
      "29% conversion across 26 activations in two markets. Consistent brand message delivery verified across all 50-point recaps. 17 accounts now stocking multiple SKUs.",
    highlights: [
      "26 activations across two markets concurrently",
      "Multi-SKU activation — all three SKUs sampled per stop",
      "17 accounts confirmed multi-SKU shelf placement",
    ],
  },
  {
    brand: "DRIPPY",
    logo: "/images/drippy.png",
    logoBg: "bg-[#1a1a2e]",
    category: "Hemp THC Beverage",
    categoryColor: "bg-street/20 text-street-dark",
    market: "Miami + Fort Lauderdale",
    channel: "Smoke Shops & Festivals",
    conversion: "37%",
    activations: "20 activations",
    accounts: "12 accounts",
    objective:
      "Build brand awareness and drive trial for DRIPPY's THC hemp drink line in high-density South Florida smoke shop accounts and festival environments.",
    result:
      "37% conversion — highest single-brand rate across the Greenline portfolio. THC-curious demographic responded strongly to HempSafe™-certified staff who could answer Delta-9 questions accurately.",
    highlights: [
      "37% sample-to-purchase conversion — portfolio high",
      "Festival throughput: 400+ samples per event day",
      "Zero compliance incidents across all THC activations",
    ],
  },
  {
    brand: "Five Flowers",
    logo: "/images/ff_logo.webp",
    logoBg: "bg-ink",
    category: "Hemp / CBD Beverage",
    categoryColor: "bg-canopy/20 text-canopy-dark",
    market: "Tampa Bay + Orlando",
    channel: "Natural Grocers & Health Retailers",
    conversion: "28%",
    activations: "19 activations",
    accounts: "13 accounts",
    objective:
      "Educate wellness-focused consumers on Five Flowers' hemp CBD line and drive first-purchase trial in natural grocer and health retailer accounts.",
    result:
      "28% conversion in a category where consumer education is the primary purchase barrier. Ambassadors trained on ingredient transparency and hemp beverage benefits drove above-average dwell time per consumer conversation.",
    highlights: [
      "28% conversion in education-heavy wellness channel",
      "Avg. 4.2 min consumer conversation per sample — 2× category norm",
      "13 natural grocer accounts with confirmed velocity lift",
    ],
  },
  {
    brand: "Foundry Nation",
    logo: "/images/foundry-nation.png",
    logoBg: "bg-ink",
    category: "Functional Hemp Beverage",
    categoryColor: "bg-canopy/20 text-canopy-dark",
    market: "Statewide Florida",
    channel: "Smoke Shops & Specialty Retail",
    conversion: "30%",
    activations: "30 activations",
    accounts: "20 accounts",
    objective:
      "Establish Foundry Nation's functional hemp line across a broad Florida footprint, building account relationships and velocity data across 20 target accounts.",
    result:
      "30% conversion — exactly at portfolio average — across the largest single-brand activation run in Greenline history. 20 accounts covered with consistent 50-point recaps providing actionable data for each location.",
    highlights: [
      "30 activations — largest single-brand sprint to date",
      "20 accounts covered statewide",
      "Full 50-point recap delivered per activation, per account",
    ],
  },
  {
    brand: "Wave + Trail",
    logo: "/images/wave-trail.png",
    logoBg: "bg-bone",
    category: "Active Lifestyle Hemp",
    categoryColor: "bg-[#fde8ed] text-[#8b1a2e]",
    market: "Orlando + Jacksonville",
    channel: "Outdoor Events & Specialty Retail",
    conversion: "33%",
    activations: "17 activations",
    accounts: "11 accounts",
    objective:
      "Reach active lifestyle consumers for Wave + Trail's hemp functional line through outdoor event activations and specialty retail accounts catering to the outdoor and fitness demographic.",
    result:
      "33% conversion across outdoor events and specialty retail. The active lifestyle framing resonated — ambassadors reported that consumers were already familiar with functional ingredients and converted faster than average.",
    highlights: [
      "33% conversion across outdoor + retail activations",
      "Faster-than-average consumer decision cycle noted in recaps",
      "11 specialty accounts with strong initial reorder signals",
    ],
  },
];

const PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Results & Case Studies | Greenline Activations",
  description:
    "Real conversion data from Greenline Activations brand partners. 30% avg. sample-to-purchase conversion across hemp and functional beverage brands.",
  url: "https://www.greenlineactivations.com/results/",
};

export default function ResultsPage() {
  return (
    <>
      <JsonLd data={PAGE_SCHEMA} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #0A0A0A 0, #0A0A0A 1px, transparent 1px, transparent 12px)",
            }}
          />
        </div>
        <div className="container-xl px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <span className="tag-street">Conversion Data</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[44px] sm:text-6xl lg:text-[80px]">
              Real Numbers.
              <br />
              <span className="bg-canopy border-2 border-ink inline-block px-3 -rotate-1">
                Real Brands.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              Every activation is Tally-tracked. Every event closes with a 50-point recap. These are
              verified conversion results from Greenline brand partners — not estimates, not
              averages pulled from the industry. Ours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-street text-base">
                Book Your Activation →
              </Link>
              <Link href="/services/brand-activation/" className="btn-ghost text-sm">
                How We Track Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip stats={OVERALL_STATS} />

      {/* Portfolio avg callout */}
      <section className="bg-bone border-b-2 border-ink py-10">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            <div className="border-2 border-ink p-6 shadow-brutal bg-bone">
              <div className="font-display font-black text-5xl text-canopy leading-none">30%</div>
              <div className="font-display font-bold uppercase tracking-tight text-sm mt-2">
                Portfolio Average Conversion
              </div>
              <p className="text-xs text-ink/60 mt-2 leading-relaxed">
                Across all brands, all channels, all markets. Industry average is 15–20%.
              </p>
            </div>
            <div className="border-2 border-ink p-6 shadow-brutal bg-bone">
              <div className="font-display font-black text-5xl text-canopy leading-none">37%</div>
              <div className="font-display font-bold uppercase tracking-tight text-sm mt-2">
                Highest Single-Brand Rate
              </div>
              <p className="text-xs text-ink/60 mt-2 leading-relaxed">
                DRIPPY (THC hemp beverage), South Florida smoke shop + festival activations.
              </p>
            </div>
            <div className="border-2 border-ink p-6 shadow-brutal bg-bone">
              <div className="font-display font-black text-5xl text-canopy leading-none">167+</div>
              <div className="font-display font-bold uppercase tracking-tight text-sm mt-2">
                Total Activations Tracked
              </div>
              <p className="text-xs text-ink/60 mt-2 leading-relaxed">
                Every one Tally-tracked in real time. Every one closed with a 50-point recap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section bg-bone">
        <div className="container-xl px-4">
          <div className="mb-12">
            <span className="tag">Brand Partners</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight max-w-2xl">
              Case Studies
            </h2>
            <p className="mt-4 max-w-xl text-ink/70 leading-relaxed">
              Eight brands. Eight categories of result. Each case study is drawn from Tally tracking
              data and 50-point post-activation recaps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CASE_STUDIES.map((cs) => (
              <div
                key={cs.brand}
                className="border-2 border-ink shadow-brutal bg-bone flex flex-col"
              >
                {/* Logo bar */}
                <div
                  className={`${cs.logoBg} border-b-2 border-ink flex items-center justify-center p-6 h-28`}
                >
                  <Image
                    src={cs.logo}
                    alt={`${cs.brand} logo`}
                    width={180}
                    height={72}
                    className="object-contain max-h-16 w-auto"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-display font-black text-xl uppercase tracking-tight">
                        {cs.brand}
                      </h3>
                      <span
                        className={`inline-block text-[10px] font-display font-bold uppercase tracking-widest px-2 py-0.5 mt-1 ${cs.categoryColor}`}
                      >
                        {cs.category}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display font-black text-4xl text-canopy leading-none">
                        {cs.conversion}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/50 mt-1">
                        Conversion
                      </div>
                    </div>
                  </div>

                  {/* Market + channel */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[11px] font-display font-bold uppercase tracking-widest bg-ink text-bone px-2 py-0.5">
                      {cs.market}
                    </span>
                    <span className="text-[11px] font-display font-bold uppercase tracking-widest border border-ink/30 text-ink/60 px-2 py-0.5">
                      {cs.channel}
                    </span>
                  </div>

                  {/* Objective */}
                  <p className="text-sm text-ink/70 leading-relaxed mb-4">{cs.objective}</p>

                  {/* Result */}
                  <p className="text-sm text-ink font-medium leading-relaxed mb-5">{cs.result}</p>

                  {/* Metrics */}
                  <div className="mt-auto pt-4 border-t-2 border-ink/10 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-display font-black text-lg text-ink leading-none">
                        {cs.conversion}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/50 mt-1">
                        Conversion
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-black text-lg text-ink leading-none">
                        {cs.activations.split(" ")[0]}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/50 mt-1">
                        Activations
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-black text-lg text-ink leading-none">
                        {cs.accounts.split(" ")[0]}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/50 mt-1">
                        Accounts
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="mt-4 space-y-1.5">
                    {cs.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-ink/70 leading-relaxed">
                        <span className="w-3 h-3 mt-0.5 flex-shrink-0 bg-canopy border border-ink rounded-full" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology strip */}
      <section className="section bg-ink text-bone border-y-2 border-ink">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag-street">How We Measure</span>
              <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight">
                Why These Numbers Are Real
              </h2>
              <p className="mt-5 text-bone/80 leading-relaxed">
                Every conversion figure on this page comes from Tally tracking data — logged in
                real time during the activation window, not recalled after the fact.
              </p>
              <p className="mt-4 text-bone/70 leading-relaxed">
                After each activation, the brand receives a 50-point recap with samples distributed,
                purchase conversions recorded, consumer conversation notes, retailer feedback, and
                next-step recommendations. The numbers above are from those recaps.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Tally Tracked",
                  body: "Every sample counted in real time. No estimates. No rounding.",
                },
                {
                  label: "50-Point Recap",
                  body: "Five categories, ten data points each. Delivered within 48 hours.",
                },
                {
                  label: "HempSafe™ Certified",
                  body: "Compliance on every activation. Zero incidents across the portfolio.",
                },
                {
                  label: "Honest Averages",
                  body: "30% is our portfolio average — not our best case. Not cherry-picked.",
                },
              ].map((item) => (
                <div key={item.label} className="bg-bone text-ink border-2 border-ink p-4 shadow-brutal">
                  <div className="font-display font-black text-sm uppercase tracking-tight mb-2">
                    {item.label}
                  </div>
                  <p className="text-xs text-ink/70 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-bone">
        <div className="container-xl px-4 text-center">
          <div className="inline-block bg-street text-bone border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 mb-6 shadow-brutal">
            Your brand could be next.
          </div>
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Want results
            <br className="hidden md:block" />{" "}
            <span className="bg-ink text-bone px-3 inline-block">like these?</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            No proposals. No contracts. Pick a tier, checkout online, and Greenline deploys
            HempSafe™-certified ambassadors to your accounts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base">
              Book Your Activation →
            </Link>
            <Link href="/services/brand-activation/" className="btn-ghost text-sm">
              See How It Works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

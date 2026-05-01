import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatStrip } from "@/components/StatStrip";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Functional Beverage Activation Staff | Greenline Activations — Adaptogen & Wellness Specialists",
  description:
    "Hire ingredient-trained activation staff for functional beverage brands. Greenline Activations deploys ambassadors who understand adaptogens, CBD ratios, and better-for-you positioning. Florida retail and events. No contracts. Book online.",
  openGraph: {
    title: "Functional Beverage Activation Staff | Greenline Activations",
    description:
      "Ingredient-trained activation staff for functional beverage brands. Adaptogen, CBD, and better-for-you beverage specialists. Book online, no contracts.",
    url: "https://www.greenlineactivations.com/services/functional-beverage-activation/",
    siteName: "Greenline Activations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Functional Beverage Activation Staff | Greenline Activations",
    description: "Ingredient-trained activation staff for functional and better-for-you beverage brands.",
  },
  alternates: { canonical: "https://www.greenlineactivations.com/services/functional-beverage-activation/" },
};

const BREADCRUMB = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services/brand-activation/" },
  { name: "Functional Beverage Activation", href: "/services/functional-beverage-activation/" },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Functional Beverage Activation",
  provider: { "@type": "Organization", name: "Greenline Activations" },
  areaServed: "Florida",
  description:
    "Ingredient-trained brand activation staff for functional, adaptogen, CBD, and better-for-you beverage brands in Florida retail.",
};

const FUNC_STATS = [
  { value: "30%", label: "Avg. Sample-to-Purchase Conversion" },
  { value: "100%", label: "Ingredient-Trained Ambassadors" },
  { value: "50-pt", label: "Post-Activation Recap" },
  { value: "Real-Time", label: "Tally-Tracked" },
];

const CHANNELS = [
  {
    title: "Natural Grocers & Health Retailers",
    body: "The primary home for functional beverages. Shoppers here research their purchases — ambassadors who can speak to adaptogens, nootropics, and ingredient sourcing convert significantly faster than those who cannot.",
  },
  {
    title: "Specialty Beverage Retailers",
    body: "Package stores and specialty retailers increasingly stock functional and better-for-you options. A growing channel for brands that bridge wellness and lifestyle positioning.",
  },
  {
    title: "Smoke Shops & CBD Retailers",
    body: "For functional beverages with hemp or CBD components, the smoke shop channel offers a high-intent buyer who already understands functional ingredients. Ambassadors trained in both CBD and functional categories.",
  },
  {
    title: "Farmers Markets & Wellness Events",
    body: "Direct-to-consumer activations with longer dwell time per conversation. Ideal for brands that lead with ingredient story, origin narrative, or founder mission.",
  },
  {
    title: "Fitness Studios & Wellness Pop-Ups",
    body: "Active lifestyle consumers convert at above-average rates when the product is positioned correctly. Ambassadors trained to speak to performance, recovery, and functional benefit claims.",
  },
];

const WHAT_AMBASSADORS_KNOW = [
  "Adaptogen categories — ashwagandha, lion's mane, reishi, rhodiola — and how to explain function without making medical claims",
  "CBD and hemp-derived ingredient distinctions relevant to functional beverages",
  "Sugar content, calorie positioning, and better-for-you competitive framing",
  "How to explain bioavailability and onset differences between beverage formats",
  "Ingredient sourcing and transparency language that resonates with natural grocery shoppers",
  "How to handle ingredient questions without crossing prohibited health claim lines",
];

const FAQ = [
  {
    question: "What makes functional beverage activation different from standard sampling?",
    answer:
      "Functional beverage buyers ask more questions before purchasing. They want to know what adaptogens do, how ingredients interact, and what makes your product different from the ten others on the shelf. Standard sampling staff have no training in this. Greenline ambassadors are briefed on your specific ingredient stack and trained to have accurate, engaging conversations that convert curious browsers into first-time buyers.",
  },
  {
    question: "Do your ambassadors understand adaptogen categories?",
    answer:
      "Yes. Greenline ambassador training covers the primary adaptogen and functional ingredient categories — ashwagandha, lion's mane, reishi, rhodiola, L-theanine, and others — including how to explain their function in language that resonates with natural grocery consumers without crossing prohibited health claim boundaries.",
  },
  {
    question: "Can you activate at natural grocers like Whole Foods and Fresh Market?",
    answer:
      "Yes. Greenline has experience activating at natural grocer accounts including major chain locations across Florida. We work with your brand team and the retailer's demo program requirements to ensure full compliance with each account's activation policies.",
  },
  {
    question: "How do you measure ROI for functional beverage activations?",
    answer:
      "Every functional beverage activation is Tally-tracked in real time, and closed with a 50-point recap covering samples distributed, purchase conversions, consumer conversation notes (including top ingredient questions), retailer feedback, and next-step recommendations. Our average sample-to-purchase conversion across functional beverage brands is consistent with our portfolio average of 30%.",
  },
  {
    question: "Do you work with brands that include CBD in functional beverages?",
    answer:
      "Yes. For functional beverages that include hemp-derived CBD, Greenline ambassadors hold HempSafe™ certification in addition to functional ingredient training — covering hemp regulations, responsible sampling, and accurate consumer communication about CBD content.",
  },
  {
    question: "Can you run activations at events and not just retail?",
    answer:
      "Yes. Greenline deploys at farmers markets, wellness pop-ups, fitness events, and brand-hosted experiences in addition to retail accounts. Event activations use the same Tally tracking and 50-point recap system as retail — so you get verifiable conversion data regardless of channel.",
  },
];

export default function FunctionalBeverageActivationPage() {
  return (
    <>
      <JsonLd data={SERVICE_SCHEMA} />
      <Breadcrumb items={BREADCRUMB} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="tag-street">Functional Beverage Activation</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-5xl lg:text-[64px]">
              Functional Beverage Activation Staff —{" "}
              <span className="text-canopy">Ingredient-Informed, Conversion-Ready</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              Functional beverage buyers ask more questions. Greenline ambassadors know the answers — adaptogens, CBD ratios, ingredient sourcing, and better-for-you positioning. Real conversations. Verified conversions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-street text-base">
                Book Activation Staff →
              </Link>
              <Link href="/results/" className="btn-ghost text-sm">
                See Conversion Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip stats={FUNC_STATS} />

      {/* The knowledge gap */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="tag-street">The Education Problem</span>
              <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight">
                Why Generic Staff Fail Functional Brands
              </h2>
              <p className="mt-5 text-bone/80 leading-relaxed">
                A consumer at a natural grocer picks up your adaptogen drink and asks: "What does ashwagandha actually do?" A standard sampling rep says "it's good for stress." The consumer puts the drink back.
              </p>
              <p className="mt-4 text-bone/70 leading-relaxed">
                A Greenline ambassador explains cortisol regulation, compares onset timing between beverage and capsule formats, positions your product against two competitors accurately, and answers the follow-up question about sugar content. The consumer buys.
              </p>
              <p className="mt-4 text-bone/60 leading-relaxed">
                That's the difference between a 12% conversion and a 30% conversion — and it comes entirely from ambassador preparation.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { bad: "Can't explain adaptogens beyond 'it's for stress'", good: "Explains cortisol response, ingredient sourcing, and category differences" },
                { bad: "No training on hemp or CBD ingredient claims", good: "HempSafe™ certified — compliant CBD communication on every activation" },
                { bad: "Generic brand story delivery", good: "Briefed on your specific product, SKU differences, and competitive positioning" },
                { bad: "No data post-event", good: "50-point recap with consumer questions logged, objections captured, conversions recorded" },
              ].map((item) => (
                <div key={item.bad} className="grid grid-cols-2 gap-0 border-2 border-ink overflow-hidden">
                  <div className="bg-bone text-ink p-3 border-r-2 border-ink">
                    <div className="text-[10px] uppercase tracking-widest text-street font-display font-bold mb-1">Generic Staff</div>
                    <p className="text-xs text-ink/80 leading-relaxed">{item.bad}</p>
                  </div>
                  <div className="bg-canopy text-ink p-3">
                    <div className="text-[10px] uppercase tracking-widest font-display font-bold mb-1">Greenline</div>
                    <p className="text-xs text-ink/80 leading-relaxed">{item.good}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What ambassadors know */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Training Depth</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6 max-w-2xl">
            What Functional Beverage Ambassadors Know Before Deployment
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {WHAT_AMBASSADORS_KNOW.map((item) => (
              <div key={item} className="flex items-start gap-3 border-2 border-ink p-4 shadow-brutal bg-bone">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-canopy border-2 border-ink flex items-center justify-center font-display font-black text-[10px]">
                  ✓
                </div>
                <span className="text-sm text-ink/80 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-ink">Where We Activate</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10 max-w-2xl">
            Functional Beverage Activation Channels
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map((c) => (
              <div key={c.title} className="bg-ink text-bone border-2 border-ink p-6 shadow-brutal">
                <h3 className="font-display font-black uppercase tracking-tight text-base mb-3">{c.title}</h3>
                <p className="text-sm text-bone/70 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag">Verified Data</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
              30% Conversion — Tracked, Not Estimated
            </h2>
            <p className="mt-5 text-ink/80 leading-relaxed">
              Every functional beverage activation runs through Tally tracking — real-time sample counts, purchase conversions logged as they happen, and consumer conversation notes captured during the event.
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              Your 50-point recap includes the top ingredient questions consumers asked, the most common purchase objections, and what your ambassadors said that drove conversions. That data makes your next activation more effective than the last.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/results/" className="btn-ghost text-sm">
                See Brand Case Studies →
              </Link>
            </div>
          </div>
          <div className="bg-ink text-bone border-2 border-ink p-8 shadow-brutal-lg">
            <div className="space-y-6">
              {[
                { label: "Sample-to-Purchase Conversion", value: "30% avg." },
                { label: "Consumer Questions Logged", value: "50-pt recap" },
                { label: "Tracking Method", value: "Tally (real-time)" },
                { label: "Recap Delivery", value: "Within 48 hrs" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-bone/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-xs uppercase tracking-widest text-bone/50 font-display font-bold">{item.label}</span>
                  <span className="font-display font-black text-canopy text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Related Services</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-8">
            Also in Our Specialization
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
            {[
              { label: "Hemp & THC Beverage Activation", href: "/services/hemp-thc-beverage-activation/" },
              { label: "Brand Activation Staff", href: "/services/brand-activation/" },
              { label: "HempSafe™ Certified Ambassadors", href: "/services/hempsafe-certified-brand-ambassadors/" },
              { label: "Retail Activation", href: "/services/retail-activation/" },
              { label: "Florida Brand Activation", href: "/florida/brand-activation/" },
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

      <FaqSection items={FAQ} heading="Functional Beverage Activation FAQs" />

      {/* CTA */}
      <section className="section bg-bone border-t-2 border-ink">
        <div className="container-xl px-4 text-center">
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Book Your{" "}
            <span className="bg-canopy border-2 border-ink px-3 inline-block -rotate-1">
              Functional
            </span>{" "}
            Activation
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            Ingredient-informed ambassadors. 30% avg. conversion. 50-point recap after every event. No contracts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base">Book Activation Staff →</Link>
            <Link href="/results/" className="btn-ghost text-sm">See Conversion Data</Link>
          </div>
        </div>
      </section>
    </>
  );
}

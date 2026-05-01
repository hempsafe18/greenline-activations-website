import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatStrip } from "@/components/StatStrip";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "HempSafe™ Certified Brand Ambassadors | Greenline Activations — Compliant Hemp Staffing",
  description:
    "The only brand activation agency in Florida with 100% HempSafe™-certified ambassadors. Trained in hemp regulations, age verification, THC compliance, and responsible sampling. No contracts. Book online.",
  openGraph: {
    title: "HempSafe™ Certified Brand Ambassadors | Greenline Activations",
    description:
      "100% HempSafe™-certified activation staff for hemp and THC beverage brands. Compliant, trained, conversion-ready. Book online.",
    url: "https://www.greenlineactivations.com/services/hempsafe-certified-brand-ambassadors/",
    siteName: "Greenline Activations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HempSafe™ Certified Brand Ambassadors | Greenline Activations",
    description: "100% HempSafe™-certified activation staff. Compliant hemp and THC beverage ambassadors in Florida.",
  },
  alternates: { canonical: "https://www.greenlineactivations.com/services/hempsafe-certified-brand-ambassadors/" },
};

const BREADCRUMB = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services/brand-activation/" },
  { name: "HempSafe™ Certified Ambassadors", href: "/services/hempsafe-certified-brand-ambassadors/" },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "HempSafe™ Certified Brand Ambassadors",
  provider: { "@type": "Organization", name: "Greenline Activations" },
  areaServed: "Florida",
  description:
    "Brand activation staff with 100% HempSafe™ certification — trained in hemp regulations, age verification, THC compliance, and responsible sampling for hemp and beverage brands in Florida.",
};

const HEMPSAFE_STATS = [
  { value: "100%", label: "HempSafe™ Certified Ambassadors" },
  { value: "Zero", label: "Compliance Incidents" },
  { value: "2015", label: "Ambassador Program Established" },
  { value: "30%", label: "Avg. Sample-to-Purchase Conversion" },
];

const CERT_MODULES = [
  {
    num: "01",
    title: "Federal & State Hemp Law",
    body: "2018 Farm Bill compliance, Florida-specific hemp beverage regulations, what is and isn't legal to sample in which retail environments, and how enforcement posture has evolved.",
  },
  {
    num: "02",
    title: "Delta-8 vs. Delta-9 THC",
    body: "Legal distinctions between hemp-derived Delta-8 and Delta-9 THC, consumer communication guidelines, and state-specific rules governing each compound.",
  },
  {
    num: "03",
    title: "TAC Milligram Limits",
    body: "Total Active Cannabinoid limits by product type, how to communicate potency accurately without making prohibited claims, and how to compare products to competitive SKUs compliantly.",
  },
  {
    num: "04",
    title: "Age Verification Procedures",
    body: "ID verification requirements for hemp and THC products by retail channel in Florida — when to check, how to document, how to decline a sample, and what to say when enforcement is present.",
  },
  {
    num: "05",
    title: "Responsible Sampling Protocols",
    body: "Portion sizes, sampling frequency limits, consumer guidance on effects and onset timing, and refusal procedures for visibly impaired or underage individuals.",
  },
  {
    num: "06",
    title: "Retail Account Conduct",
    body: "How to represent your brand inside a licensed retail account — retailer staff engagement, competitive etiquette, shelf interaction guidelines, and escalation handling.",
  },
  {
    num: "07",
    title: "Consumer FAQ Handling",
    body: "How to answer the 20 most common hemp and THC beverage consumer questions accurately, compliantly, and in a way that advances purchase intent rather than raising compliance risk.",
  },
];

const COST_OF_NON_COMPLIANCE = [
  "A retailer pulling your brand from the shelf after an uncertified rep made an illegal health claim",
  "A compliance citation tied to your brand at a sampling event because an ambassador failed age verification",
  "An incorrect potency claim from an uninformed rep that reaches a regulator or journalist",
  "A retailer refusing to allow future activations after one bad rep interaction",
];

const FAQ = [
  {
    question: "What is HempSafe™ certification?",
    answer:
      "HempSafe™ is a compliance certification program developed specifically for the hemp industry. It covers federal and state hemp regulations, THC content limits and communication guidelines, age verification requirements, responsible sampling protocols, and product knowledge for hemp-derived beverages and other hemp products. More information is available at hempsafe.org.",
  },
  {
    question: "Is HempSafe™ certification required to sample hemp beverages in Florida?",
    answer:
      "There is no Florida law requiring HempSafe™ certification specifically — but the underlying training topics it covers (age verification, responsible sampling, accurate product representation) reflect legal and retailer compliance requirements. Greenline requires 100% HempSafe™ certification for all ambassadors before any hemp activation deployment.",
  },
  {
    question: "What happens if an uncertified rep makes a compliance error at my activation?",
    answer:
      "The risk falls on your brand. Retailers have pulled brands from the shelf after compliance incidents tied to sampling reps. Regulators have cited brands — not agencies — for improper health claims made by event staff. Greenline's HempSafe™ requirement exists because your brand's compliance exposure doesn't end at the agency — it extends to every conversation your ambassador has at every retail account.",
  },
  {
    question: "Do HempSafe™-certified ambassadors work with Delta-8 and Delta-9 THC brands?",
    answer:
      "Yes. HempSafe™ training covers both Delta-8 and Delta-9 THC — including the regulatory distinctions between them, Florida-specific compliance requirements, and consumer communication guidelines for each compound. Greenline ambassadors are trained to represent both product types accurately.",
  },
  {
    question: "How does HempSafe™ certification affect conversion rates?",
    answer:
      "Certified ambassadors convert at higher rates for two reasons: they can answer consumer questions about hemp and THC accurately (reducing hesitation) and they can have compliant, confident conversations that build purchase confidence. Greenline's portfolio average of 30% sample-to-purchase conversion is significantly above the industry average of 15–20%.",
  },
  {
    question: "Can I verify that the ambassadors sent to my accounts are certified?",
    answer:
      "Yes. Greenline can confirm HempSafe™ certification status for any ambassador deployed to your accounts. Certification is verified before first deployment and maintained as an ongoing requirement for continued placement on the Greenline roster.",
  },
];

export default function HempSafeCertifiedAmbassadorsPage() {
  return (
    <>
      <JsonLd data={SERVICE_SCHEMA} />
      <Breadcrumb items={BREADCRUMB} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-canopy border-b-2 border-ink">
        <div className="container-xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="tag-ink">HempSafe™</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-5xl lg:text-[64px]">
              HempSafe™ Certified Brand Ambassadors —{" "}
              <span className="bg-ink text-bone px-2 inline">Compliance Is the Baseline</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              Every Greenline ambassador is HempSafe™ certified before their first deployment. That's not a differentiator — it's a requirement. No other activation agency in Florida holds this standard across their entire roster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-primary">
                Book Certified Ambassadors →
              </Link>
              <a href="https://hempsafe.org" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                Learn About HempSafe™ ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <StatStrip stats={HEMPSAFE_STATS} />

      {/* Why it matters */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <span className="tag-street">The Risk</span>
              <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight">
                What Uncertified Staff Cost Hemp Brands
              </h2>
              <p className="mt-5 text-bone/80 leading-relaxed">
                Compliance risk in hemp activation isn't theoretical. One uncertified rep at one activation can cost your brand an account, a retail authorization, or a compliance citation.
              </p>
              <div className="mt-6 space-y-3">
                {COST_OF_NON_COMPLIANCE.map((item) => (
                  <div key={item} className="flex items-start gap-4 bg-bone text-ink border-2 border-ink p-4 shadow-brutal">
                    <div className="w-7 h-7 flex-shrink-0 mt-0.5 bg-street border-2 border-ink flex items-center justify-center font-display font-black text-bone text-xs">
                      ✕
                    </div>
                    <span className="text-sm text-ink/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="tag-canopy">The Standard</span>
              <h3 className="mt-4 font-display font-black uppercase text-2xl md:text-3xl leading-tight text-bone mb-6">
                Greenline's HempSafe™ Requirement
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Zero exceptions", body: "Every ambassador — regardless of experience level — holds current HempSafe™ certification before any hemp activation deployment." },
                  { label: "Verification on request", body: "Brands can confirm certification status for any ambassador assigned to their accounts. Certification is maintained as a condition of continued roster placement." },
                  { label: "Established since 2015", body: "Greenline's ambassador program and HempSafe™ certification requirement have been in place since the Florida hemp market's early formation — not adopted in response to incidents." },
                ].map((item) => (
                  <div key={item.label} className="border-l-4 border-canopy pl-4">
                    <div className="font-display font-black uppercase tracking-tight text-sm text-canopy">{item.label}</div>
                    <p className="mt-1 text-sm text-bone/70 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification modules */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">What's Covered</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-4 max-w-2xl">
            HempSafe™ Certification Modules
          </h2>
          <p className="max-w-2xl text-ink/70 leading-relaxed mb-10">
            HempSafe™ covers seven training modules. Every Greenline ambassador completes all seven before deployment on any hemp or THC beverage activation.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CERT_MODULES.map((mod) => (
              <div key={mod.num} className="border-2 border-ink p-6 shadow-brutal bg-bone">
                <div className="font-display font-black text-4xl text-canopy/30 leading-none mb-3">{mod.num}</div>
                <h3 className="font-display font-black uppercase tracking-tight text-base mb-3 border-b-2 border-ink pb-3">{mod.title}</h3>
                <p className="text-sm text-ink/80 leading-relaxed">{mod.body}</p>
              </div>
            ))}
            <div className="border-2 border-canopy bg-canopy p-6 shadow-brutal flex items-center justify-center">
              <div className="text-center">
                <div className="font-display font-black text-5xl text-ink leading-none">Zero</div>
                <div className="font-display font-bold uppercase tracking-tight text-sm text-ink mt-2">Compliance Incidents</div>
                <p className="text-xs text-ink/60 mt-2">Across the Greenline portfolio since 2015</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification vs conversion */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4 text-center max-w-3xl mx-auto">
          <span className="tag-canopy">The Performance Link</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6">
            Certification Drives Conversion
          </h2>
          <p className="text-bone/80 leading-relaxed mb-8">
            HempSafe™ certification isn't only about compliance protection — it's the reason Greenline's conversion rates are above industry average. Certified ambassadors can answer questions accurately and compliantly, which removes the hesitation that kills hemp beverage purchase decisions.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: "30%", label: "Greenline Portfolio Avg." },
              { value: "15–20%", label: "Industry Average" },
              { value: "+10pt", label: "Certified Uplift" },
            ].map((stat) => (
              <div key={stat.label} className="border-2 border-bone/20 p-5">
                <div className="font-display font-black text-4xl text-canopy leading-none">{stat.value}</div>
                <div className="text-[11px] uppercase tracking-widest text-bone/50 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
          <Link href="/results/" className="btn-canopy text-sm">
            See Brand-by-Brand Results →
          </Link>
        </div>
      </section>

      {/* Internal links */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Where We Deploy Certified Ambassadors</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Services Requiring HempSafe™ Certification
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
            {[
              { label: "Hemp & THC Beverage Activation", href: "/services/hemp-thc-beverage-activation/" },
              { label: "Brand Activation Staff", href: "/services/brand-activation/" },
              { label: "Functional Beverage Activation", href: "/services/functional-beverage-activation/" },
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

      <FaqSection items={FAQ} heading="HempSafe™ Certification FAQs" />

      {/* CTA */}
      <section className="section bg-canopy border-t-2 border-ink">
        <div className="container-xl px-4 text-center">
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Book Certified Ambassadors
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            100% HempSafe™ certified. Zero compliance incidents. 30% avg. sample-to-purchase conversion. No contracts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-primary">Book Your Activation →</Link>
            <a href="https://hempsafe.org" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
              Learn About HempSafe™ ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

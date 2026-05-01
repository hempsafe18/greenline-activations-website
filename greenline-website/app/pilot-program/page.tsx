import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pilot Program",
  description:
    "Test your beverage brand in real Florida retail environments. Structured 30–60 day pilots with data-driven execution and zero long-term commitment.",
};

const pilotIncludes = [
  {
    step: "01",
    title: "Market Selection",
    description:
      "We identify the highest-potential retail accounts in your target market and map an execution territory that makes sense for your brand's footprint and goals.",
  },
  {
    step: "02",
    title: "Ambassador Training",
    description:
      "Your assigned ambassadors go through brand onboarding — product knowledge, talking points, compliance (HempSafe™), and sampling best practices specific to your SKU.",
  },
  {
    step: "03",
    title: "In-Store Execution",
    description:
      "Demos, sampling events, shelf resets, and account check-ins executed on a structured weekly cadence. You get a recap after every activation.",
  },
  {
    step: "04",
    title: "Sell-Through Reporting",
    description:
      "We track activations, velocity metrics, and account feedback — giving you real data to decide whether to scale, adjust, or move into a full monthly program.",
  },
];

const pilotFor = [
  "Brands entering Florida for the first time",
  "SKUs launching in a new channel (smoke shops, grocery, convenience)",
  "Products that need sampling to convert",
  "Brands testing pricing or positioning in market",
  "Companies that want proof before a full field commitment",
];

export default function PilotProgramPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-4">Pilot Program</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Test Your Market with{" "}
              <span className="text-green">Real Data</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed mb-8 max-w-2xl">
              A structured 30–60 day field marketing pilot that validates your retail strategy
              before you commit to a full program. Real stores. Real sell-through. Real numbers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/schedule-an-intro-call" className="btn-primary">
                Schedule a Pilot Call
              </Link>
              <Link href="/retail-activation-roi-calculator" className="btn-secondary">
                Calculate Your ROI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section">
        <div className="container-lg">
          <div className="text-center mb-14">
            <span className="tag mb-4">How It Works</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              From Brief to <span className="text-green">In-Store in Weeks</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-lg mx-auto font-body">
              No lengthy onboarding. No agency red tape. We move fast.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pilotIncludes.map((item) => (
              <div key={item.step} className="card flex gap-6">
                <div className="text-4xl font-sans font-bold text-green-100 flex-shrink-0 leading-none">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-xl text-dark mb-2">{item.title}</h3>
                  <p className="font-body text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section bg-gray-50">
        <div className="container-lg">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag mb-4">Is This Right for You?</span>
              <h2 className="text-4xl font-bold text-dark mt-3 mb-6">
                The Pilot is Built for <span className="text-green">Brands That Validate</span>
              </h2>
              <p className="font-body text-gray-600 leading-relaxed">
                The Pilot Program is a fit if you need proof of concept before scaling field marketing spend.
                It&apos;s how smart brand teams derisk their Florida market entry.
              </p>
            </div>
            <ul className="space-y-3">
              {pilotFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-body text-dark">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-dark text-white text-center">
        <div className="container-lg max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Launch Your Pilot?</h2>
          <p className="text-gray-300 font-body mb-8 text-lg">
            15 minutes. We&apos;ll scope your pilot, discuss target accounts, and tell you exactly what to expect.
          </p>
          <Link href="/schedule-an-intro-call" className="btn-coral">
            Schedule a Pilot Call
          </Link>
        </div>
      </section>
    </>
  );
}

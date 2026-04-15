import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ambassador Rewards Program",
  description:
    "Earn more as a Greenline ambassador. Our performance-based rewards program recognizes top field reps with cash bonuses, gear, and exclusive perks.",
};

const tiers = [
  {
    name: "Crew",
    color: "border-gray-200",
    badge: "bg-gray-100 text-gray-600",
    activations: "1–10 activations",
    perks: [
      "Standard hourly rate",
      "Access to HempSafe™ certification",
      "Greenline crew gear",
      "Priority scheduling for local events",
    ],
  },
  {
    name: "Captain",
    color: "border-green",
    badge: "bg-green text-white",
    activations: "11–30 activations",
    featured: true,
    perks: [
      "Performance bonus per activation",
      "Captain badge on your profile",
      "Exclusive brand ambassador swag",
      "First access to premium activations",
      "Monthly performance recognition",
    ],
  },
  {
    name: "Elite",
    color: "border-coral",
    badge: "bg-coral text-white",
    activations: "31+ activations",
    perks: [
      "Top-tier hourly rate + bonuses",
      "Elite status recognition",
      "Referral bonus program",
      "Lead rep opportunities",
      "Quarterly bonus pool eligibility",
      "Direct line to field coordinator roles",
    ],
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Complete Activations",
    description: "Every confirmed activation you complete earns you progress toward the next tier and performance bonuses.",
  },
  {
    step: "02",
    title: "Track Your Progress",
    description: "Your activation count and tier status are tracked in your ambassador profile. Transparent, real-time.",
  },
  {
    step: "03",
    title: "Unlock Rewards",
    description: "Hit tier thresholds to unlock higher pay rates, bonuses, gear, and access to premium activations.",
  },
  {
    step: "04",
    title: "Grow Your Role",
    description: "Elite reps are first in line for lead roles, field coordinator positions, and expanded market opportunities.",
  },
];

export default function AmbassadorRewardsProgramPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-4">Rewards Program</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Get Rewarded for <span className="text-green">Your Impact</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed mb-8 max-w-2xl">
              The Greenline Rewards Program recognizes our best ambassadors with higher pay, exclusive perks,
              and real career growth. The more you activate, the more you earn.
            </p>
            <Link href="/brand-ambassador-application" className="btn-primary">
              Start Earning
            </Link>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section">
        <div className="container-lg">
          <div className="text-center mb-14">
            <span className="tag mb-4">Tier Structure</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              Three Tiers. <span className="text-green">Real Rewards.</span>
            </h2>
            <p className="text-gray-600 mt-4 font-body">
              Progress is automatic — just complete activations and the rewards follow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card border-2 ${tier.color} flex flex-col ${tier.featured ? "shadow-lg scale-105" : ""}`}
              >
                {tier.featured && (
                  <div className="text-center text-xs font-sans font-bold text-green uppercase tracking-wider mb-4">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <span className={`font-sans font-bold text-2xl text-dark`}>{tier.name}</span>
                  <span className={`text-xs font-sans font-semibold px-2 py-0.5 rounded-full ${tier.badge}`}>
                    {tier.activations}
                  </span>
                </div>
                <ul className="space-y-2 mt-4 flex-1">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm font-body text-gray-600">
                      <svg className="w-4 h-4 text-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-gray-50">
        <div className="container-lg">
          <div className="text-center mb-14">
            <span className="tag mb-4">How It Works</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              Simple, Transparent, <span className="text-green">Automatic</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-green flex items-center justify-center font-sans font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-sans font-bold text-dark mb-2">{item.title}</h3>
                <p className="font-body text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-dark text-white text-center">
        <div className="container-lg max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Climbing?</h2>
          <p className="text-gray-300 font-body mb-8 text-lg">
            Apply to join the Greenline Activation Crew. The sooner you start, the sooner you reach Elite.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/brand-ambassador-application" className="btn-coral">
              Apply Now
            </Link>
            <Link href="/brand-ambassador-opportunities" className="inline-block border-2 border-white text-white font-sans font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-dark transition-colors">
              Learn About Roles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

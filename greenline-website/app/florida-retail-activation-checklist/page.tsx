import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Retail Activation Checklist",
  description:
    "A step-by-step activation checklist for beverage brands running retail demos and sampling events in Florida. From pre-event setup to post-event reporting.",
};

const checklistSections = [
  {
    phase: "Pre-Activation (48–72 hrs out)",
    color: "bg-green-50 border-green",
    items: [
      "Confirm account contact and demo date/time",
      "Verify product inventory is at location (or arrange delivery)",
      "Confirm ambassador assignment and brief on brand talking points",
      "Review HempSafe™ compliance requirements for the account type",
      "Prepare sampling supplies (cups, napkins, branded materials, permits if required)",
      "Set up ambassador profile with activation details",
      "Review account planogram — confirm shelf placement expectations",
    ],
  },
  {
    phase: "Day-of Setup",
    color: "bg-blue-50 border-blue-300",
    items: [
      "Arrive 15–20 min early for setup",
      "Check in with store manager/buyer",
      "Set up sampling table with branded materials",
      "Confirm product is cold (if applicable) and inventory count is accurate",
      "Review day goals: units to sample, conversations to have, accounts to mention",
      "Verify ambassador ID for age-gated products",
      "Document pre-activation shelf photo",
    ],
  },
  {
    phase: "During Activation",
    color: "bg-coral/10 border-coral",
    items: [
      "Sample every customer who passes — no passive standing",
      "Log conversations and conversions in activation tracker",
      "Replenish product from back stock as needed",
      "Note competitive brand presence and pricing",
      "Address any account questions about reorder process",
      "Follow all state sampling regulations (no alcohol pairings for hemp)",
      "Maintain a clean, professional table and appearance",
    ],
  },
  {
    phase: "Post-Activation Wrap-Up",
    color: "bg-green-50 border-green",
    items: [
      "Count remaining inventory and record units sampled",
      "Document post-activation shelf photo",
      "Confirm reorder intent with store manager",
      "Submit activation recap (units, conversations, feedback, photos)",
      "Flag any compliance issues or account concerns",
      "Return any unused sampling supplies",
      "Log debrief notes for next activation at this account",
    ],
  },
];

export default function FloridaRetailActivationChecklistPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-4">Free Resource</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Florida Retail Activation{" "}
              <span className="text-green">Checklist</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed mb-8 max-w-2xl">
              A step-by-step execution guide for beverage brand activations in Florida retail accounts.
              Built from real field experience. Used by Greenline ambassadors every week.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/schedule-an-intro-call" className="btn-primary">
                Get a Managed Program
              </Link>
              <Link href="/retail-activation-roi-calculator" className="btn-secondary">
                Calculate Your ROI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="section">
        <div className="container-lg">
          <div className="text-center mb-14">
            <span className="tag mb-4">Step-by-Step</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              Every Phase, <span className="text-green">Every Detail</span>
            </h2>
            <p className="text-gray-600 mt-4 font-body max-w-lg mx-auto">
              Miss one step and the activation suffers. Use this checklist to run clean, professional, high-converting demos.
            </p>
          </div>

          <div className="space-y-8">
            {checklistSections.map((section) => (
              <div key={section.phase} className={`rounded-2xl border-l-4 ${section.color} p-8`}>
                <h3 className="font-sans font-bold text-xl text-dark mb-5">{section.phase}</h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                      <span className="font-body text-dark text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro tips */}
      <section className="section bg-gray-50">
        <div className="container-lg">
          <div className="text-center mb-10">
            <span className="tag mb-4">Pro Tips</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              What Separates <span className="text-green">Good from Great</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tip: "Never sit behind the table.",
                detail: "Standing activates more conversations. Ambassadors who sit convert at half the rate of those who stand and engage.",
              },
              {
                tip: "Lead with a question, not a sample.",
                detail: "\"Have you tried [brand] before?\" opens a conversation. Just holding out a cup starts a transaction.",
              },
              {
                tip: "Talk to the buyer, not just customers.",
                detail: "Every activation is also a sales call. Use the time to build the account relationship and plant the reorder seed.",
              },
            ].map((t) => (
              <div key={t.tip} className="card">
                <div className="text-green font-sans font-bold text-lg mb-2">{t.tip}</div>
                <p className="font-body text-gray-600 text-sm leading-relaxed">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-dark text-white text-center">
        <div className="container-lg max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Want Us to Run Your Activations?</h2>
          <p className="text-gray-300 font-body mb-8 text-lg">
            We handle every line item on this checklist — recruitment, training, execution, and reporting.
            You just review the recap.
          </p>
          <Link href="/schedule-an-intro-call" className="btn-coral">
            Talk to the Team
          </Link>
        </div>
      </section>
    </>
  );
}

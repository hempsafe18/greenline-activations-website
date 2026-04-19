"use client";

import Script from "next/script";
import Link from "next/link";
import Image from "next/image";

const phases = [
  {
    phase: "Pre-Activation (48–72 hrs out)",
    count: 7,
    color: "border-green",
    preview: "Inventory confirmation, ambassador briefing, HempSafe™ compliance review, and more.",
  },
  {
    phase: "Day-of Setup",
    count: 7,
    color: "border-blue-300",
    preview: "Store manager check-in, table setup, product readiness, and pre-activation documentation.",
  },
  {
    phase: "During Activation",
    count: 7,
    color: "border-coral",
    preview: "Conversion tracking, compliance protocols, competitive notes, and account relationship steps.",
  },
  {
    phase: "Post-Activation Wrap-Up",
    count: 7,
    color: "border-green",
    preview: "Inventory reconciliation, reorder confirmation, recap submission, and debrief notes.",
  },
];

export default function FloridaRetailActivationChecklistPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag mb-4">Free Download</span>
              <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
                The Florida Retail Activation{" "}
                <span className="text-green">Checklist</span>
              </h1>
              <p className="text-xl font-body text-gray-600 leading-relaxed">
                28 field-tested steps across every phase of a retail demo — from pre-event setup to
                post-activation reporting. Built from real activations. Used by Greenline ambassadors every week.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/greenline-checklist-mockup.png"
                alt="Florida Retail Activation Checklist preview"
                width={480}
                height={620}
                className="w-full max-w-sm drop-shadow-xl rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main: teaser + form */}
      <section className="section">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: what's inside */}
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">What&apos;s Inside</h2>
              <div className="space-y-4 mb-10">
                {phases.map((p) => (
                  <div key={p.phase} className={`rounded-xl border-l-4 ${p.color} bg-white shadow-sm border border-gray-100 p-5`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-sans font-bold text-dark text-sm">{p.phase}</h3>
                      <span className="text-xs font-body text-gray-400">{p.count} steps</span>
                    </div>
                    <p className="font-body text-gray-500 text-sm leading-relaxed">{p.preview}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  "Built from 100+ Florida retail activations",
                  "Covers compliance for hemp & functional beverages",
                  "Used by Greenline ambassadors in the field every week",
                  "Printable + shareable PDF format",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-body text-dark text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: HubSpot form */}
            <div className="card p-0 overflow-hidden">
              <div className="bg-green p-6 text-white text-center">
                <h3 className="font-sans font-bold text-xl">Get the Free Checklist</h3>
                <p className="font-body text-green-100 text-sm mt-1">Delivered instantly to your inbox</p>
              </div>
              <div className="p-6">
                <div id="hubspot-checklist-form" />
                <Script
                  src="//js.hsforms.net/forms/embed/v2.js"
                  strategy="afterInteractive"
                  onLoad={() => {
                    // @ts-expect-error hbspt is loaded by the HubSpot script
                    if (window.hbspt) {
                      // @ts-expect-error hbspt is loaded by the HubSpot script
                      window.hbspt.forms.create({
                        region: "na1",
                        portalId: "47886643",
                        formId: "d4067321-44af-4a1f-9436-ddba2ae96392",
                        target: "#hubspot-checklist-form",
                      });
                    }
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="section bg-gray-50">
        <div className="container-lg text-center max-w-2xl">
          <p className="font-body text-gray-500 text-sm leading-relaxed">
            This checklist is used by every Greenline ambassador before, during, and after each activation.
            If you&apos;d rather have a trained team handle all 28 steps for you —
          </p>
          <Link href="/schedule-an-intro-call" className="btn-primary mt-6 inline-block">
            Talk to the Team
          </Link>
        </div>
      </section>
    </>
  );
}

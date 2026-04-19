"use client";

import Script from "next/script";

export default function BrandAmbassadorApplicationPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="max-w-2xl">
            <span className="tag mb-4">Apply Now</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Join the <span className="text-green">Activation Crew</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed">
              Fill out the form below. Qualified applicants are contacted for a brief intro call —
              we move fast when there&apos;s a fit.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container-lg max-w-2xl">
          <div className="card">
            <div id="hubspot-ambassador-form" />
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
                    formId: "c1a7fbea-19f8-4489-81bf-9cea6efc2b07",
                    target: "#hubspot-ambassador-form",
                  });
                }
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

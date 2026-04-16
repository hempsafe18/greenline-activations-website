import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Schedule an Intro Call",
  description:
    "15–20 minutes. No pitch. Just an honest conversation about your brand's field marketing needs in Florida.",
};

const whatToExpect = [
  {
    icon: "🕐",
    title: "15–20 Minutes",
    description: "Informal, no-pressure. We're learning about your brand, not selling you a package.",
  },
  {
    icon: "🗺️",
    title: "Your Retail Footprint",
    description: "We'll talk through your current accounts, target market, and where you want to go.",
  },
  {
    icon: "📦",
    title: "Inventory & Velocity",
    description: "Where are you today? What does a win look like in 60–90 days?",
  },
  {
    icon: "🎯",
    title: "Fastest Path Forward",
    description: "We'll tell you honestly if a pilot, a monthly program, or a different approach makes the most sense.",
  },
];

const services = [
  "One-off Activations",
  "Market Launch Pilots",
  "Monthly Field Programs",
  "Merchandising Blitzes",
  "Event & Festival Support",
  "Expert Brand Ambassadors",
];

export default function ScheduleIntroCallPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-4">Let&apos;s Talk</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Schedule a Free <span className="text-green">Intro Call</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed max-w-2xl">
              15–20 minutes. No pitch. Just an honest conversation about your brand&apos;s retail position and
              whether field marketing is the right lever right now.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Info */}
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">What to expect</h2>

              <div className="space-y-6 mb-10">
                {whatToExpect.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-sans font-bold text-dark mb-1">{item.title}</h3>
                      <p className="font-body text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card bg-green-50 border border-green-100">
                <h3 className="font-sans font-bold text-dark mb-3">Services we&apos;ll cover</h3>
                <ul className="grid grid-cols-2 gap-y-2">
                  {services.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm font-body text-dark">
                      <div className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: HubSpot meetings embed */}
            <div className="card p-0 overflow-hidden">
              <div className="bg-green p-6 text-white text-center">
                <h3 className="font-sans font-bold text-xl">Book Your 15-Minute Call</h3>
                <p className="font-body text-green-100 text-sm mt-1">Pick a time that works for you</p>
              </div>
              <div
                className="meetings-iframe-container"
                data-src="https://greenlineactivations.com/meetings/greenline-activations/intro-call-calendar?embed=true"
              />
              <Script
                src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
                strategy="afterInteractive"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <section className="section bg-gray-50">
        <div className="container-lg text-center max-w-2xl">
          <p className="text-2xl font-sans font-bold text-dark mb-4">
            &ldquo;Most brands win distribution — but lose at execution.&rdquo;
          </p>
          <p className="font-body text-gray-600 leading-relaxed">
            This call is about finding the fastest path to meaningful sell-through.
            If we&apos;re not the right fit, we&apos;ll say so and point you in the right direction.
          </p>
        </div>
      </section>
    </>
  );
}

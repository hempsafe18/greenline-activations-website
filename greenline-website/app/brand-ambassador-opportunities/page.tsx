import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Brand Ambassador Opportunities",
  description:
    "Join Greenline Activations and support brand activations across Florida. Performance-driven brand ambassador roles with competitive pay and rewards.",
};

const perks = [
  {
    icon: "💰",
    title: "Competitive Pay",
    description: "Hourly base + performance bonuses for every activation. Top reps earn more.",
  },
  {
    icon: "🕐",
    title: "Flexible Schedule",
    description: "Pick up shifts that work around your life. Events, demos, and retail activations on your terms.",
  },
  {
    icon: "🎓",
    title: "Paid Training",
    description: "Full brand onboarding and HempSafe™ certification — we invest in your success before you hit the floor.",
  },
  {
    icon: "🏆",
    title: "Rewards Program",
    description: "Earn points for every activation. Redeem for cash bonuses, gear, and exclusive perks.",
  },
  {
    icon: "📈",
    title: "Growth Path",
    description: "Top ambassadors get access to lead rep and field coordinator roles as we expand.",
  },
  {
    icon: "🌴",
    title: "Florida-Based",
    description: "Work in your area — no travel required. We match you to accounts near you.",
  },
];

const requirements = [
  "21+ years old",
  "Located in Florida (or willing to work in Florida)",
  "Reliable transportation",
  "Customer-facing or sales experience a plus",
  "Passion for wellness, beverage, or lifestyle brands",
  "Available at least 8–10 hours per week",
];

const roles = [
  {
    title: "Sampling Ambassador",
    description: "Execute in-store demos and sampling events at retail accounts. You're the face of the brand at the shelf.",
    type: "Part-time / Flexible",
  },
  {
    title: "Event Specialist",
    description: "Staff festivals, pop-ups, and brand activations. High energy, high visibility, high reward.",
    type: "Event-Based",
  },
  {
    title: "Retail Field Rep",
    description: "Conduct account visits, shelf audits, and merchandising checks. Ideal for organized, detail-oriented reps.",
    type: "Part-time / Flexible",
  },
];

export default function BrandAmbassadorOpportunitiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-4">Join the Crew</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Get Paid to Rep{" "}
              <span className="text-green">Brands You Believe In</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed mb-8 max-w-2xl">
              Greenline Activations recruits and deploys Florida&apos;s top brand ambassadors
              for hemp, functional beverage, and lifestyle brands. Flexible shifts, competitive pay,
              real opportunities to grow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/brand-ambassador-application" className="btn-primary">
                Apply Now
              </Link>
              <Link href="/ambassador-rewards-program" className="btn-secondary">
                View Rewards Program
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ambassador photos */}
      <section className="py-4">
        <div className="container-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/6.png"
                alt="Brand ambassador in-store activation"
                width={400}
                height={500}
                className="w-full h-auto"
              />
            </div>
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/12.jpeg"
                alt="Ambassador sampling product with customer"
                width={400}
                height={500}
                className="w-full h-auto"
              />
            </div>
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/14.jpg"
                alt="Ambassador connecting with store customer"
                width={400}
                height={500}
                className="w-full h-auto"
              />
            </div>
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/11.jpg"
                alt="Brand ambassador holding 3CHI cannabis seltzer"
                width={400}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="section">
        <div className="container-lg">
          <div className="text-center mb-14">
            <span className="tag mb-4">Open Roles</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              Find the Right <span className="text-green">Fit for You</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.title} className="card flex flex-col">
                <div className="inline-block text-xs font-sans font-semibold text-coral bg-coral/10 px-3 py-1 rounded-full uppercase tracking-wide mb-4 self-start">
                  {role.type}
                </div>
                <h3 className="font-sans font-bold text-xl text-dark mb-2">{role.title}</h3>
                <p className="font-body text-gray-600 text-sm leading-relaxed flex-1">{role.description}</p>
                <Link
                  href="/brand-ambassador-application"
                  className="inline-flex items-center gap-1 text-green font-sans font-semibold text-sm mt-6 hover:gap-2 transition-all"
                >
                  Apply for this role
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Greenline */}
      <section className="section bg-gray-50">
        <div className="container-lg">
          <div className="text-center mb-14">
            <span className="tag mb-4">Why Greenline</span>
            <h2 className="text-4xl font-bold text-dark mt-3">
              More Than a <span className="text-green">Gig</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk) => (
              <div key={perk.title} className="card">
                <div className="text-3xl mb-3">{perk.icon}</div>
                <h3 className="font-sans font-bold text-lg text-dark mb-2">{perk.title}</h3>
                <p className="font-body text-gray-600 text-sm leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section">
        <div className="container-lg">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag mb-4">Requirements</span>
              <h2 className="text-4xl font-bold text-dark mt-3 mb-6">
                What We&apos;re <span className="text-green">Looking For</span>
              </h2>
              <p className="font-body text-gray-600 leading-relaxed mb-8">
                We care less about your resume and more about your energy, reliability, and ability to connect with people.
                If you love talking to people about products you believe in, you&apos;ll thrive here.
              </p>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/8.png"
                  alt="Greenline brand ambassador at activation"
                  width={560}
                  height={650}
                  className="object-cover w-full h-auto"
                />
              </div>
            </div>
            <ul className="space-y-3">
              {requirements.map((req) => (
                <li key={req} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-body text-dark">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-green text-white text-center">
        <div className="container-lg max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Join the Activation Crew?</h2>
          <p className="text-green-100 font-body mb-8 text-lg">
            Qualified applicants are contacted for a brief intro call. If there&apos;s a fit for upcoming activations in your area, we&apos;ll reach out fast.
          </p>
          <Link href="/brand-ambassador-application" className="inline-block bg-white text-green font-sans font-semibold px-8 py-3 rounded-lg hover:bg-cream transition-colors">
            Submit Your Application
          </Link>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Buy",
    items: [
      { label: "Sprints Pricing", href: "/sprints" },
      { label: "Test Sprint", href: "/sprints#test_sprint" },
      { label: "ROI Calculator", href: "/retail-activation-roi-calculator" },
      { label: "Pilot Program", href: "/pilot-program" },
    ],
  },
  {
    heading: "Team",
    items: [
      { label: "Ambassador Jobs", href: "/brand-ambassador-opportunities" },
      { label: "Rewards Program", href: "/ambassador-rewards-program" },
      { label: "Apply to Ambassadors", href: "/brand-ambassador-application" },
      { label: "HempSafe™ Certified", href: "https://hempsafe.org" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "Onboarding Call", href: "/schedule-an-intro-call" },
      { label: "Florida Checklist", href: "/florida-retail-activation-checklist" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-bone border-t-2 border-ink relative overflow-hidden">
      {/* Massive wordmark */}
      <div className="container-xl px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="tag-street mb-5">Retail Activation · Nationwide</div>
            <h3 className="font-display font-black text-4xl md:text-5xl uppercase leading-[0.95] text-bone">
              Productized field marketing.
              <span className="text-canopy"> Add to cart.</span>
            </h3>
            <p className="mt-6 max-w-md text-bone/70 leading-relaxed">
              Greenline Activations is the first "buy it like a SKU" retail activation agency for
              hemp and functional beverage brands. No proposals. No procurement. Just shelf work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sprints" className="btn-canopy text-sm">
                Shop Sprints →
              </Link>
              <Link href="/schedule-an-intro-call" className="btn-ghost text-sm text-bone border-bone hover:bg-bone hover:text-ink">
                Onboarding Call
              </Link>
            </div>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading} className="md:col-span-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-[0.24em] text-canopy mb-4">
                {group.heading}
              </h4>
              <ul className="space-y-2.5 text-sm text-bone/80">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-canopy transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Wordmark block */}
      <div className="border-t-2 border-bone/10 relative">
        <div className="container-xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-bone/50">
          <p>© {new Date().getFullYear()} Greenline Activations. Built in Florida. Shipped to shelves nationwide.</p>
          <p className="font-mono uppercase tracking-widest">NATIONAL · HEMPSAFE™ · NO CONTRACTS</p>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="select-none pointer-events-none px-4 pb-6 overflow-hidden">
        <div className="font-display font-black uppercase text-canopy/10 tracking-tighter leading-none text-[18vw]">
          GREENLINE
        </div>
      </div>
    </footer>
  );
}

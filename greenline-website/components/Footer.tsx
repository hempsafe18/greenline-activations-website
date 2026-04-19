import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-sans font-bold text-xl mb-3">
              <span className="text-green">Greenline</span> Activations
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Florida&apos;s field marketing partner for hemp and functional beverage brands.
              No long-term contracts. No hiring headaches. Just results.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/pilot-program" className="hover:text-green transition-colors">Pilot Program</Link></li>
              <li><Link href="/retail-activation-roi-calculator" className="hover:text-green transition-colors">ROI Calculator</Link></li>
              <li><Link href="/schedule-an-intro-call" className="hover:text-green transition-colors">Schedule a Call</Link></li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Team</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/brand-ambassador-opportunities" className="hover:text-green transition-colors">Ambassador Opportunities</Link></li>
              <li><Link href="/ambassador-rewards-program" className="hover:text-green transition-colors">Rewards Program</Link></li>
              <li><Link href="/brand-ambassador-application" className="hover:text-green transition-colors">Apply Now</Link></li>
              <li><Link href="https://hempsafe.org" className="hover:text-green transition-colors" target="_blank" rel="noopener noreferrer">Get HempSafe™ Certified</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Greenline Activations. All rights reserved.</p>
          <p>Florida Field Marketing for Beverage Brands</p>
        </div>
      </div>
    </footer>
  );
}

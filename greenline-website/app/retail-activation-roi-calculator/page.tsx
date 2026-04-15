"use client";

import { useState } from "react";
import Link from "next/link";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function ROICalculatorPage() {
  const [activations, setActivations] = useState(4);
  const [avgCasePrice, setAvgCasePrice] = useState(48);
  const [unitsPerActivation, setUnitsPerActivation] = useState(24);
  const [activationCost, setActivationCost] = useState(250);
  const [margin, setMargin] = useState(40);

  const totalRevenue = activations * unitsPerActivation * (avgCasePrice / 24);
  const totalCost = activations * activationCost;
  const grossProfit = totalRevenue * (margin / 100);
  const netROI = grossProfit - totalCost;
  const roiPercent = totalCost > 0 ? ((netROI / totalCost) * 100).toFixed(0) : "0";
  const breakEven = activationCost / ((avgCasePrice / 24) * (margin / 100));

  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-16 px-4">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-4">Free Tool</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Audit Your Activation ROI{" "}
              <span className="text-green">Before You Launch</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed max-w-2xl">
              Stop guessing. Plug in your numbers and see exactly where your break-even point is,
              how many activations you need to be profitable, and whether field marketing makes sense right now.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Inputs */}
            <div className="card space-y-6">
              <h2 className="font-sans font-bold text-2xl text-dark mb-2">Your Numbers</h2>

              <div>
                <label className="font-sans font-semibold text-sm text-dark block mb-2">
                  Number of Activations per Month
                  <span className="text-green ml-2">{activations}</span>
                </label>
                <input
                  type="range" min={1} max={20} value={activations}
                  onChange={(e) => setActivations(Number(e.target.value))}
                  className="w-full accent-green"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-body"><span>1</span><span>20</span></div>
              </div>

              <div>
                <label className="font-sans font-semibold text-sm text-dark block mb-2">
                  Avg Case Price (per 24 units)
                  <span className="text-green ml-2">{formatCurrency(avgCasePrice)}</span>
                </label>
                <input
                  type="range" min={24} max={120} step={4} value={avgCasePrice}
                  onChange={(e) => setAvgCasePrice(Number(e.target.value))}
                  className="w-full accent-green"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-body"><span>$24</span><span>$120</span></div>
              </div>

              <div>
                <label className="font-sans font-semibold text-sm text-dark block mb-2">
                  Units Sold per Activation
                  <span className="text-green ml-2">{unitsPerActivation}</span>
                </label>
                <input
                  type="range" min={6} max={96} step={6} value={unitsPerActivation}
                  onChange={(e) => setUnitsPerActivation(Number(e.target.value))}
                  className="w-full accent-green"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-body"><span>6</span><span>96</span></div>
              </div>

              <div>
                <label className="font-sans font-semibold text-sm text-dark block mb-2">
                  Cost per Activation
                  <span className="text-green ml-2">{formatCurrency(activationCost)}</span>
                </label>
                <input
                  type="range" min={100} max={800} step={25} value={activationCost}
                  onChange={(e) => setActivationCost(Number(e.target.value))}
                  className="w-full accent-green"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-body"><span>$100</span><span>$800</span></div>
              </div>

              <div>
                <label className="font-sans font-semibold text-sm text-dark block mb-2">
                  Gross Margin %
                  <span className="text-green ml-2">{margin}%</span>
                </label>
                <input
                  type="range" min={10} max={70} step={5} value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-green"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-body"><span>10%</span><span>70%</span></div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className={`rounded-2xl p-8 text-white ${netROI >= 0 ? "bg-green" : "bg-coral"}`}>
                <div className="text-sm font-sans font-semibold uppercase tracking-wide opacity-80 mb-1">Monthly Net ROI</div>
                <div className="text-5xl font-sans font-bold">{formatCurrency(netROI)}</div>
                <div className="text-sm mt-2 opacity-80">{roiPercent}% return on activation spend</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card text-center py-5">
                  <div className="text-2xl font-sans font-bold text-dark">{formatCurrency(totalRevenue)}</div>
                  <div className="text-xs font-body text-gray-500 mt-1">Gross Revenue</div>
                </div>
                <div className="card text-center py-5">
                  <div className="text-2xl font-sans font-bold text-dark">{formatCurrency(totalCost)}</div>
                  <div className="text-xs font-body text-gray-500 mt-1">Total Activation Cost</div>
                </div>
                <div className="card text-center py-5">
                  <div className="text-2xl font-sans font-bold text-dark">{formatCurrency(grossProfit)}</div>
                  <div className="text-xs font-body text-gray-500 mt-1">Gross Profit</div>
                </div>
                <div className="card text-center py-5">
                  <div className="text-2xl font-sans font-bold text-dark">{Math.ceil(breakEven)} units</div>
                  <div className="text-xs font-body text-gray-500 mt-1">Break-Even per Activation</div>
                </div>
              </div>

              <div className="card bg-gray-50">
                <p className="text-xs font-body text-gray-500 leading-relaxed">
                  <strong>Note:</strong> This calculator estimates direct activation ROI based on sell-through at events.
                  It does not account for long-tail reorders, account retention, or brand awareness value.
                  Actual results vary based on product, account type, and ambassador performance.
                </p>
              </div>

              <Link href="/schedule-an-intro-call" className="btn-primary w-full text-center block">
                Get a Custom ROI Projection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Context */}
      <section className="section bg-gray-50">
        <div className="container-lg text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-dark mb-4">
            The End of <span className="text-coral">"Expensive Awareness"</span>
          </h2>
          <p className="font-body text-gray-600 leading-relaxed mb-6">
            Most field marketing fails because brands treat activations like advertising — vague brand impressions with no accountability.
            Greenline treats every activation like a sales event. Every rep is measured. Every account is tracked.
            Every dollar has to justify itself.
          </p>
          <Link href="/pilot-program" className="btn-secondary">
            See How the Pilot Works
          </Link>
        </div>
      </section>
    </>
  );
}

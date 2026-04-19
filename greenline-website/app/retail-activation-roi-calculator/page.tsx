"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const getCostPerActivation = (activations: number) => {
  if (activations >= 60) return 165;
  if (activations >= 30) return 180;
  if (activations >= 12) return 190;
  return 200; // Test Pilot (1–6)
};

const fmt = (n: number) => "$" + Math.round(n).toLocaleString();
const fmtN = (n: number) => Math.round(n).toLocaleString();

interface RampRow {
  act: number;
  cumRev: number;
  isProfitable: boolean;
  pctCovered: number;
}

interface CalcResult {
  sprintCost: number;
  costPerAct: number;
  totalSampled: number;
  totalBuyers: number;
  totalUnits: number;
  totalRev: number;
  netRev: number;
  cpc: number;
  cpb: number;
  roiPct: number;
  beUnits: number;
  rampData: RampRow[];
  upa: number;
  beAct: number | null;
}

export default function ROICalculatorPage() {
  const [acts, setActs] = useState(12);
  const [sampled, setSampled] = useState(50);
  const [conv, setConv] = useState(40);
  const [price, setPrice] = useState(15);

  const calculate = useCallback((): CalcResult => {
    const costPerAct = getCostPerActivation(acts);
    const sprintCost = acts * costPerAct;
    const convRate = conv / 100;
    const upa = Math.round(sampled * convRate);
    const totalSampled = acts * sampled;
    const totalBuyers = Math.round(totalSampled * convRate);
    const totalUnits = acts * upa;
    const totalRev = totalUnits * price;
    const netRev = totalRev - sprintCost;
    const cpc = totalSampled > 0 ? sprintCost / totalSampled : 0;
    const cpb = totalBuyers > 0 ? sprintCost / totalBuyers : 0;
    const roiPct = Math.round(((totalRev - sprintCost) / sprintCost) * 100);
    const beUnits = Math.ceil(sprintCost / price);

    const revenuePerAct = upa * price;
    let cumRev = 0;
    let beAct: number | null = null;
    const rampData: RampRow[] = Array.from({ length: acts }, (_, i) => {
      cumRev += revenuePerAct;
      if (cumRev >= sprintCost && beAct === null) beAct = i + 1;
      return {
        act: i + 1,
        cumRev,
        isProfitable: cumRev >= sprintCost,
        pctCovered: Math.min(Math.round((cumRev / sprintCost) * 100), 100),
      };
    });

    return { sprintCost, costPerAct, totalSampled, totalBuyers, totalUnits, totalRev, netRev, cpc, cpb, roiPct, beUnits, rampData, upa, beAct };
  }, [acts, sampled, conv, price]);

  const data = calculate();
  const sprintLabel = acts >= 60 ? "Sprint 3" : acts >= 30 ? "Sprint 2" : acts >= 12 ? "Sprint 1" : "Test Pilot";

  const comparisonRows: [string, string, string, string, string][] = [
    ["Price per activation", "$180–$200", "$150–180", "$100–150", "$300+ (loaded)"],
    ["HempSafe certified rep", "✓", "✗", "✗", "Varies"],
    ["Geo-tracked check-in", "✓", "✗", "✗", "✗"],
    ["25-point post-visit report", "✓", "✗", "✗", "✗"],
    ["Weekly performance reporting", "✓", "✗", "✗", "Varies"],
    ["Ambassador Rewards Program", "✓", "✗", "✗", "✗"],
    ["Named clients", "3CHI, Señorita", "None listed", "None", "N/A"],
    ["Consumer data captured", "✓", "✗", "✗", "Varies"],
    ["Accountability infrastructure", "Full", "Minimal", "None", "Partial"],
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-16 px-4">
        <div className="container-lg">
          <div className="max-w-3xl">
            <span className="tag mb-4">Free Tool</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Activation Sprint{" "}
              <span className="text-green">ROI Calculator</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed max-w-2xl">
              Plug in your numbers and see exactly how many consumers you&apos;ll reach,
              how many units you&apos;ll move, and what your return looks like before you commit.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section">
        <div className="container-lg space-y-8">

          {/* Inputs */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <h2 className="font-sans font-bold text-2xl text-dark">Sprint Parameters</h2>
              <div className="sm:text-right">
                <div className="text-sm font-body text-gray-500">
                  {acts} activations · 30 days · {sprintLabel} pricing
                </div>
                <div className="text-3xl font-sans font-bold text-green">{fmt(data.sprintCost)}</div>
                <div className="text-sm font-body text-gray-500">{fmt(data.costPerAct)}/activation</div>
              </div>
            </div>

            <div className="space-y-6">
              <SliderField
                label="Number of activations"
                value={acts}
                min={6} max={72} step={6}
                display={String(acts)}
                onChange={setActs}
                rangeLabels={["6", "72"]}
              />
              <SliderField
                label="Avg consumers sampled per event"
                value={sampled}
                min={15} max={60} step={5}
                display={String(sampled)}
                onChange={setSampled}
                rangeLabels={["15", "60"]}
              />
              <SliderField
                label="Sample-to-purchase conversion"
                value={conv}
                min={20} max={90} step={5}
                display={`${conv}%`}
                onChange={setConv}
                rangeLabels={["20%", "90%"]}
              />
              <SliderField
                label="Avg retail price per unit"
                value={price}
                min={12} max={40} step={1}
                display={fmt(price)}
                onChange={setPrice}
                rangeLabels={["$12", "$40"]}
              />
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-body text-gray-600 text-sm">Avg units purchased per activation</span>
              <span className="font-sans font-semibold text-dark text-sm">
                {sampled} consumers × {conv}% ={" "}
                <span className="text-green font-bold">{fmtN(data.upa)} units</span>
              </span>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Sprint Cost" value={fmt(data.sprintCost)} sub={`${acts} activations`} />
            <MetricCard label="Consumers Reached" value={fmtN(data.totalSampled)} sub="Total sprint" />
            <MetricCard label="Est. Units Moved" value={fmtN(data.totalUnits)} sub="At conversion rate" highlight />
            <MetricCard label="Retail Revenue" value={fmt(data.totalRev)} sub="Gross generated" highlight />
          </div>

          {/* Economics + ROI */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="font-sans font-bold text-lg text-dark mb-5">Sprint Economics</h3>
              <div className="space-y-3">
                {([
                  ["Sprint investment", fmt(data.sprintCost)],
                  ["Consumers sampled", `${fmtN(data.totalSampled)} consumers`],
                  [`Buyers converted`, `${fmtN(data.totalBuyers)} buyers (${conv}%)`],
                  ["Est. retail revenue generated", fmt(data.totalRev)],
                  ["Cost per consumer reached", fmt(data.cpc)],
                ] as [string, string][]).map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm font-body border-b border-gray-100 pb-3">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-dark">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between font-sans font-bold pt-1">
                  <span className="text-dark">Net revenue after sprint cost</span>
                  <span className={data.netRev >= 0 ? "text-green" : "text-coral"}>{fmt(data.netRev)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`rounded-2xl p-8 text-white ${data.roiPct >= 0 ? "bg-green" : "bg-coral"}`}>
                <div className="text-sm font-sans font-semibold uppercase tracking-wide opacity-80 mb-1">Sprint ROI</div>
                <div className="text-5xl font-sans font-bold">{data.roiPct}%</div>
                <div className="text-sm mt-2 opacity-80">Revenue vs. investment</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="card text-center py-5">
                  <div className="text-2xl font-sans font-bold text-dark">{fmt(data.cpb)}</div>
                  <div className="text-xs font-body text-gray-500 mt-1">Cost per Buyer</div>
                </div>
                <div className="card text-center py-5">
                  <div className="text-2xl font-sans font-bold text-dark">{fmtN(data.beUnits)}</div>
                  <div className="text-xs font-body text-gray-500 mt-1">Break-even Units</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activation Ramp */}
          <div className="card">
            <h3 className="font-sans font-bold text-lg text-dark mb-6">
              Activation-by-Activation Revenue Build
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {data.rampData.map((item) => (
                <div key={item.act} className="flex items-center gap-3 text-sm">
                  <span className="font-body text-gray-400 w-12 flex-shrink-0 text-xs">Act {item.act}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.isProfitable ? "bg-green" : "bg-coral/50"}`}
                      style={{ width: `${Math.min((item.cumRev / (data.totalRev * 1.1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-sans font-semibold text-dark w-20 text-right flex-shrink-0 text-xs">
                    {fmt(item.cumRev)}
                  </span>
                  <span className={`text-xs font-body w-20 flex-shrink-0 ${item.isProfitable ? "text-green font-semibold" : "text-gray-400"}`}>
                    {item.isProfitable ? "✓ profit" : `${item.pctCovered}% covered`}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between gap-1 text-sm font-body text-gray-600">
              <span>Break-even at activation: <strong className="text-dark">#{data.beAct ?? "Beyond sprint"}</strong></span>
              <span>Total cumulative revenue: <strong className="text-dark">{fmt(data.totalRev)}</strong></span>
            </div>
          </div>

          {/* Comparison table */}
          <div className="card overflow-x-auto">
            <h3 className="font-sans font-bold text-lg text-dark mb-6">
              Why Greenline is the Smartest Activation Spend in the Room
            </h3>
            <table className="w-full text-sm font-body min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 font-sans font-semibold text-dark">Feature</th>
                  <th className="py-3 px-3 font-sans font-semibold text-green bg-green-50">Greenline</th>
                  <th className="py-3 px-3 font-sans font-semibold text-gray-500">Promo Agency</th>
                  <th className="py-3 px-3 font-sans font-semibold text-gray-500">Freelance Rep</th>
                  <th className="py-3 px-3 font-sans font-semibold text-gray-500">In-House</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, greenline, agency, freelance, inhouse]) => (
                  <tr key={feature} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-dark">{feature}</td>
                    <td className={`py-3 px-3 text-center bg-green-50 font-semibold ${greenline === "✓" ? "text-green" : "text-dark"}`}>
                      {greenline}
                    </td>
                    <td className={`py-3 px-3 text-center ${agency === "✗" ? "text-coral" : "text-gray-500"}`}>{agency}</td>
                    <td className={`py-3 px-3 text-center ${freelance === "✗" ? "text-coral" : "text-gray-500"}`}>{freelance}</td>
                    <td className="py-3 px-3 text-center text-gray-500">{inhouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm font-body text-gray-600 leading-relaxed">
              <strong className="text-dark">The real cost of a cheaper rep:</strong> An untrained temp at $150/activation
              who can&apos;t answer dosage questions, skips check-in, and submits no post-visit data costs you more in
              lost conversions than the $75 you saved. At 80% sample-to-purchase, the rep is the product.
            </div>
          </div>

          <Link href="/schedule-an-intro-call" className="btn-primary w-full text-center block">
            Get a Custom ROI Projection
          </Link>

        </div>
      </section>

      {/* Context */}
      <section className="section bg-gray-50">
        <div className="container-lg text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-dark mb-4">
            The End of <span className="text-coral">&ldquo;Expensive Awareness&rdquo;</span>
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

function SliderField({
  label, value, min, max, step, display, onChange, rangeLabels,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  rangeLabels: [string, string];
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-sans font-semibold text-sm text-dark">{label}</label>
        <span className="text-green font-sans font-bold text-sm">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-green"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1 font-body">
        <span>{rangeLabels[0]}</span>
        <span>{rangeLabels[1]}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, highlight }: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-6 text-center ${highlight ? "bg-green text-white" : "bg-gray-50"}`}>
      <div className={`text-2xl font-sans font-bold ${highlight ? "text-white" : "text-dark"}`}>{value}</div>
      <div className={`text-sm font-sans font-semibold mt-1 ${highlight ? "text-green-100" : "text-dark"}`}>{label}</div>
      <div className={`text-xs font-body mt-1 ${highlight ? "text-green-100 opacity-80" : "text-gray-500"}`}>{sub}</div>
    </div>
  );
}

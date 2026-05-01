interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "30%", label: "Avg. Sample-to-Purchase Conversion" },
  { value: "100%", label: "HempSafe™ Certified Ambassadors" },
  { value: "50-pt", label: "Post-Activation Recap" },
  { value: "Real-Time", label: "Tally-Tracked Activations" },
];

export function StatStrip({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <section className="bg-ink text-bone border-y-2 border-ink py-8">
      <div className="container-xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display font-black text-3xl md:text-4xl text-canopy leading-none">
                {stat.value}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-bone/60 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

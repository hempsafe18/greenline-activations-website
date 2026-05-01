"use client";

import { useState } from "react";
import { JsonLd } from "./JsonLd";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({
  items,
  heading = "Frequently Asked Questions",
}: {
  items: FaqItem[];
  heading?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="section bg-bone border-t-2 border-ink">
      <JsonLd data={schema} />
      <div className="container-xl px-4">
        <div className="max-w-3xl mx-auto">
          <span className="tag mb-4">FAQ</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-10">
            {heading}
          </h2>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="border-2 border-ink bg-bone shadow-brutal">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 group"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-display font-bold text-sm uppercase tracking-tight text-ink">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 w-6 h-6 border-2 border-ink flex items-center justify-center font-display font-black text-base leading-none group-hover:bg-canopy transition-colors">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-ink/80 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

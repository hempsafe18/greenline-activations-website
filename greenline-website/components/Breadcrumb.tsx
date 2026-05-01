import Link from "next/link";
import { JsonLd } from "./JsonLd";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://www.greenlineactivations.com${item.href}`,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="border-b-2 border-ink/10 bg-bone">
        <div className="container-xl px-4 py-3">
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink/50 font-display font-bold">
            {items.map((item, index) => (
              <li key={item.href} className="flex items-center gap-2">
                {index > 0 && <span className="text-ink/30">/</span>}
                {index === items.length - 1 ? (
                  <span className="text-ink">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-canopy transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}

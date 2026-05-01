import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatStrip } from "@/components/StatStrip";
import { JsonLd } from "@/components/JsonLd";

type CityData = {
  slug: string;
  displayName: string;
  region: string;
  titleTag: string;
  metaDescription: string;
  context: string;
  primaryRetailChannels: string[];
  nearbyMarkets: string[];
};

const CITIES: CityData[] = [
  {
    slug: "miami",
    displayName: "Miami",
    region: "Miami / Dade County",
    titleTag: "Brand Activation Staff Miami | Hemp & Beverage Specialists | Greenline Activations",
    metaDescription:
      "Hire HempSafe™-certified brand activation staff in Miami. Greenline Activations deploys trained ambassadors to Miami smoke shops, specialty retailers, and festivals. No contracts. Book online.",
    context:
      "Miami is Florida's largest consumer market and a primary growth channel for hemp and functional beverages. High tourist density, diverse demographics, and a concentrated smoke shop and specialty retail footprint make Miami a priority activation market.",
    primaryRetailChannels: [
      "Smoke shops in Wynwood and Little Havana",
      "Specialty beverage retailers countywide",
      "Natural grocers (Whole Foods, Fresh Market)",
      "Festivals including Ultra, Art Basel markets, and beachside pop-ups",
    ],
    nearbyMarkets: ["Fort Lauderdale", "Boca Raton", "West Palm Beach"],
  },
  {
    slug: "tampa",
    displayName: "Tampa",
    region: "Tampa Bay",
    titleTag: "Brand Activation Staff Tampa | Hemp & Beverage Specialists | Greenline Activations",
    metaDescription:
      "Hire HempSafe™-certified brand activation staff in Tampa. Greenline Activations deploys trained ambassadors to Tampa Bay smoke shops, specialty retailers, and events. No contracts. Book online.",
    context:
      "Tampa Bay is one of Florida's fastest-growing hemp and functional beverage markets. Ybor City, South Tampa, and St. Pete represent high-density activation corridors with strong smoke shop networks and specialty retailers embracing hemp-derived drinks.",
    primaryRetailChannels: [
      "Smoke shops in Ybor City and South Tampa",
      "Specialty beverage retailers countywide",
      "Natural grocers and co-ops in South Tampa and St. Pete",
      "Festivals including Gasparilla and Tampa Bay Beer Week",
    ],
    nearbyMarkets: ["St. Petersburg", "Clearwater", "Sarasota"],
  },
  {
    slug: "orlando",
    displayName: "Orlando",
    region: "Orlando / Central Florida",
    titleTag: "Brand Activation Staff Orlando | Hemp & Beverage Specialists | Greenline Activations",
    metaDescription:
      "Hire HempSafe™-certified brand activation staff in Orlando. Greenline Activations deploys trained ambassadors to Orlando smoke shops, specialty retailers, and events. No contracts. Book online.",
    context:
      "Orlando's tourism economy and large millennial population create strong demand for hemp, functional, and better-for-you beverages. The I-Drive corridor, Mills 50, and Thornton Park districts are high-traffic retail activation zones.",
    primaryRetailChannels: [
      "Smoke shops along International Drive and Mills Avenue",
      "Specialty beverage retailers and natural grocers",
      "Natural grocers and health food stores",
      "Convention events at Orange County Convention Center",
    ],
    nearbyMarkets: ["Kissimmee", "Sanford", "Lake Mary"],
  },
  {
    slug: "jacksonville",
    displayName: "Jacksonville",
    region: "Jacksonville / Northeast Florida",
    titleTag:
      "Brand Activation Staff Jacksonville | Hemp & Beverage Specialists | Greenline Activations",
    metaDescription:
      "Hire HempSafe™-certified brand activation staff in Jacksonville. Greenline Activations deploys trained ambassadors to Jacksonville smoke shops, specialty retailers, and events. No contracts. Book online.",
    context:
      "Jacksonville is Florida's largest city by area and one of the most underserved markets for premium beverage activation. A large military population, growing craft beverage scene, and an expanding smoke shop network make it a high-opportunity market for early movers.",
    primaryRetailChannels: [
      "Smoke shops in Riverside and San Marco",
      "Package stores and specialty beverage retailers",
      "Specialty natural grocers",
      "Festivals including Jacksonville Jazz Festival and beach events",
    ],
    nearbyMarkets: ["St. Augustine", "Gainesville", "Daytona Beach"],
  },
  {
    slug: "fort-lauderdale",
    displayName: "Fort Lauderdale",
    region: "Fort Lauderdale / Broward County",
    titleTag:
      "Brand Activation Staff Fort Lauderdale | Hemp & Beverage Specialists | Greenline Activations",
    metaDescription:
      "Hire HempSafe™-certified brand activation staff in Fort Lauderdale. Greenline Activations deploys trained ambassadors to Broward County smoke shops, specialty retailers, and events. No contracts. Book online.",
    context:
      "Fort Lauderdale's dense retail corridor along Federal Highway and the Las Olas district, combined with strong tourist and boating culture demographics, make it a premium market for hemp and adult beverage activations. Broward County's smoke shop density is among the highest in Florida.",
    primaryRetailChannels: [
      "Smoke shops along Federal Highway and Broward Boulevard",
      "Package stores and specialty beverage retailers",
      "Whole Foods and Fresh Market locations in Boca/Deerfield",
      "Events including SunFest and Fort Lauderdale International Boat Show",
    ],
    nearbyMarkets: ["Boca Raton", "Pompano Beach", "Deerfield Beach"],
  },
];

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = CITIES.find((c) => c.slug === citySlug) as CityData | undefined;
  if (!city) return {};

  return {
    title: city.titleTag,
    description: city.metaDescription,
    openGraph: {
      title: city.titleTag,
      description: city.metaDescription,
      url: `https://www.greenlineactivations.com/florida/${city.slug}/brand-activation-staff/`,
      siteName: "Greenline Activations",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: city.titleTag,
      description: city.metaDescription,
    },
    alternates: {
      canonical: `https://www.greenlineactivations.com/florida/${city.slug}/brand-activation-staff/`,
    },
  };
}

export default async function CityBrandActivationPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const cityMatch = CITIES.find((c) => c.slug === citySlug);
  if (!cityMatch) notFound();
  const city = cityMatch as CityData;

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Florida", href: "/florida/brand-activation/" },
    {
      name: `${city.displayName} Brand Activation`,
      href: `/florida/${city.slug}/brand-activation-staff/`,
    },
  ];

  const localBizSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Greenline Activations — ${city.displayName} Brand Activation`,
    url: `https://www.greenlineactivations.com/florida/${city.slug}/brand-activation-staff/`,
    areaServed: { "@type": "City", name: city.displayName },
  };

  const otherCities = CITIES.filter((c) => c.slug !== citySlug);

  return (
    <>
      <JsonLd data={localBizSchema} />
      <Breadcrumb items={breadcrumb} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bone border-b-2 border-ink">
        <div className="container-xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="tag-street">{city.region} · Florida</span>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tighter text-ink text-[40px] sm:text-5xl lg:text-[64px]">
              Brand Activation Staff in{" "}
              <span className="text-canopy">{city.displayName}</span> — HempSafe™ Certified &amp;
              Conversion-Ready
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80">
              Greenline Activations deploys HempSafe™-certified brand ambassadors to {city.region}{" "}
              retail accounts and events. No proposals, no contracts, real conversion data after every
              activation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book/" className="btn-street text-base">
                Book Activation Staff in {city.displayName} →
              </Link>
              <Link href="/results/" className="btn-ghost text-sm">
                See Conversion Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip />

      {/* Market Context */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="tag">Market Overview</span>
              <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
                {city.displayName} Brand Activation Market
              </h2>
              <p className="mt-5 text-ink/80 leading-relaxed">{city.context}</p>
              <div className="mt-6">
                <Link href="/services/brand-activation/" className="btn-ghost text-sm">
                  About Our Activation Services →
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold uppercase tracking-tight text-sm text-ink/60 mb-4">
                Primary Retail Channels in {city.displayName}
              </h3>
              <div className="space-y-2">
                {city.primaryRetailChannels.map((channel) => (
                  <div
                    key={channel}
                    className="flex items-start gap-3 border-2 border-ink p-4 shadow-brutal bg-bone"
                  >
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-canopy border-2 border-ink flex items-center justify-center font-display font-black text-[10px]">
                      ✓
                    </div>
                    <span className="text-sm text-ink/80 leading-relaxed">{channel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HempSafe Callout */}
      <section className="section bg-canopy border-y-2 border-ink">
        <div className="container-xl px-4">
          <div className="grid md:grid-cols-[1.2fr,1fr] gap-10 items-center">
            <div>
              <span className="tag-ink">HempSafe™</span>
              <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight">
                HempSafe™ Certified Ambassadors in {city.displayName}
              </h2>
              <p className="mt-5 text-ink/80 leading-relaxed max-w-lg">
                Every Greenline ambassador deployed in {city.region} holds HempSafe™ certification —
                trained in hemp regulations, age restrictions, and responsible sampling before their
                first activation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/book/" className="btn-primary">
                  Book Your Activation →
                </Link>
                <a
                  href="https://hempsafe.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm"
                >
                  About HempSafe™
                </a>
              </div>
            </div>
            <div className="bg-ink text-bone border-2 border-ink p-8 shadow-brutal-lg">
              <div className="grid grid-cols-2 gap-6 text-center">
                {[
                  ["100%", "HempSafe™ Certified"],
                  ["30%", "Avg. Conversion"],
                  ["50-pt", "Activation Recap"],
                  ["Zero", "Compliance Incidents"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div className="font-display font-black text-3xl text-canopy leading-none">{v}</div>
                    <div className="text-[11px] uppercase tracking-widest text-bone/60 mt-2">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Markets */}
      {city.nearbyMarkets.length > 0 && (
        <section className="section bg-bone border-b-2 border-ink">
          <div className="container-xl px-4">
            <span className="tag">Nearby Coverage</span>
            <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-6">
              We Also Cover {city.nearbyMarkets.join(", ")}
            </h2>
            <p className="text-ink/70 max-w-xl leading-relaxed">
              Greenline&apos;s {city.region} coverage extends to surrounding markets. Contact us for
              activation availability in {city.nearbyMarkets.join(", ")}, and surrounding areas.
            </p>
          </div>
        </section>
      )}

      {/* Other Cities */}
      <section className="section bg-ink text-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag-street">Florida Coverage</span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl md:text-5xl leading-[0.95] tracking-tight mb-8 max-w-2xl">
            Other Florida Activation Markets
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/florida/${c.slug}/brand-activation-staff/`}
                className="flex items-center justify-between gap-3 bg-bone text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group"
              >
                <span className="font-display font-bold uppercase tracking-tight text-sm">
                  {c.displayName}
                </span>
                <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">
                  →
                </span>
              </Link>
            ))}
            <Link
              href="/florida/brand-activation/"
              className="flex items-center justify-between gap-3 bg-canopy text-ink border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow"
            >
              <span className="font-display font-bold uppercase tracking-tight text-sm">
                All Florida Markets
              </span>
              <span className="font-display font-black text-xs">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section bg-bone border-b-2 border-ink">
        <div className="container-xl px-4">
          <span className="tag">Related Services</span>
          <h2 className="mt-4 font-display font-black uppercase text-ink text-4xl md:text-5xl leading-[0.95] tracking-tight mb-8">
            Activation Services in {city.displayName}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Brand Activation Staff", href: "/services/brand-activation/" },
              { label: "Hemp & THC Beverage Activation", href: "/services/hemp-thc-beverage-activation/" },
              { label: "Functional Beverage Activation", href: "/services/functional-beverage-activation/" },
              { label: "HempSafe™ Certified Ambassadors", href: "/services/hempsafe-certified-brand-ambassadors/" },
              { label: "Retail Activation", href: "/services/retail-activation/" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between gap-4 border-2 border-ink p-4 shadow-brutal hover:shadow-brutal-lg transition-shadow group bg-bone"
              >
                <span className="font-display font-bold uppercase tracking-tight text-sm">
                  {item.label}
                </span>
                <span className="font-display font-black text-xs text-canopy group-hover:text-street transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section bg-bone">
        <div className="container-xl px-4 text-center">
          <div className="inline-block bg-street text-bone border-2 border-ink px-3 py-1 font-display font-black text-[11px] uppercase tracking-widest -rotate-2 mb-6 shadow-brutal">
            No proposals. No contracts. Just results.
          </div>
          <h2 className="font-display font-black uppercase text-ink text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            Book Activation Staff
            <br className="hidden md:block" />{" "}
            <span className="bg-ink text-bone px-3 inline-block">in {city.displayName}</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed text-lg">
            HempSafe™-certified ambassadors. 30% avg. sample-to-purchase conversion. 50-point recap
            after every event.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/" className="btn-street text-base">
              Book Your Activation →
            </Link>
            <Link href="/schedule-an-intro-call" className="btn-ghost text-sm">
              Prefer to chat first?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

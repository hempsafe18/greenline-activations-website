# Greenline Activations — Claude Code SEO Implementation Project

## Project Overview

This is the Next.js codebase for **greenlineactivations.com** — a productized brand activation agency specializing in hemp, THC beverage, and adult beverage brands operating in Florida retail.

**Your job in this project:** Implement a full SEO build-out based on the plan in `seo/SEO_IMPLEMENTATION_PLAN.md`. This includes creating new pages, wiring up metadata, adding JSON-LD schema, building a sitemap, and writing the on-page copy for each priority page.

---

## Tech Stack Assumptions

- **Framework:** Next.js 14+ with the **App Router** (`app/` directory)
- **Styling:** Tailwind CSS (assumed; adjust if the project uses a different system)
- **Deployment:** Vercel
- **Language:** TypeScript preferred; fall back to JS if the existing codebase is JS-only
- **Metadata API:** Use Next.js native `Metadata` / `generateMetadata` — do NOT use `next/head` or `react-helmet`
- **Images:** Use `next/image` for all images

If the project uses the Pages Router (`pages/` directory) instead of App Router, adapt all patterns accordingly — use `<Head>` via `next/head` for metadata, and export from `pages/` instead of `app/`.

---

## Before You Start

1. **Read this file completely first.**
2. Run `ls -la` to understand the existing directory structure.
3. Check `package.json` for the Next.js version and any installed SEO libraries (e.g., `next-seo`). If `next-seo` is already installed, use it; otherwise use the native Next.js Metadata API.
4. Look at one existing page (e.g., `app/page.tsx` or `pages/index.tsx`) to understand the component/layout patterns in use before writing new ones. Match the existing code style exactly.
5. Check for an existing `components/` or `ui/` directory and reuse existing layout components (Header, Footer, Button, etc.) rather than creating new ones.
6. Do NOT install new dependencies unless explicitly required for a specific task and not already present.

---

## Implementation Plan — Phases

Work through these phases in order. Complete and verify each phase before starting the next.

### Phase 1 — Foundation (Start Here)

These are the three highest-priority pages. Build them first.

| Priority | Page | Route | Source File |
|----------|------|--------|-------------|
| 1 | Homepage (SEO update) | `/` | `seo/content/homepage.md` |
| 2 | Brand Activation Services | `/services/brand-activation` | `seo/content/brand-activation.md` |
| 3 | Hemp/THC Beverage Activation | `/services/hemp-thc-beverage-activation` | `seo/content/hemp-thc-beverage-activation.md` |

Also in Phase 1:
- Create `app/sitemap.ts` (or `pages/api/sitemap.xml.ts`)
- Create `app/robots.ts`
- Add global JSON-LD Organization schema to the root layout

### Phase 2 — Service Verticals

| Page | Route |
|------|--------|
| Alcohol Beverage Activation | `/services/alcohol-beverage-activation` |
| Functional Beverage Activation | `/services/functional-beverage-activation` |
| HempSafe Certified Ambassadors | `/services/hempsafe-certified-brand-ambassadors` |
| Retail Activation | `/services/retail-activation` |
| Florida Brand Activation Hub | `/florida/brand-activation` |
| Results / Case Studies | `/results` |

### Phase 3 — Florida City Pages

Build a reusable city page template, then generate pages for:

| City | Route |
|------|--------|
| Miami | `/florida/miami/brand-activation-staff` |
| Tampa | `/florida/tampa/brand-activation-staff` |
| Orlando | `/florida/orlando/brand-activation-staff` |
| Jacksonville | `/florida/jacksonville/brand-activation-staff` |
| Fort Lauderdale | `/florida/fort-lauderdale/brand-activation-staff` |

---

## URL & Route Architecture

All routes must match exactly — these are the canonical URLs:

```
/                                              → Homepage
/services/brand-activation/                   → Brand Activation Services hub
/services/hemp-thc-beverage-activation/       → Hemp/THC Beverage Activation
/services/alcohol-beverage-activation/        → Alcohol Beverage Activation
/services/functional-beverage-activation/     → Functional Beverage Activation
/services/hempsafe-certified-brand-ambassadors/ → HempSafe page
/services/retail-activation/                  → Retail Activation
/florida/brand-activation/                    → Florida hub
/florida/miami/brand-activation-staff/        → Miami city page
/florida/tampa/brand-activation-staff/        → Tampa city page
/florida/orlando/brand-activation-staff/      → Orlando city page
/florida/jacksonville/brand-activation-staff/ → Jacksonville city page
/florida/fort-lauderdale/brand-activation-staff/ → Fort Lauderdale city page
/results/                                     → Case Studies / Results
/resources/                                   → Blog / Resources
/about/                                       → About + HempSafe info
/book/                                        → Contact / Book Now
```

In Next.js App Router, trailing slashes are optional — use whichever convention the existing project uses. Check `next.config.js` for `trailingSlash` setting.

---

## Metadata Implementation (Next.js App Router)

For each page, export a `metadata` object or `generateMetadata` function. Pattern:

```typescript
// app/services/brand-activation/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Activation Staff for Hire | Greenline Activations — Beverage & Hemp Specialists',
  description: 'Hire trained brand activation staff for your next campaign. Greenline Activations provides HempSafe-certified ambassadors for retail demos, festivals, and sampling events across Florida. Book online in minutes — no contracts required.',
  openGraph: {
    title: 'Brand Activation Staff for Hire | Greenline Activations',
    description: 'HempSafe-certified brand activation staff for hemp, THC, and adult beverage brands. Book online, no contracts.',
    url: 'https://www.greenlineactivations.com/services/brand-activation/',
    siteName: 'Greenline Activations',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Activation Staff for Hire | Greenline Activations',
    description: 'HempSafe-certified brand activation staff for hemp, THC, and adult beverage brands.',
  },
  alternates: {
    canonical: 'https://www.greenlineactivations.com/services/brand-activation/',
  },
}
```

**All metadata specs are in `seo/page-specs.json`.** Read that file for each page's exact title, description, H1, H2s, and canonical URL.

---

## JSON-LD Schema Implementation

Add structured data via a `<script type="application/ld+json">` tag. Create a reusable `JsonLd` component:

```typescript
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

### Schema by page type:

**Root layout — add to `app/layout.tsx`:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Greenline Activations",
  "url": "https://www.greenlineactivations.com",
  "logo": "https://www.greenlineactivations.com/logo.png",
  "description": "Productized brand activation agency for hemp, THC beverage, and adult beverage brands in Florida.",
  "areaServed": {
    "@type": "State",
    "name": "Florida"
  },
  "sameAs": []
}
```

**Service pages — add Service schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Brand Activation Staff",
  "provider": {
    "@type": "Organization",
    "name": "Greenline Activations"
  },
  "areaServed": "Florida",
  "description": "..."
}
```

**FAQ sections — add FAQPage schema (use actual Q&A from the page content):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do your ambassadors need product knowledge training?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every Greenline ambassador completes HempSafe certification before their first activation..."
      }
    }
  ]
}
```

**City pages — add LocalBusiness schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Greenline Activations — Miami Brand Activation",
  "url": "https://www.greenlineactivations.com/florida/miami/brand-activation-staff/",
  "areaServed": {
    "@type": "City",
    "name": "Miami"
  }
}
```

**BreadcrumbList — add to every non-homepage page:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.greenlineactivations.com/" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.greenlineactivations.com/services/" },
    { "@type": "ListItem", "position": 3, "name": "Brand Activation", "item": "https://www.greenlineactivations.com/services/brand-activation/" }
  ]
}
```

---

## Sitemap (`app/sitemap.ts`)

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.greenlineactivations.com'
  const now = new Date()

  const staticPages = [
    { url: `${base}/`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${base}/services/brand-activation/`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${base}/services/hemp-thc-beverage-activation/`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${base}/services/alcohol-beverage-activation/`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/services/functional-beverage-activation/`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/services/hempsafe-certified-brand-ambassadors/`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/services/retail-activation/`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/florida/brand-activation/`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/florida/miami/brand-activation-staff/`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/florida/tampa/brand-activation-staff/`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/florida/orlando/brand-activation-staff/`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/florida/jacksonville/brand-activation-staff/`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/florida/fort-lauderdale/brand-activation-staff/`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/results/`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/about/`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/book/`, priority: 0.9, changeFrequency: 'monthly' as const },
  ]

  return staticPages.map(page => ({ ...page, lastModified: now }))
}
```

---

## Robots (`app/robots.ts`)

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.greenlineactivations.com/sitemap.xml',
  }
}
```

---

## Page Structure Guidelines

Each page must include in this order:

1. **Hero section** — H1 (exact text from `seo/page-specs.json`), subheadline, primary CTA button
2. **Stats strip** — Key proof points as a horizontal bar (30% conversion, HempSafe Certified, 50-Point Recap, Tally-Tracked)
3. **H2 sections** — In the exact order listed in `seo/page-specs.json` for that page
4. **FAQ section** — With FAQPage JSON-LD schema. Questions/answers from the content `.md` file
5. **Closing CTA** — "Book Your Activation" linking to `/book/`
6. **Breadcrumb nav** — Visible breadcrumb component + BreadcrumbList JSON-LD

### Internal Linking Rules

Every service page must include these links:
- Back to homepage (`/`)
- To `/book/` (primary CTA — must appear at least twice: hero and page bottom)
- To at least 2 sibling service pages
- To `/results/` ("See Conversion Data" secondary CTA)
- To `/florida/brand-activation/` if the page mentions Florida

The homepage must link to all service pages and the Florida hub.

---

## Copy Source Files

All page copy, headlines, H2s, FAQ content, and CTAs live in `seo/content/`. Do not invent copy — pull it directly from these files:

- `seo/content/homepage.md` — Homepage
- `seo/content/brand-activation.md` — Brand Activation Services page
- `seo/content/hemp-thc-beverage-activation.md` — Hemp/THC page

For Phase 2+ pages not yet in the content folder, use the messaging framework in `seo/SEO_IMPLEMENTATION_PLAN.md` to write copy that is consistent with the established voice: direct, data-forward, compliance-aware, no fluff.

### Brand Voice Rules
- Lead with data and specificity: "30% sample-to-purchase conversion" beats "great results"
- HempSafe certification is always capitalized: **HempSafe™**
- Use "ambassadors" not "staff" or "models" in body copy
- CTA copy: "Book Your Activation" (primary), "See Conversion Data" (secondary)
- Never use "we care about your brand" or similar generic agency language
- Short sentences. Active voice. No passive constructions.

---

## Key Proof Points (Use Throughout)

Always reference these when writing or placing copy in new sections:

| Proof Point | Exact Phrasing |
|-------------|----------------|
| Conversion rate | "30% average sample-to-purchase conversion" |
| Certification | "HempSafe™ certified ambassadors" |
| Tracking | "Tally-tracked activations" |
| Reporting | "50-point post-activation recap" |
| Model | "No proposals. No contracts. Book online." |
| Market | "Florida retail — smoke shops, liquor stores, natural grocers, festivals" |

---

## Component Checklist Per New Page

Before marking any page as done, verify:

- [ ] `metadata` export with title, description, openGraph, twitter, alternates.canonical
- [ ] H1 matches spec exactly (from `seo/page-specs.json`)
- [ ] H2s present in the correct order (from `seo/page-specs.json`)
- [ ] At least one `<JsonLd>` component with correct schema type
- [ ] BreadcrumbList JSON-LD present
- [ ] FAQPage JSON-LD present (if page has FAQ section)
- [ ] Primary CTA links to `/book/`
- [ ] Internal links to sibling pages present
- [ ] All images use `next/image` with descriptive `alt` text
- [ ] `alt` text includes target keyword (e.g., "HempSafe certified brand ambassador at Florida liquor store activation")
- [ ] Page renders without console errors

---

## File Naming & Directory Conventions (App Router)

```
app/
  page.tsx                          ← Homepage (update existing)
  layout.tsx                        ← Add Organization JSON-LD here
  sitemap.ts                        ← Generate sitemap
  robots.ts                         ← Robots config
  services/
    brand-activation/
      page.tsx
    hemp-thc-beverage-activation/
      page.tsx
    alcohol-beverage-activation/
      page.tsx
    functional-beverage-activation/
      page.tsx
    hempsafe-certified-brand-ambassadors/
      page.tsx
    retail-activation/
      page.tsx
  florida/
    brand-activation/
      page.tsx
    [city]/                         ← Dynamic route for city pages
      brand-activation-staff/
        page.tsx
  results/
    page.tsx
  about/
    page.tsx
  book/
    page.tsx
components/
  JsonLd.tsx                        ← Create this
  Breadcrumb.tsx                    ← Create this (visual + schema)
  StatStrip.tsx                     ← Proof-point stats bar (reuse across pages)
  FaqSection.tsx                    ← FAQ with JSON-LD (reuse across pages)
seo/                                ← SEO source files (this folder, read-only reference)
  CLAUDE.md                         ← This file
  SEO_IMPLEMENTATION_PLAN.md        ← Full strategic plan
  page-specs.json                   ← Machine-readable specs for all pages
  content/
    homepage.md
    brand-activation.md
    hemp-thc-beverage-activation.md
```

---

## City Page Template (Phase 3)

Use a single dynamic route `app/florida/[city]/brand-activation-staff/page.tsx` with a `generateStaticParams` export to pre-render all city pages:

```typescript
export async function generateStaticParams() {
  return [
    { city: 'miami' },
    { city: 'tampa' },
    { city: 'orlando' },
    { city: 'jacksonville' },
    { city: 'fort-lauderdale' },
  ]
}
```

Each city page uses `generateMetadata` to produce unique title/description per city. City data (display name, population context, retail density notes) lives in `seo/content/florida-cities.json`.

---

## Google Search Console & Verification

After deployment, add the GSC verification meta tag to `app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  // ...other fields
  verification: {
    google: 'YOUR_GSC_VERIFICATION_TOKEN', // Replace with actual token from GSC
  },
}
```

---

## Do Not Touch

- Do not modify the `/book/` checkout/Stripe integration code
- Do not change any existing auth, API routes, or database connections
- Do not alter the global CSS variables or design tokens without checking with the team
- Do not add analytics scripts (GA4, Segment, etc.) — those are managed separately

---

## Definition of Done

Phase 1 is complete when:
1. All three priority pages are live on Vercel preview URL
2. Each page passes the Component Checklist above
3. `sitemap.xml` is accessible at `https://www.greenlineactivations.com/sitemap.xml`
4. `robots.txt` is accessible and includes sitemap URL
5. No TypeScript errors (`npx tsc --noEmit`)
6. No broken internal links on the three pages

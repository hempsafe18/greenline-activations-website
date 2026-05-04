"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const HUBSPOT_PORTAL_ID = "47886643";
const HUBSPOT_FORM_ID = "c1a7fbea-19f8-4489-81bf-9cea6efc2b07";

const marketsByRegion: { region: string; cities: string[] }[] = [
  {
    region: "West",
    cities: ["Los Angeles", "San Diego", "San Francisco", "Seattle", "Phoenix", "Las Vegas"],
  },
  {
    region: "South",
    cities: [
      "Dallas",
      "San Antonio",
      "Austin",
      "Houston",
      "New Orleans",
      "Nashville",
      "Atlanta",
      "Charlotte",
      "Charleston, SC",
      "Jacksonville",
      "Tampa",
      "Orlando",
      "Miami",
    ],
  },
];

const experienceOptions = [
  "No experience — I'm new to brand ambassador work",
  "1–2 events (just getting started)",
  "3–10 events (some experience)",
  "10+ events (experienced rep)",
  "I've worked in beverage / CPG sales before",
];

const availabilityOptions = [
  "Weekdays only",
  "Weekends only",
  "Weekdays + weekends",
  "Evenings / nights",
  "Flexible — I can work around activation needs",
];

export default function BrandAmbassadorApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    market: "",
    experience: "",
    availability: "",
    message: "",
    age: false,
    transport: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname",                   value: form.firstName },
              { name: "lastname",                    value: form.lastName },
              { name: "email",                       value: form.email },
              { name: "phone",                       value: form.phone },
              { name: "your_market",              value: form.market },
              { name: "brand_ambassador_experience", value: form.experience },
              { name: "typical_availability",        value: form.availability },
              { name: "about",                       value: form.message },
              { name: "age",                       value: form.age },
              { name: "transport",                       value: form.transport },
            ],
            context: {
              pageUri: "https://www.greenlineactivations.com/brand-ambassador-application",
              pageName: "Brand Ambassador Application",
            },
          }),
        }
      );

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  if (submitted) {
    return (
      <div className="section text-center">
        <div className="container-lg max-w-lg">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-dark mb-4">Application Received!</h1>
          <p className="font-body text-gray-600 text-lg leading-relaxed mb-8">
            Thanks, {form.firstName}! Qualified applicants are contacted for a brief intro call.
            If there&apos;s a fit for upcoming activations in your area, we&apos;ll reach out to schedule a short call and discuss next steps.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ambassador-rewards-program" className="btn-primary">
              Preview the Rewards Program
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="section bg-cream">
        <div className="container-lg">
          <div className="max-w-2xl">
            <span className="tag mb-4">Apply Now</span>
            <h1 className="text-5xl font-bold text-dark mt-4 mb-6 leading-tight">
              Join the <span className="text-green">Activation Crew</span>
            </h1>
            <p className="text-xl font-body text-gray-600 leading-relaxed">
              Fill out the form below. Qualified applicants are contacted for a brief intro call —
              we move fast when there&apos;s a fit.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container-lg max-w-2xl">
          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-sans font-semibold text-sm text-dark block mb-2">First Name *</label>
                <input
                  type="text" name="firstName" required value={form.firstName} onChange={handleChange}
                  placeholder="Jane"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                />
              </div>
              <div>
                <label className="font-sans font-semibold text-sm text-dark block mb-2">Last Name *</label>
                <input
                  type="text" name="lastName" required value={form.lastName} onChange={handleChange}
                  placeholder="Smith"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="font-sans font-semibold text-sm text-dark block mb-2">Email Address *</label>
              <input
                type="email" name="email" required value={form.email} onChange={handleChange}
                placeholder="jane@email.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-sans font-semibold text-sm text-dark block mb-2">Phone Number *</label>
              <input
                type="tel" name="phone" required value={form.phone} onChange={handleChange}
                placeholder="(555) 555-5555"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              />
            </div>

            {/* Market */}
            <div>
              <label className="font-sans font-semibold text-sm text-dark block mb-2">Your Market *</label>
              <select
                name="market" required value={form.market} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent bg-white"
              >
                <option value="">Select your city</option>
                {marketsByRegion.map(({ region, cities }) => (
                  <optgroup key={region} label={region}>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                ))}
                <option value="Other">Other (not listed)</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="font-sans font-semibold text-sm text-dark block mb-2">Brand Ambassador Experience</label>
              <select
                name="experience" value={form.experience} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent bg-white"
              >
                <option value="">Select your experience level</option>
                {experienceOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="font-sans font-semibold text-sm text-dark block mb-2">Availability *</label>
              <select
                name="availability" required value={form.availability} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent bg-white"
              >
                <option value="">When can you work?</option>
                {availabilityOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="font-sans font-semibold text-sm text-dark block mb-2">Tell us about yourself (optional)</label>
              <textarea
                name="message" value={form.message} onChange={handleChange}
                rows={4}
                placeholder="Any relevant experience, brands you've worked with, or why you want to join the Greenline crew..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent resize-none"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" name="age" checked={form.age} onChange={handleChange} required
                  className="mt-0.5 accent-green flex-shrink-0"
                />
                <span className="font-body text-sm text-dark">I confirm I am 21 years of age or older *</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" name="transport" checked={form.transport} onChange={handleChange} required
                  className="mt-0.5 accent-green flex-shrink-0"
                />
                <span className="font-body text-sm text-dark">I have reliable transportation to reach activation locations *</span>
              </label>
            </div>

            {error && (
              <p className="text-sm font-body text-coral text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>

            <p className="text-xs font-body text-gray-400 text-center">
              By submitting, you agree to be contacted by Greenline Activations regarding ambassador opportunities.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

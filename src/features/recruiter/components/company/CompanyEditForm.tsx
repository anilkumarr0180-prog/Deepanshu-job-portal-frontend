import { useState, useEffect, type FormEvent } from "react";
import type { CompanyResponse, CompanyPayload } from "../../api/company.api";

interface CompanyEditFormProps {
  company?: CompanyResponse | null;
  isSubmitting?: boolean;
  onSubmit: (values: CompanyPayload) => void;
  onCancel: () => void;
}

export default function CompanyEditForm({
  company,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: CompanyEditFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    logo: "",
    industry: "",
    companySize: "11-50",
    foundedYear: new Date().getFullYear(),
    email: "",
    phone: "",
    location: "",
    city: "",
    state: "",
    country: "",
    linkedin: "",
    twitter: "",
    github: "",
  });

  useEffect(() => {
    if (company) {
      queueMicrotask(() => {
        setForm({
          name: company.name || "",
          description: company.description || company.overview || company.about || "",
          website: company.website || "",
          logo: company.logo || "",
          industry: company.industry || "",
          companySize: company.companySize || "11-50",
          foundedYear: company.foundedYear ? Number(company.foundedYear) : new Date().getFullYear(),
          email: company.email || "",
          phone: company.phone || "",
          location: company.location || "",
          city: company.city || "",
          state: company.state || "",
          country: company.country || "",
          linkedin: company.socialLinks?.linkedin || "",
          twitter: company.socialLinks?.twitter || "",
          github: company.socialLinks?.github || "",
        });
      });
    }
  }, [company]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload: CompanyPayload = {
      name: form.name,
      description: form.description.length >= 10 ? form.description : `${form.name} is a leading organization in the industry offering exciting career opportunities.`,
      logo: form.logo || undefined,
      website: form.website || undefined,
      industry: form.industry || undefined,
      companySize: form.companySize || undefined,
      foundedYear: Number(form.foundedYear) || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      location: form.location || undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      country: form.country || undefined,
      socialLinks: {
        linkedin: form.linkedin || undefined,
        twitter: form.twitter || undefined,
        github: form.github || undefined,
        website: form.website || undefined,
      },
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Branding Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-lg font-semibold text-slate-900">Visual Branding & Logo</h3>
          <p className="mt-1 text-sm text-slate-500">Provide your logo URL and basic branding details.</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Logo Image URL
            </label>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
              placeholder="https://example.com/logo.png"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Official Website URL
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
              placeholder="https://example.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* Core Company Details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-lg font-semibold text-slate-900">Company Details</h3>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Acme Corporation"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Industry
            </label>
            <input
              type="text"
              value={form.industry}
              onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
              placeholder="e.g. Information Technology"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Company Description / Overview (At least 10 characters) *
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your company mission, culture, and products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Company Size
            </label>
            <select
              value={form.companySize}
              onChange={(e) => setForm((prev) => ({ ...prev, companySize: e.target.value }))}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            >
              <option value="1-10">1-10 Employees</option>
              <option value="11-50">11-50 Employees</option>
              <option value="51-200">51-200 Employees</option>
              <option value="201-500">201-500 Employees</option>
              <option value="500+">500+ Employees</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Founded Year
            </label>
            <input
              type="number"
              min={1800}
              max={new Date().getFullYear()}
              value={form.foundedYear}
              onChange={(e) => setForm((prev) => ({ ...prev, foundedYear: Number(e.target.value) }))}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Contact Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="contact@company.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              HQ Location / Address
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. San Francisco, CA"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-lg font-semibold text-slate-900">Social Profiles</h3>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={form.linkedin}
              onChange={(e) => setForm((prev) => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/company/acme"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Twitter / X URL
            </label>
            <input
              type="url"
              value={form.twitter}
              onChange={(e) => setForm((prev) => ({ ...prev, twitter: e.target.value }))}
              placeholder="https://twitter.com/acme"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* Form Action Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#3C65F5] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving Company Profile..." : "Save Company Profile"}
        </button>
      </div>
    </form>
  );
}

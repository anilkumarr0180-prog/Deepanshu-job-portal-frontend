import { useState } from "react";

import type { RecruiterCompanyProfile } from "../../types";

interface CompanyEditFormProps {
  profile: RecruiterCompanyProfile;
}

export default function CompanyEditForm({ profile }: CompanyEditFormProps) {
  const [form, setForm] = useState(profile);

  const updateField = <K extends keyof RecruiterCompanyProfile>(field: K, value: RecruiterCompanyProfile[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-lg font-semibold text-slate-900">Branding</h3>
          <p className="mt-1 text-sm text-slate-500">Update the visual identity and core brand text.</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Company logo upload placeholder
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Company banner upload placeholder
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-lg font-semibold text-slate-900">Company Information</h3>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Company Name</span>
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Tagline</span>
            <input value={form.tagline} onChange={(event) => updateField("tagline", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600 md:col-span-2">
            <span className="mb-2 block font-medium text-slate-700">Overview</span>
            <textarea value={form.overview} onChange={(event) => updateField("overview", event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600 md:col-span-2">
            <span className="mb-2 block font-medium text-slate-700">About Company</span>
            <textarea value={form.about} onChange={(event) => updateField("about", event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Industry</span>
            <input value={form.industry} onChange={(event) => updateField("industry", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Website</span>
            <input value={form.website} onChange={(event) => updateField("website", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Email</span>
            <input value={form.email} onChange={(event) => updateField("email", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Phone</span>
            <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Location</span>
            <input value={form.location} onChange={(event) => updateField("location", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Company Size</span>
            <input value={form.size} onChange={(event) => updateField("size", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Founded Year</span>
            <input value={form.foundedYear} onChange={(event) => updateField("foundedYear", event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
          <label className="text-sm text-slate-600 md:col-span-2">
            <span className="mb-2 block font-medium text-slate-700">Social Links</span>
            <input value={form.socialLinks.join(", ")} onChange={(event) => updateField("socialLinks", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white" />
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
        <button type="button" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Cancel
        </button>
        <button type="button" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          Save Changes
        </button>
      </div>
    </div>
  );
}

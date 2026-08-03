import type { RecruiterCompanyProfile } from "../../types";

interface CompanyProfileDetailsProps {
  profile: RecruiterCompanyProfile;
}

export default function CompanyProfileDetails({ profile }: CompanyProfileDetailsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Company Details</h3>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Location</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{profile.location}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Company Size</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{profile.size}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Founded</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{profile.foundedYear}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Social Links</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{profile.socialLinks.join(", ")}</p>
        </div>
      </div>
    </section>
  );
}

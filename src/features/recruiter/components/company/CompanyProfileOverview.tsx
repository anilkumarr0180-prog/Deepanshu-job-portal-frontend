import type { RecruiterCompanyProfile } from "../../types";

interface CompanyProfileOverviewProps {
  profile: RecruiterCompanyProfile;
}

export default function CompanyProfileOverview({ profile }: CompanyProfileOverviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Company Overview</h3>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 text-sm leading-7 text-slate-600">
          <p>{profile.overview}</p>
          <p>{profile.about}</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <div>
            <p className="font-medium text-slate-500">Industry</p>
            <p className="mt-1 font-semibold text-slate-900">{profile.industry}</p>
          </div>
          <div>
            <p className="font-medium text-slate-500">Website</p>
            <p className="mt-1 font-semibold text-slate-900">{profile.website}</p>
          </div>
          <div>
            <p className="font-medium text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-900">{profile.email}</p>
          </div>
          <div>
            <p className="font-medium text-slate-500">Phone</p>
            <p className="mt-1 font-semibold text-slate-900">{profile.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

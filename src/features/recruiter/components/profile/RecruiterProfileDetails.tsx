import type { RecruiterProfileData } from "../../types";

interface RecruiterProfileDetailsProps {
  profile: RecruiterProfileData;
}

export default function RecruiterProfileDetails({ profile }: RecruiterProfileDetailsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Profile Details</h3>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Skills</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Social Links</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {profile.socialLinks.map((link) => (
              <p key={link}>{link}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

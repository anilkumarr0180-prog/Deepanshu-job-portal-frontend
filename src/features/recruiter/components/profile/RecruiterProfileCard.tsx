import type { RecruiterProfileData } from "../../types";

interface RecruiterProfileCardProps {
  profile: RecruiterProfileData;
}

export default function RecruiterProfileCard({ profile }: RecruiterProfileCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{profile.position}</p>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {profile.bio}
        </div>
      </div>
    </section>
  );
}

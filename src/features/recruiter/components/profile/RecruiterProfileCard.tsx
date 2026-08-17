import type { BackendProfile } from "@/features/candidate/api/profile.api";
import { UserAvatar } from "@/shared/components/UserAvatar";

interface RecruiterProfileCardProps {
  profile: BackendProfile;
}

export default function RecruiterProfileCard({ profile }: RecruiterProfileCardProps) {
  const companyName =
    typeof profile.companyId === "object" && profile.companyId !== null
      ? profile.companyId.name
      : profile.companyId;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <UserAvatar src={profile.profilePicture} name={profile.name} size="lg" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{profile.name}</h2>
            {profile.designation && (
              <p className="mt-1 text-sm font-medium text-[#3C65F5]">{profile.designation}</p>
            )}
            {profile.department && (
              <p className="text-xs text-slate-500">{profile.department}</p>
            )}
            {companyName && (
              <p className="mt-1 text-xs font-semibold text-slate-700">Company: {String(companyName)}</p>
            )}
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>{profile.email}</p>
              {profile.phone && <p>{profile.phone}</p>}
            </div>
          </div>
        </div>

        {profile.bio ? (
          <div className="max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {profile.bio}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-400">
            No bio provided yet.
          </div>
        )}
      </div>
    </section>
  );
}

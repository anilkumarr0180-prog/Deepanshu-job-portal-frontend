import type { BackendProfile } from "@/features/candidate/api/profile.api";
import { Globe, Building2, Briefcase } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface RecruiterProfileDetailsProps {
  profile: BackendProfile;
}

export default function RecruiterProfileDetails({ profile }: RecruiterProfileDetailsProps) {
  const companyName =
    typeof profile.companyId === "object" && profile.companyId !== null
      ? profile.companyId.name
      : profile.companyId || "Not specified";

  const social = profile.socialLinks || {};

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Recruiter Details</h3>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Department & Organization</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-400" />
              <span className="font-medium">Designation:</span> {profile.designation || "Not provided"}
            </p>
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="font-medium">Department:</span> {profile.department || "Not provided"}
            </p>
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="font-medium">Company:</span> {String(companyName)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Social & External Links</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {social.linkedin ? (
              <a href={social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
            ) : null}
            {social.twitter ? (
              <a href={social.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sky-500 hover:underline">
                <TwitterIcon className="h-4 w-4" /> Twitter
              </a>
            ) : null}
            {social.website ? (
              <a href={social.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-600 hover:underline">
                <Globe className="h-4 w-4" /> Website
              </a>
            ) : null}
            {!social.linkedin && !social.twitter && !social.website && (
              <p className="text-xs text-slate-400">No social links added</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

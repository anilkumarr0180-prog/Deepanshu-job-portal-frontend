import { CheckCircle2 } from "lucide-react";

import type { CandidateProfileCompletion } from "../types";

interface ProfileCompletionCardProps {
  profile: CandidateProfileCompletion;
}

export default function ProfileCompletionCard({ profile }: ProfileCompletionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Profile completion</h3>
          <p className="mt-1 text-sm text-slate-500">Strengthen your profile to unlock better matches</p>
        </div>
        <div className="text-3xl font-semibold text-slate-900">{profile.percentage}%</div>
      </div>

      <div className="mt-5 h-2.5 rounded-full bg-slate-100">
        <div className="h-2.5 rounded-full bg-slate-900" style={{ width: `${profile.percentage}%` }} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Completed</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {profile.completed.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Remaining</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {profile.remaining.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

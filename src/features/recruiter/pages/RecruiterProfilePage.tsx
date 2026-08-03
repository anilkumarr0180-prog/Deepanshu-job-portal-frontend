import { Edit3 } from "lucide-react";

import RecruiterProfileCard from "../components/profile/RecruiterProfileCard";
import RecruiterProfileDetails from "../components/profile/RecruiterProfileDetails";
import RecruiterProfileStats from "../components/profile/RecruiterProfileStats";
import { recruiterProfileData } from "../constants/company";

export default function RecruiterProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Recruiter Profile</h2>
            <p className="mt-2 text-sm text-slate-500">Keep your public profile and recruiting details up to date.</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <RecruiterProfileCard profile={recruiterProfileData} />
      <RecruiterProfileStats profile={recruiterProfileData} />
      <RecruiterProfileDetails profile={recruiterProfileData} />
    </div>
  );
}

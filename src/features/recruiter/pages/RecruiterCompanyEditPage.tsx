import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import CompanyEditForm from "../components/company/CompanyEditForm";
import { recruiterCompanyProfile } from "../constants/company";

export default function RecruiterCompanyEditPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/recruiter/company" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Back to company profile
            </Link>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Edit Company Profile</h2>
            <p className="mt-2 text-sm text-slate-500">Update the public company profile for your hiring team.</p>
          </div>
        </div>
      </div>

      <CompanyEditForm profile={recruiterCompanyProfile} />
    </div>
  );
}

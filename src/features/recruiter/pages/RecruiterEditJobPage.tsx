import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import CreateJobForm from "../components/CreateJobForm";
import { recruiterJobDetails } from "../constants/recruiterJobDetails";

export default function RecruiterEditJobPage() {
  const initialValues = {
    title: recruiterJobDetails.title,
    category: recruiterJobDetails.category,
    employmentType: recruiterJobDetails.employmentType,
    experienceLevel: recruiterJobDetails.experienceLevel,
    country: "United States",
    state: "California",
    city: "San Francisco",
    remote: recruiterJobDetails.remote,
    currency: "USD",
    minSalary: "140000",
    maxSalary: "180000",
    salaryType: "Yearly",
    description: recruiterJobDetails.description.join("\n\n"),
    requirements: recruiterJobDetails.requirements.join("\n"),
    skills: recruiterJobDetails.skills,
    deadline: "2025-09-30",
    vacancies: recruiterJobDetails.vacancies.toString(),
    status: recruiterJobDetails.status,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Link
              to={`/recruiter/jobs/${recruiterJobDetails.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to details
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">Edit Job</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  {recruiterJobDetails.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Last updated {recruiterJobDetails.lastUpdated}</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <CreateJobForm
          initialValues={initialValues}
          cancelLabel="Cancel"
          draftLabel="Save Draft"
          submitLabel="Save Changes"
          onCancel={() => undefined}
          onSaveDraft={() => undefined}
          onSubmit={() => undefined}
        />
      </div>
    </div>
  );
}

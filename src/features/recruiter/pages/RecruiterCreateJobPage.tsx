import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Building, ArrowRight } from "lucide-react";

import CreateJobForm from "../components/CreateJobForm";
import type { CreateJobPayload } from "@/features/jobs/api/jobs.api";
import { useCreateJob } from "@/features/jobs/hooks/useCreateJob";
import { useCompany } from "../hooks/useCompany";

export default function RecruiterCreateJobPage() {
  const navigate = useNavigate();
  const createMutation = useCreateJob();
  const { data: company, isLoading: isLoadingCompany } = useCompany();

  const handleSubmit = (values: CreateJobPayload) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/recruiter/jobs");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Create New Job</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Fill in the information below to publish a new job posting.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/recruiter/jobs"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>

      {/* Enterprise Proactive Verification Status Banners */}
      {!isLoadingCompany && !company && (
        <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-xs">
          <Building className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-900">Company Profile Required</h3>
            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
              You must set up a company profile before publishing job postings on JobBox.
            </p>
          </div>
          <Link
            to="/recruiter/company/edit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition"
          >
            Setup Company
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {!isLoadingCompany && company && company.isVerified === false && (
        <div className="flex items-start gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-xs">
          <AlertTriangle className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-blue-900">Company Verification Notice</h3>
            <p className="mt-1 text-xs text-blue-700 leading-relaxed">
              Your company profile <strong>"{company.name}"</strong> is currently undergoing verification.
              In development mode, your company will be auto-verified when publishing. In production, active jobs require verification approval, but you can save your posting as a <strong>Draft</strong> anytime.
            </p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <CreateJobForm
          initialValues={{ company: company?.name || "" }}
          onCancel={() => navigate("/recruiter/jobs")}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}

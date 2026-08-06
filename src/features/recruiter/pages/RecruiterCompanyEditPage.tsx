import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import CompanyEditForm from "../components/company/CompanyEditForm";
import { useCompany, useUpdateCompany, useCreateCompany } from "../hooks/useCompany";
import type { CompanyPayload } from "../api/company.api";

export default function RecruiterCompanyEditPage() {
  const navigate = useNavigate();
  const { data: company, isLoading } = useCompany();
  const updateCompanyMutation = useUpdateCompany();
  const createCompanyMutation = useCreateCompany();

  const isSubmitting = updateCompanyMutation.isPending || createCompanyMutation.isPending;

  const handleSubmit = (values: CompanyPayload) => {
    if (company) {
      updateCompanyMutation.mutate(values, {
        onSuccess: () => navigate("/recruiter/company"),
      });
    } else {
      createCompanyMutation.mutate(values, {
        onSuccess: () => navigate("/recruiter/company"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              to="/recruiter/company"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to company profile
            </Link>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              {company ? "Edit Company Profile" : "Create Company Profile"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {company
                ? "Update the public company profile for your hiring team."
                : "Build your organization's public company profile."}
            </p>
          </div>
        </div>
      </div>

      <CompanyEditForm
        company={company}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/recruiter/company")}
      />
    </div>
  );
}

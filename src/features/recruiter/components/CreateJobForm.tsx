import { useMemo, useState } from "react";

import FormActions from "./FormActions";
import JobBasicInformation from "./JobBasicInformation";
import JobDescriptionSection from "./JobDescriptionSection";
import JobLocationSection from "./JobLocationSection";
import JobRequirementsSection from "./JobRequirementsSection";
import JobSalarySection from "./JobSalarySection";
import JobSettingsSection from "./JobSettingsSection";

interface CreateJobFormProps {
  onCancel?: () => void;
  initialValues?: Partial<CreateJobFormState>;
  cancelLabel?: string;
  draftLabel?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  onSaveDraft?: () => void;
}

export interface CreateJobFormState {
  title: string;
  category: string;
  employmentType: string;
  experienceLevel: string;
  country: string;
  state: string;
  city: string;
  remote: boolean;
  currency: string;
  minSalary: string;
  maxSalary: string;
  salaryType: string;
  description: string;
  requirements: string;
  skills: string[];
  deadline: string;
  vacancies: string;
  status: string;
}

const initialState: CreateJobFormState = {
  title: "",
  category: "Engineering",
  employmentType: "Full-time",
  experienceLevel: "Mid",
  country: "",
  state: "",
  city: "",
  remote: false,
  currency: "USD",
  minSalary: "",
  maxSalary: "",
  salaryType: "Yearly",
  description: "",
  requirements: "",
  skills: ["React", "TypeScript"],
  deadline: "",
  vacancies: "1",
  status: "Active",
};

export default function CreateJobForm({
  onCancel,
  initialValues,
  cancelLabel,
  draftLabel,
  submitLabel,
  onSubmit,
  onSaveDraft,
}: CreateJobFormProps) {
  const initialFormState = useMemo<CreateJobFormState>(() => ({ ...initialState, ...initialValues }), [initialValues]);
  const [form, setForm] = useState<CreateJobFormState>(initialFormState);

  const updateField = <K extends keyof CreateJobFormState>(field: K, value: CreateJobFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <JobBasicInformation
        title={form.title}
        category={form.category}
        employmentType={form.employmentType}
        experienceLevel={form.experienceLevel}
        onTitleChange={(value) => updateField("title", value)}
        onCategoryChange={(value) => updateField("category", value)}
        onEmploymentTypeChange={(value) => updateField("employmentType", value)}
        onExperienceLevelChange={(value) => updateField("experienceLevel", value)}
      />

      <JobLocationSection
        country={form.country}
        state={form.state}
        city={form.city}
        remote={form.remote}
        onCountryChange={(value) => updateField("country", value)}
        onStateChange={(value) => updateField("state", value)}
        onCityChange={(value) => updateField("city", value)}
        onRemoteChange={(value) => updateField("remote", value)}
      />

      <JobSalarySection
        currency={form.currency}
        minSalary={form.minSalary}
        maxSalary={form.maxSalary}
        salaryType={form.salaryType}
        onCurrencyChange={(value) => updateField("currency", value)}
        onMinSalaryChange={(value) => updateField("minSalary", value)}
        onMaxSalaryChange={(value) => updateField("maxSalary", value)}
        onSalaryTypeChange={(value) => updateField("salaryType", value)}
      />

      <JobDescriptionSection
        description={form.description}
        onDescriptionChange={(value) => updateField("description", value)}
      />

      <JobRequirementsSection
        requirements={form.requirements}
        onRequirementsChange={(value) => updateField("requirements", value)}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
          <p className="mt-1 text-sm text-slate-500">Add the key capabilities and technologies for this role.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {form.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
          <input
            aria-label="Add skill"
            placeholder="Add skill"
            className="h-12 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-slate-400"
          />
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            + Add Skill
          </button>
        </div>
      </section>

      <JobSettingsSection
        deadline={form.deadline}
        vacancies={form.vacancies}
        status={form.status}
        onDeadlineChange={(value) => updateField("deadline", value)}
        onVacanciesChange={(value) => updateField("vacancies", value)}
        onStatusChange={(value) => updateField("status", value)}
      />

      <FormActions
        onCancel={onCancel ?? (() => undefined)}
        onSaveDraft={onSaveDraft ?? (() => undefined)}
        onPublish={onSubmit ?? (() => undefined)}
        cancelLabel={cancelLabel}
        draftLabel={draftLabel}
        submitLabel={submitLabel}
      />
    </div>
  );
}

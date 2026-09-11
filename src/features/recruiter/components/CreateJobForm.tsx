import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";

import type { CreateJobPayload } from "@/features/jobs/api/jobs.api";
import AiJobGeneratorModal from "@/features/ai/components/AiJobGeneratorModel";

import FormActions from "./FormActions";
import JobBasicInformation from "./JobBasicInformation";
import JobDescriptionSection from "./JobDescriptionSection";
import JobLocationSection from "./JobLocationSection";
import JobSalarySection from "./JobSalarySection";
import JobSettingsSection from "./JobSettingsSection";

interface CreateJobFormProps {
  onCancel?: () => void;
  initialValues?: Partial<CreateJobFormState>;
  cancelLabel?: string;
  draftLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit?: (values: CreateJobPayload) => void;
  onSaveDraft?: () => void;
}

export interface CreateJobFormState {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  description: string;
  skills: string[];
  status: string;
  minSalary: string;
  maxSalary: string;
}

const initialState: CreateJobFormState = {
  title: "",
  company: "",
  location: "",
  employmentType: "Full Time",
  experienceLevel: "3-5 Years",
  description: "",
  skills: [],
  status: "ACTIVE",
  minSalary: "",
  maxSalary: "",
};

const getInitialStateWithDefaults = (): CreateJobFormState => {
  let defaultType = "Full Time";
  try {
    const saved = localStorage.getItem("jobbox_recruiter_hiring_defaults");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.defaultEmploymentType === "full-time") defaultType = "Full Time";
      else if (parsed.defaultEmploymentType === "part-time") defaultType = "Part Time";
      else if (parsed.defaultEmploymentType === "contract") defaultType = "Contract";
      else if (parsed.defaultEmploymentType === "internship") defaultType = "Internship";
      else if (parsed.defaultWorkMode === "remote") defaultType = "Remote";
    }
  } catch {
    // Fallback to default
  }

  return {
    ...initialState,
    employmentType: defaultType,
  };
};

export default function CreateJobForm({
  onCancel,
  initialValues,
  cancelLabel,
  draftLabel,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onSaveDraft,
}: CreateJobFormProps) {
  const initialFormState = useMemo<CreateJobFormState>(
    () => ({ ...getInitialStateWithDefaults(), ...initialValues }),
    [initialValues]
  );
  const [form, setForm] = useState<CreateJobFormState>(initialFormState);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const updateField = <K extends keyof CreateJobFormState>(field: K, value: CreateJobFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleApplyAiJob = (aiData: {
    title: string;
    description: string;
    skills: string[];
    experienceLevel: string;
    employmentType: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      title: aiData.title || prev.title,
      description: aiData.description || prev.description,
      skills: Array.from(new Set([...prev.skills, ...aiData.skills])),
      experienceLevel: aiData.experienceLevel || prev.experienceLevel,
      employmentType: aiData.employmentType || prev.employmentType,
    }));
    toast.success("AI generated details applied to form!");
  };

  const handleAddSkill = () => {
    const input = document.querySelector<HTMLInputElement>('input[aria-label="Add skill"]');
    if (input && input.value.trim()) {
      updateField("skills", [...form.skills, input.value.trim()]);
      input.value = "";
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateField("skills", form.skills.filter((skill) => skill !== skillToRemove));
  };

  const mapFormToPayload = (values: CreateJobFormState): CreateJobPayload => {
    const payload: CreateJobPayload = {
      title: values.title,
      description: values.description,
      company: values.company,
      location: values.location,
      salaryMin: Number(values.minSalary) || 0,
      salaryMax: Number(values.maxSalary) || 0,
      employmentType: values.employmentType,
      experienceLevel: values.experienceLevel,
      skills: values.skills,
    };

    if (values.status) {
      payload.status = values.status;
    }

    return payload;
  };

  const handlePublish = () => {
    if (!form.title.trim()) {
      toast.error("Please enter a Job Title for this position.");
      return;
    }
    const minVal = Number(form.minSalary);
    const maxVal = Number(form.maxSalary);
    if (form.minSalary && form.maxSalary && !isNaN(minVal) && !isNaN(maxVal) && maxVal > 0 && minVal > maxVal) {
      toast.error("Maximum salary must be greater than or equal to minimum salary.");
      return;
    }
    onSubmit?.(mapFormToPayload(form));
  };

  const handleSaveDraft = () => {
    onSaveDraft?.();
  };

  return (
    <div className="space-y-6">
      {/* ✨ AI Job Copilot Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-100 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Want to speed up job posting?</h4>
            <p className="text-xs text-slate-500">Let Gemini AI auto-generate description, requirements & skills in seconds.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition shrink-0 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          Auto-Fill with AI
        </button>
      </div>

      <JobBasicInformation
        title={form.title}
        company={form.company}
        employmentType={form.employmentType}
        experienceLevel={form.experienceLevel}
        onTitleChange={(value) => updateField("title", value)}
        onCompanyChange={(value) => updateField("company", value)}
        onEmploymentTypeChange={(value) => updateField("employmentType", value)}
        onExperienceLevelChange={(value) => updateField("experienceLevel", value)}
      />

      <JobLocationSection
        location={form.location}
        onLocationChange={(value) => updateField("location", value)}
      />

      <JobSalarySection
        minSalary={form.minSalary}
        maxSalary={form.maxSalary}
        onMinSalaryChange={(value) => updateField("minSalary", value)}
        onMaxSalaryChange={(value) => updateField("maxSalary", value)}
      />

      <JobDescriptionSection
        description={form.description}
        onDescriptionChange={(value) => updateField("description", value)}
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
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1.5 text-slate-500 hover:text-slate-700"
              >
                ×
              </button>
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
            onClick={handleAddSkill}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            + Add Skill
          </button>
        </div>
      </section>

      <JobSettingsSection
        status={form.status}
        onStatusChange={(value) => updateField("status", value)}
      />

      <FormActions
        onCancel={onCancel ?? (() => undefined)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        cancelLabel={cancelLabel}
        draftLabel={draftLabel}
        submitLabel={submitLabel}
        isSubmitting={isSubmitting}
      />

      {/* AI Copilot Modal */}
      <AiJobGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleApplyAiJob}
      />
    </div>
  );
}

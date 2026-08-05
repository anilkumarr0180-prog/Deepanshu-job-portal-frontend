const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

interface JobBasicInformationProps {
  title: string;
  company: string;
  employmentType: string;
  experienceLevel: string;
  onTitleChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onEmploymentTypeChange: (value: string) => void;
  onExperienceLevelChange: (value: string) => void;
}

export default function JobBasicInformation({
  title,
  company,
  employmentType,
  experienceLevel,
  onTitleChange,
  onCompanyChange,
  onEmploymentTypeChange,
  onExperienceLevelChange,
}: JobBasicInformationProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
        <p className="mt-1 text-sm text-slate-500">Provide the main details about this job opening.</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label htmlFor="job-title" className="text-sm text-slate-600">
          <span className="mb-2 flex items-center gap-1 font-medium text-slate-700">
            Job Title <span className="text-rose-500">*</span>
          </span>
          <input
            id="job-title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Senior Frontend Engineer"
            className={inputClassName}
          />
        </label>

        <label htmlFor="company" className="text-sm text-slate-600">
          <span className="mb-2 flex items-center gap-1 font-medium text-slate-700">
            Company <span className="text-rose-500">*</span>
          </span>
          <input
            id="company"
            value={company}
            onChange={(event) => onCompanyChange(event.target.value)}
            placeholder="Acme Inc."
            className={inputClassName}
          />
        </label>

        <label htmlFor="employment-type" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Employment Type</span>
          <select
            id="employment-type"
            value={employmentType}
            onChange={(event) => onEmploymentTypeChange(event.target.value)}
            className={inputClassName}
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </label>

        <label htmlFor="experience-level" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Experience Level</span>
          <select
            id="experience-level"
            value={experienceLevel}
            onChange={(event) => onExperienceLevelChange(event.target.value)}
            className={inputClassName}
          >
            <option value="Fresher">Fresher</option>
            <option value="1-2 Years">1-2 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </label>
      </div>
    </section>
  );
}

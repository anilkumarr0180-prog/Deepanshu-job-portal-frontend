const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

interface JobSalarySectionProps {
  minSalary: string;
  maxSalary: string;
  onMinSalaryChange: (value: string) => void;
  onMaxSalaryChange: (value: string) => void;
}

export default function JobSalarySection({
  minSalary,
  maxSalary,
  onMinSalaryChange,
  onMaxSalaryChange,
}: JobSalarySectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Salary</h3>
        <p className="mt-1 text-sm text-slate-500">Outline the compensation range.</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label htmlFor="min-salary" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Minimum Salary</span>
          <input
            id="min-salary"
            value={minSalary}
            onChange={(event) => onMinSalaryChange(event.target.value)}
            placeholder="120000"
            className={inputClassName}
          />
        </label>

        <label htmlFor="max-salary" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Maximum Salary</span>
          <input
            id="max-salary"
            value={maxSalary}
            onChange={(event) => onMaxSalaryChange(event.target.value)}
            placeholder="160000"
            className={inputClassName}
          />
        </label>
      </div>
    </section>
  );
}

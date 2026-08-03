const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

interface JobSettingsSectionProps {
  deadline: string;
  vacancies: string;
  status: string;
  onDeadlineChange: (value: string) => void;
  onVacanciesChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function JobSettingsSection({
  deadline,
  vacancies,
  status,
  onDeadlineChange,
  onVacanciesChange,
  onStatusChange,
}: JobSettingsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Settings</h3>
        <p className="mt-1 text-sm text-slate-500">Control publishing state and application timing.</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <label htmlFor="deadline" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Application Deadline</span>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(event) => onDeadlineChange(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label htmlFor="vacancies" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Number of Vacancies</span>
          <input
            id="vacancies"
            type="number"
            min="1"
            value={vacancies}
            onChange={(event) => onVacanciesChange(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label htmlFor="status" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Status</span>
          <select
            id="status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className={inputClassName}
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </label>
      </div>
    </section>
  );
}

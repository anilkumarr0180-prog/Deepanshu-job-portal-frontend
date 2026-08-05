interface ApplicantsFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  totalApplicants: number;
}

export default function ApplicantsFilters({
  statusFilter,
  onStatusChange,
  totalApplicants,
}: ApplicantsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Shortlisted', 'Interview', 'Rejected', 'Hired'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onStatusChange(option)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              statusFilter === option
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-500">Showing {totalApplicants} applicants</div>
    </div>
  );
}

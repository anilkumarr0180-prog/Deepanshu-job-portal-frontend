interface ApplicantsFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  totalApplicants: number;
}

export const APPLICANT_STATUS_OPTIONS = [
  "All",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Hired",
  "Rejected",
];

export default function ApplicantsFilters({
  statusFilter,
  onStatusChange,
  totalApplicants,
}: ApplicantsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {APPLICANT_STATUS_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onStatusChange(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === option
                ? "bg-[#3C65F5] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="text-xs font-semibold text-slate-500">
        Showing <span className="text-slate-900 font-bold">{totalApplicants}</span> candidates
      </div>
    </div>
  );
}

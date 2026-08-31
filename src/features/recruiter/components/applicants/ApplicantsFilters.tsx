interface ApplicantsFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  totalApplicants: number;
  statusCounts?: Record<string, number>;
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

const STATUS_COLOR_MAP: Record<string, { active: string; badge: string; inactiveBadge: string }> = {
  All: {
    active: "bg-[#3C65F5] text-white shadow-xs shadow-blue-500/25 ring-1 ring-[#3C65F5]",
    badge: "bg-white/20 text-white",
    inactiveBadge: "bg-slate-200/80 dark:bg-[#2A3850] text-slate-700 dark:text-slate-300",
  },
  Applied: {
    active: "bg-blue-600 text-white shadow-xs shadow-blue-500/25 ring-1 ring-blue-600",
    badge: "bg-white/20 text-white",
    inactiveBadge: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300",
  },
  "Under Review": {
    active: "bg-amber-500 text-white shadow-xs shadow-amber-500/25 ring-1 ring-amber-500",
    badge: "bg-white/20 text-white",
    inactiveBadge: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300",
  },
  Shortlisted: {
    active: "bg-purple-600 text-white shadow-xs shadow-purple-500/25 ring-1 ring-purple-600",
    badge: "bg-white/20 text-white",
    inactiveBadge: "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300",
  },
  Interview: {
    active: "bg-cyan-600 text-white shadow-xs shadow-cyan-500/25 ring-1 ring-cyan-600",
    badge: "bg-white/20 text-white",
    inactiveBadge: "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300",
  },
  Hired: {
    active: "bg-emerald-600 text-white shadow-xs shadow-emerald-500/25 ring-1 ring-emerald-600",
    badge: "bg-white/20 text-white",
    inactiveBadge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300",
  },
  Rejected: {
    active: "bg-rose-600 text-white shadow-xs shadow-rose-500/25 ring-1 ring-rose-600",
    badge: "bg-white/20 text-white",
    inactiveBadge: "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300",
  },
};

export default function ApplicantsFilters({
  statusFilter,
  onStatusChange,
  totalApplicants,
  statusCounts = {},
}: ApplicantsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 dark:border-[#2A3850] bg-white dark:bg-[#151F32] p-3 sm:p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between transition-colors">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {APPLICANT_STATUS_OPTIONS.map((option) => {
          const count = statusCounts[option] ?? (option === "All" ? totalApplicants : 0);
          const isActive = statusFilter === option;
          const style = STATUS_COLOR_MAP[option] || STATUS_COLOR_MAP.All;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onStatusChange(option)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? style.active
                  : "bg-slate-100/90 dark:bg-[#1B2639] text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-[#202D43] hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-[#2A3850]"
              }`}
            >
              <span>{option}</span>
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-black min-w-[18px] transition-colors ${
                  isActive ? style.badge : style.inactiveBadge
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
        Showing <span className="text-slate-900 dark:text-white font-bold">{totalApplicants}</span> candidates
      </div>
    </div>
  );
}

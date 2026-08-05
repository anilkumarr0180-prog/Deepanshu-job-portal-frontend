import { SearchSlash } from "lucide-react";

interface EmptyJobsProps {
  searchTerm?: string;
  hasActiveFilters?: boolean;
  onReset?: () => void;
}

export default function EmptyJobs({
  searchTerm,
  hasActiveFilters = false,
  onReset,
}: EmptyJobsProps) {
  const showSearchHint = Boolean(searchTerm);
  const showFilterHint = !searchTerm && hasActiveFilters;

  const message = showSearchHint
    ? `We couldn't find any jobs matching "${searchTerm}". Try adjusting your search or filters.`
    : showFilterHint
      ? "No jobs match your current filters. Try resetting some filters to broaden your search."
      : "We couldn't find any jobs at the moment. Check back later for new opportunities.";

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
        <SearchSlash className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        No jobs found
      </h3>

      <p className="mt-2 text-sm text-slate-500">{message}</p>

      {(searchTerm || hasActiveFilters) && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}

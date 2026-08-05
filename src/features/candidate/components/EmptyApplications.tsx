import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

interface EmptyApplicationsProps {
  searchTerm?: string;
  hasActiveFilters?: boolean;
  onReset?: () => void;
}

export default function EmptyApplications({
  searchTerm,
  hasActiveFilters = false,
  onReset,
}: EmptyApplicationsProps) {
  const showSearchHint = Boolean(searchTerm);
  const showFilterHint = !searchTerm && hasActiveFilters;

  const message = showSearchHint
    ? `We couldn't find any applications matching "${searchTerm}". Try adjusting your search or filters.`
    : showFilterHint
      ? "No applications match your current filters. Try resetting the filters to see all your applications."
      : "You haven't applied to any jobs yet. Browse opportunities and apply to get started.";

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
        <FileText className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        No applications found
      </h3>

      <p className="mt-2 text-sm text-slate-500">{message}</p>

      <p className="mt-6 text-sm text-slate-500">
            <Link
              to="/candidate/jobs"
              className="font-medium text-[#3C65F5] hover:underline"
            >
              Browse jobs
            </Link>
        {searchTerm && (
          <>
            {" "}
            ·{" "}
            <button
              type="button"
              onClick={onReset}
              className="font-medium text-[#3C65F5] hover:underline"
            >
              Reset filters
            </button>
          </>
        )}
      </p>
    </div>
  );
}

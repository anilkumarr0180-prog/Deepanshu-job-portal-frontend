import { Filter, Search } from "lucide-react";

import { APPLICATION_STATUS_OPTIONS } from "../constants";

interface AppliedJobsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default function AppliedJobsToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: AppliedJobsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by job title or company..."
          className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-11 pr-4 text-sm text-slate-700 dark:text-slate-200 outline-none transition focus:border-slate-400 dark:focus:border-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 placeholder:text-slate-400"
          aria-label="Search applications"
        />
      </div>

      <div className="sm:w-48">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-600 dark:text-slate-300">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full bg-transparent text-sm outline-none text-slate-700 dark:text-slate-200"
            aria-label="Filter by status"
          >
            {APPLICATION_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-slate-800 dark:text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

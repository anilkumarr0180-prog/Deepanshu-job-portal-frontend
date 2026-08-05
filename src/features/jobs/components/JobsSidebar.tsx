import { Filter, X } from "lucide-react";

import type { JobsFilterParams } from "../api/jobs.api";

interface JobsSidebarProps {
  filters: JobsFilterParams;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof JobsFilterParams, value: string) => void;
  onReset: () => void;
}

const selectClassName =
  "h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

const disabledClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-400";

export default function JobsSidebar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onReset,
}: JobsSidebarProps) {
  const activeCount = [
    filters.location,
    filters.employmentType,
    filters.experienceLevel,
    filters.status,
  ].filter(Boolean).length;

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600">
                {activeCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onReset}
            disabled={activeCount === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Keyword
            </label>
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Employment Type
            </label>
            <select
              value={filters.employmentType ?? ""}
              onChange={(e) => onFilterChange("employmentType", e.target.value)}
              className={selectClassName}
            >
              <option value="">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Experience Level
            </label>
            <select
              value={filters.experienceLevel ?? ""}
              onChange={(e) => onFilterChange("experienceLevel", e.target.value)}
              className={selectClassName}
            >
              <option value="">All Levels</option>
              <option value="Fresher">Fresher</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Status
            </label>
            <select
              value={filters.status ?? ""}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className={selectClassName}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <DisabledFilter label="Salary Range" />
        <DisabledFilter label="Company Size" />
        <DisabledFilter label="Benefits" />
        <DisabledFilter label="Remote" />
        <DisabledFilter label="Hybrid" />
        <DisabledFilter label="Job Posted" />
      </div>
    </aside>
  );
}

function DisabledFilter({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <div className={disabledClassName}>Coming Soon</div>
    </div>
  );
}

import { Filter, X } from "lucide-react";

import {
  EMPLOYMENT_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  SORT_OPTIONS,
} from "../constants";
import type { JobsFilterParams } from "../api/jobs.api";

interface JobFiltersProps {
  filters: JobsFilterParams;
  onChange: (key: keyof JobsFilterParams, value: string) => void;
  onReset: () => void;
}

const selectClassName =
  "h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

export default function JobFilters({
  filters,
  onChange,
  onReset,
}: JobFiltersProps) {
  const activeCount = [
    filters.location,
    filters.employmentType,
    filters.experienceLevel,
    filters.minSalary,
    filters.maxSalary,
    filters.sort,
  ].filter(Boolean).length;

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Location"
          value={filters.location ?? ""}
          onChange={(e) => onChange("location", e.target.value)}
          className={inputClassName}
        />

        <select
          value={filters.employmentType ?? ""}
          onChange={(e) => onChange("employmentType", e.target.value)}
          className={selectClassName}
        >
          {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filters.experienceLevel ?? ""}
          onChange={(e) => onChange("experienceLevel", e.target.value)}
          className={selectClassName}
        >
          {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min salary"
          min="0"
          value={filters.minSalary ?? ""}
          onChange={(e) => onChange("minSalary", e.target.value)}
          className={inputClassName}
        />

        <input
          type="number"
          placeholder="Max salary"
          min="0"
          value={filters.maxSalary ?? ""}
          onChange={(e) => onChange("maxSalary", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="mt-4">
        <select
          value={filters.sort ?? ""}
          onChange={(e) => onChange("sort", e.target.value)}
          className={selectClassName}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

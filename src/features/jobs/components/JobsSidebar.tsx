import { Check, Filter, MapPin, RotateCcw } from "lucide-react";

import type { JobsFilterParams } from "../api/jobs.api";

interface JobsSidebarProps {
  filters: JobsFilterParams;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof JobsFilterParams, value: string) => void;
  onReset: () => void;
}

const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Remote",
];

const EXPERIENCE_LEVELS = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];

const STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "CLOSED", label: "Closed" },
];

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#3C65F5] focus:bg-white focus:ring-2 focus:ring-[#3C65F5]/10";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-slate-800">
      {children}
    </h4>
  );
}

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

function FilterCheckbox({ label, checked, onClick }: FilterCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-2.5 rounded-md py-1 text-left text-sm text-slate-700 transition hover:text-[#3C65F5]"
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition ${
          checked
            ? "border-[#3C65F5] bg-[#3C65F5] text-white"
            : "border-slate-300 bg-white text-transparent group-hover:border-[#3C65F5]"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      <span>{label}</span>
    </button>
  );
}

function CheckboxGroup({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      {options.map((option) => (
        <FilterCheckbox
          key={option}
          label={option}
          checked={selected === option}
          onClick={() => onSelect(selected === option ? "" : option)}
        />
      ))}
    </div>
  );
}

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
    filters.minSalary,
    filters.maxSalary,
  ].filter(Boolean).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#3C65F5]" />
          <h3 className="text-[15px] font-bold text-[#05264E]">
            Advance Filter
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:text-[#3C65F5] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Sections */}
      <div className="divide-y divide-slate-100">
        <div className="p-5">
          <SectionTitle>Keyword</SectionTitle>
          <input
            type="text"
            placeholder="Search by keyword..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="p-5">
          <SectionTitle>Location</SectionTitle>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="City or country"
              value={filters.location ?? ""}
              onChange={(e) => onFilterChange("location", e.target.value)}
              className={`${inputClassName} pl-10`}
            />
          </div>
        </div>

        <div className="p-5">
          <SectionTitle>Employment Type</SectionTitle>
          <CheckboxGroup
            options={EMPLOYMENT_TYPES}
            selected={filters.employmentType ?? ""}
            onSelect={(value) => onFilterChange("employmentType", value)}
          />
        </div>

        <div className="p-5">
          <SectionTitle>Experience Level</SectionTitle>
          <CheckboxGroup
            options={EXPERIENCE_LEVELS}
            selected={filters.experienceLevel ?? ""}
            onSelect={(value) => onFilterChange("experienceLevel", value)}
          />
        </div>

        <div className="p-5">
          <SectionTitle>Salary Range</SectionTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minSalary ?? ""}
                onChange={(e) => onFilterChange("minSalary", e.target.value)}
                className={`${inputClassName} pl-7`}
              />
            </div>
            <span className="text-slate-400">–</span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxSalary ?? ""}
                onChange={(e) => onFilterChange("maxSalary", e.target.value)}
                className={`${inputClassName} pl-7`}
              />
            </div>
          </div>
        </div>

        <div className="p-5">
          <SectionTitle>Job Status</SectionTitle>
          <CheckboxGroup
            options={STATUSES.map((s) => s.label)}
            selected={
              STATUSES.find((s) => s.value === filters.status)?.label ?? ""
            }
            onSelect={(label) => {
              const status = STATUSES.find((s) => s.label === label);
              onFilterChange("status", status ? status.value : "");
            }}
          />
        </div>
      </div>
    </div>
  );
}

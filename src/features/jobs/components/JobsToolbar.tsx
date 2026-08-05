import {
  ChevronDown,
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

interface JobsToolbarProps {
  startItem: number;
  endItem: number;
  totalItems: number;
  activeFilterCount: number;
  sort: string;
  onSortChange: (value: string) => void;
  limit: number;
  onLimitChange: (value: number) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onReset: () => void;
  onOpenFilters: () => void;
}

const SHOW_OPTIONS = [9, 12, 18, 24];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "salary-high", label: "Highest Salary" },
  { value: "salary-low", label: "Lowest Salary" },
];

const selectClassName =
  "h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#3C65F5] focus:ring-2 focus:ring-[#3C65F5]/10";

function SelectCaret() {
  return (
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  );
}

export default function JobsToolbar({
  startItem,
  endItem,
  totalItems,
  activeFilterCount,
  sort,
  onSortChange,
  limit,
  onLimitChange,
  viewMode,
  onViewModeChange,
  onReset,
  onOpenFilters,
}: JobsToolbarProps) {
  const viewBtn = (active: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-xl border transition ${
      active
        ? "border-[#3C65F5] bg-[#3C65F5] text-white"
        : "border-slate-200 bg-white text-slate-500 hover:border-[#3C65F5] hover:text-[#3C65F5]"
    }`;

  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Advance Filter + Reset */}
      <div className="flex w-full items-center justify-between gap-3 lg:w-[250px] lg:shrink-0">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex items-center gap-2 text-[17px] font-bold text-[#05264E] transition hover:text-[#3C65F5]"
        >
          <SlidersHorizontal className="h-5 w-5 -scale-x-100" />
          Advance Filter
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#3C65F5] px-1.5 text-[11px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-[#3C65F5]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Center: Jobs count */}
      {totalItems > 0 && (
        <p className="text-[15px] font-medium text-[#66789C]">
          Showing {startItem.toLocaleString()}–{endItem.toLocaleString()} of{" "}
          {totalItems.toLocaleString()} Jobs
        </p>
      )}

      {/* Right: Show / Sort By / View toggle */}
      <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
        {/* Show */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#66789C]">Show</span>
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className={selectClassName}
            >
              {SHOW_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <SelectCaret />
          </div>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#66789C]">Sort By</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className={selectClassName}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <SelectCaret />
          </div>
        </div>

        {/* View toggle */}
        <div className="ml-2 flex items-center gap-1">
          <button
            type="button"
            aria-label="List view"
            title="List view"
            onClick={() => onViewModeChange("list")}
            className={viewBtn(viewMode === "list")}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Grid view"
            title="Grid view"
            onClick={() => onViewModeChange("grid")}
            className={viewBtn(viewMode === "grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

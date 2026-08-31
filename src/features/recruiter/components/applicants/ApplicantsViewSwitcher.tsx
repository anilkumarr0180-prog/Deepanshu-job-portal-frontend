import { LayoutGrid, TableProperties } from "lucide-react";

export type ApplicantsViewMode = "kanban" | "table";

interface ApplicantsViewSwitcherProps {
  viewMode: ApplicantsViewMode;
  onViewModeChange: (mode: ApplicantsViewMode) => void;
}

export default function ApplicantsViewSwitcher({
  viewMode,
  onViewModeChange,
}: ApplicantsViewSwitcherProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200/80 dark:border-[#2A3850] bg-slate-100/90 dark:bg-[#1B2639] p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onViewModeChange("kanban")}
        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
          viewMode === "kanban"
            ? "bg-white dark:bg-[#151F32] text-[#3C65F5] dark:text-[#5E81FF] shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="Switch to Kanban Board View"
      >
        <LayoutGrid className="h-4 w-4" />
        <span>Kanban Board</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange("table")}
        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
          viewMode === "table"
            ? "bg-white dark:bg-[#151F32] text-[#3C65F5] dark:text-[#5E81FF] shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="Switch to Table List View"
      >
        <TableProperties className="h-4 w-4" />
        <span>Table List</span>
      </button>
    </div>
  );
}

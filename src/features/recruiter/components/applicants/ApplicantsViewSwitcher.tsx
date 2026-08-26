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
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onViewModeChange("kanban")}
        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
          viewMode === "kanban"
            ? "bg-white text-[#3C65F5] shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
        title="Switch to Kanban Board View"
      >
        <LayoutGrid className="h-4 w-4" />
        <span>Kanban Board</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange("table")}
        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
          viewMode === "table"
            ? "bg-white text-[#3C65F5] shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
        title="Switch to Table List View"
      >
        <TableProperties className="h-4 w-4" />
        <span>Table List</span>
      </button>
    </div>
  );
}

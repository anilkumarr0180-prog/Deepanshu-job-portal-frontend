import { Search } from "lucide-react";

interface ToolbarProps {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function Toolbar({ title, description, searchValue, onSearchChange }: ToolbarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <input
            aria-label="Search"
            className="w-full bg-transparent outline-none sm:w-56"
            placeholder="Search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

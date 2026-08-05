import { Search } from "lucide-react";

interface JobsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function JobsToolbar({
  searchValue,
  onSearchChange,
}: JobsToolbarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search job titles, companies, or keywords..."
        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        aria-label="Search jobs"
      />
    </div>
  );
}

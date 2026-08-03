import { Search } from "lucide-react";

interface ApplicantsPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ApplicantsPageHeader({ searchTerm, onSearchChange }: ApplicantsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Applicants</h2>
        <p className="mt-2 text-sm text-slate-500">Review and manage candidate applications from one place.</p>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search applicants"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
        />
      </div>
    </div>
  );
}

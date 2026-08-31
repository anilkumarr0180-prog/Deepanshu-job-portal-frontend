import { Search } from "lucide-react";

interface ApplicantsPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ApplicantsPageHeader({ searchTerm, onSearchChange }: ApplicantsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 dark:border-[#2A3850] bg-white dark:bg-[#151F32] p-5 sm:p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between transition-colors">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Applicants Pipeline</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">Review, track, and advance candidate applications across every stage.</p>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by candidate, job role, or skill..."
          className="h-10.5 w-full rounded-xl border border-slate-200/80 dark:border-[#2A3850] bg-slate-50/80 dark:bg-[#1B2639] pl-10 pr-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#3C65F5] dark:focus:border-[#5E81FF] focus:bg-white dark:focus:bg-[#151F32] focus:ring-2 focus:ring-[#3C65F5]/10"
        />
      </div>
    </div>
  );
}

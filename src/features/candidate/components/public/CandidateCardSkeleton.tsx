export default function CandidateCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-[16px] border border-[#E0E6F7] bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-[#131D2E]">
      <div>
        <div className="flex items-start gap-4">
          <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-1.5 h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-3.5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          <div className="h-6 w-14 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-12 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
      <div className="mt-4 border-t border-[#E0E6F7] pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

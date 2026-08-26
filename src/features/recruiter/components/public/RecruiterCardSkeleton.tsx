export default function RecruiterCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E0E6F7] bg-white p-4.5 sm:p-5 dark:border-[#1E293B] dark:bg-[#131D2E]">
      {/* Top: Logo + Info */}
      <div className="flex items-start gap-3.5">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="min-w-0 flex-1 space-y-2 pt-0.5">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Bottom: Location + Jobs */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}


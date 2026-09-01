export default function RecruiterCardSkeleton() {
  return (
    <div className="flex min-h-[290px] flex-col items-center justify-between rounded-2xl border border-[#E0E6F7] bg-white p-6 dark:border-[#1E293B] dark:bg-[#131D2E]">
      {/* Top: Centered Logo + Name + Rating + Location */}
      <div className="flex w-full flex-col items-center space-y-3">
        <div className="h-[56px] w-[56px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Bottom: Jobs Button Skeleton */}
      <div className="mt-5 w-full">
        <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

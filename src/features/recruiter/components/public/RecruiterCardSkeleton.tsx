export default function RecruiterCardSkeleton() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between rounded-[12px] border border-[rgba(6,18,36,0.1)] bg-white p-[22px_18px] dark:border-[#1E293B] dark:bg-[#131D2E]">
      {/* Top Header: Left Logo + Right Text Info */}
      <div className="flex w-full items-center">
        <div className="mr-[15px] h-[52px] w-[52px] shrink-0 animate-pulse rounded-[10px] bg-slate-200 dark:bg-slate-800" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Bottom Row: Location + Open Jobs Skeleton */}
      <div className="mt-5 flex w-full items-center justify-between">
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

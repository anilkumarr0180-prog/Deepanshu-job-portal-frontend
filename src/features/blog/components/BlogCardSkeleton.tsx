export default function BlogCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-white p-[10px] shadow-xs dark:border-slate-800 dark:bg-[#131D2E]">
      <div className="h-[210px] w-full animate-pulse rounded-[12px] bg-slate-200 dark:bg-slate-800" />

      <div className="flex flex-1 flex-col px-[10px] pb-[10px] pt-[15px]">
        {/* Category badge skeleton */}
        <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />

        {/* Title skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-5 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Description skeleton */}
        <div className="mt-3 space-y-1.5 flex-1">
          <div className="h-3.5 w-full animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-3.5 w-5/6 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>

        {/* Author bottom row */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1">
              <div className="h-3 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-2.5 w-12 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
          <div className="h-3 w-14 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

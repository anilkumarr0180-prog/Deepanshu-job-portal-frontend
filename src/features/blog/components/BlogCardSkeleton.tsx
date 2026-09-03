export default function BlogCardSkeleton() {
  return (
    <div className="relative flex h-[520px] md:h-[575px] w-full flex-col justify-end overflow-hidden rounded-[16px] bg-slate-200 dark:bg-slate-800 animate-pulse p-[24px] sm:p-[28px] md:p-[32px]">
      {/* Title Skeleton */}
      <div className="mb-[20px] space-y-2">
        <div className="h-7 w-full rounded-md bg-slate-300/80 dark:bg-slate-700" />
        <div className="h-7 w-4/5 rounded-md bg-slate-300/80 dark:bg-slate-700" />
      </div>

      {/* Author & Date Skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-300/80 dark:bg-slate-700" />
        <div className="h-4 w-24 rounded-md bg-slate-300/80 dark:bg-slate-700" />
        <div className="h-4 w-20 rounded-md bg-slate-300/60 dark:bg-slate-700/60" />
      </div>
    </div>
  );
}


export default function JobsOfDaySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[394.25px] w-full flex-col justify-between rounded-[8px] border border-[#E0E6F7] bg-white dark:border-[#2A3850] dark:bg-[#151F32]"
        >
          {/* Top-Right Badge placeholder */}
          <div className="absolute top-[22px] right-[20px]">
            <div className="h-[16px] w-[12px] animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Header */}
          <div className="flex items-center px-[20px] pt-[26px] pb-[6px]">
            <div className="flex min-w-0 flex-1 items-center gap-[14px] pr-6">
              <div className="h-[52px] w-[52px] shrink-0 animate-pulse rounded-[10px] bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-[15px] w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-[12px] w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between px-[20px] pb-[20px]">
            <div>
              <div className="h-[18px] w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-[8px] flex gap-3">
                <div className="h-[12px] w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-[12px] w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>

              <div className="mt-[15px] space-y-2">
                <div className="h-[14px] w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-[14px] w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-[14px] w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>

              <div className="mt-[16px] flex gap-[6px]">
                <div className="h-[24px] w-14 animate-pulse rounded-[4px] bg-slate-200 dark:bg-slate-700" />
                <div className="h-[24px] w-14 animate-pulse rounded-[4px] bg-slate-200 dark:bg-slate-700" />
                <div className="h-[24px] w-14 animate-pulse rounded-[4px] bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-[10px]">
              <div className="h-[18px] w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-[36px] w-[92px] animate-pulse rounded-[4px] bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

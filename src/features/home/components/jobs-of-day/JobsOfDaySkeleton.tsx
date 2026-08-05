export default function JobsOfDaySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="mt-4 flex gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

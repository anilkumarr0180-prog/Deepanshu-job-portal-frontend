export default function JobDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 border-b border-slate-200 pb-6">
          <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-5 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="h-5 w-1/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="space-y-2">
              <div className="h-5 w-1/4 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-16 animate-pulse rounded-full bg-slate-200"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full animate-pulse rounded bg-slate-200"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

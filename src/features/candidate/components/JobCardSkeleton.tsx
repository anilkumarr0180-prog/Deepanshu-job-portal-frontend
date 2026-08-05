export default function JobCardSkeleton() {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex-1">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
        </header>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-slate-200" />

        <div className="mb-4 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 animate-pulse rounded-full bg-slate-200"
            />
          ))}
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <footer className="mt-5 flex gap-3 border-t border-slate-200 pt-4">
        <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-200" />
      </footer>
    </article>
  );
}

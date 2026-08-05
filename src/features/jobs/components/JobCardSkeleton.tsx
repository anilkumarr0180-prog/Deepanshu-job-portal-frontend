export default function JobCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-slate-200" />
        <div className="min-w-0 flex-1">
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-6 w-24 animate-pulse rounded-md bg-slate-200" />
        <div className="h-6 w-20 animate-pulse rounded-md bg-slate-200" />
        <div className="ml-auto h-3 w-20 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-slate-200" />

      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-4 flex gap-1.5">
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
      </div>

      <footer className="mt-5 flex items-stretch gap-3 border-t border-slate-100 pt-4">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-200" />
      </footer>
    </div>
  );
}


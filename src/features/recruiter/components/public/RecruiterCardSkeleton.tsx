export default function RecruiterCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 animate-pulse rounded-2xl bg-slate-200" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="h-7 w-24 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

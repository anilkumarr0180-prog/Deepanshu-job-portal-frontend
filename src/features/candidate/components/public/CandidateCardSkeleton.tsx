export default function CandidateCardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs text-center">
      <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-6 w-28 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 h-9 w-full animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

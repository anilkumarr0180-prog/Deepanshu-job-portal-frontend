export default function ApplicantsPagination() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">Page 1 of 2</p>
      <div className="flex items-center gap-2">
        <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          Previous
        </button>
        <button type="button" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
          1
        </button>
        <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          2
        </button>
        <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          Next
        </button>
      </div>
    </div>
  );
}

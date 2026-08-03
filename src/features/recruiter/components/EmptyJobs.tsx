import { PlusCircle } from "lucide-react";

export default function EmptyJobs() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
        <PlusCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No jobs found</h3>
      <p className="mt-2 text-sm text-slate-500">Create your first job posting to get started.</p>
      <button
        type="button"
        className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Create Job
      </button>
    </div>
  );
}

import { Filter, Search, SortDesc } from "lucide-react";

export default function JobsToolbar() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search jobs"
          className="w-full border-none bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <Filter className="h-4 w-4" />
          <select className="bg-transparent outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Closed</option>
            <option>Paused</option>
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <SortDesc className="h-4 w-4" />
          <select className="bg-transparent outline-none">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Most Applicants</option>
          </select>
        </label>
      </div>
    </div>
  );
}

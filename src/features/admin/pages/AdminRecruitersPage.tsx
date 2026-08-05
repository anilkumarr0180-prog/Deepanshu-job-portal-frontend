import EmptyState from "../components/EmptyState";
import Toolbar from "../components/Toolbar";

export default function AdminRecruitersPage() {
  return (
    <div className="space-y-6">
      <Toolbar
        title="Recruiters"
        description="Review recruiter accounts, company activity, and moderation actions."
        searchValue=""
        onSearchChange={() => {}}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm opacity-60">
        <input
          aria-label="Search recruiters"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none sm:w-56"
          disabled
          placeholder="Search recruiters"
          readOnly
        />
        <select
          aria-label="Filter recruiters"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none"
          disabled
          value="All"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <EmptyState
        title="Recruiters management is not available"
        description="The backend does not currently expose a recruiters listing endpoint. This feature will be available once the backend is updated."
      />
    </div>
  );
}

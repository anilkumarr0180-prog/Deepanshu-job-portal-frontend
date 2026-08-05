import EmptyState from "../components/EmptyState";
import Toolbar from "../components/Toolbar";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <Toolbar
        title="Users"
        description="Manage platform users, approvals, and account states."
        searchValue=""
        onSearchChange={() => {}}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm opacity-60">
        <input
          aria-label="Search users"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none sm:w-56"
          disabled
          placeholder="Search users"
          readOnly
        />
        <select
          aria-label="Filter users"
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
        title="Users management is not available"
        description="The backend does not currently expose a users listing endpoint. This feature will be available once the backend is updated."
      />
    </div>
  );
}

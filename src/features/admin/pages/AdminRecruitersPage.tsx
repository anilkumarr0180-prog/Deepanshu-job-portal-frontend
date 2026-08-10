import { useState } from "react";

import EmptyState from "../components/EmptyState";
import UsersTable from "../components/UsersTable";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import FilterDropdown from "../components/FilterDropdown";
import Toolbar from "../components/Toolbar";

import { useAdminUsers, useBlockUser, useUnblockUser } from "../hooks/useAdminUsers";
import type { AdminUser } from "../types";

export default function AdminRecruitersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  // Selected recruiter for modal confirmation
  const [userToBlock, setUserToBlock] = useState<AdminUser | null>(null);
  const [userToUnblock, setUserToUnblock] = useState<AdminUser | null>(null);

  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();

  const queryParams = {
    page,
    limit: 10,
    role: "recruiter",
    search: search || undefined,
    isBlocked:
      statusFilter === "All"
        ? undefined
        : statusFilter === "Blocked"
          ? "true"
          : "false",
  };

  const { data, isLoading, isError, refetch } = useAdminUsers(queryParams);

  const handleConfirmBlock = () => {
    if (!userToBlock) return;
    blockMutation.mutate(userToBlock.id, {
      onSettled: () => setUserToBlock(null),
    });
  };

  const handleConfirmUnblock = () => {
    if (!userToUnblock) return;
    unblockMutation.mutate(userToUnblock.id, {
      onSettled: () => setUserToUnblock(null),
    });
  };

  const mappedRecruiters: AdminUser[] = (data?.items ?? []).map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    isBlocked: u.isBlocked,
    status: u.isBlocked ? "Blocked" : "Active",
    joinedAt: u.joinedAt,
  }));

  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <Toolbar
        title="Recruiters Management"
        description="Review recruiter accounts, company activity, and moderation actions."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-slate-400">Status:</span>
          <FilterDropdown
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            options={["All", "Active", "Blocked"]}
          />
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          <p className="mb-3">Failed to load recruiters.</p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : mappedRecruiters.length > 0 ? (
        <>
          <UsersTable
            users={mappedRecruiters}
            onBlock={(user) => setUserToBlock(user)}
            onUnblock={(user) => setUserToUnblock(user)}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title="No recruiters found"
          description="No recruiter accounts matched your filter or search query."
        />
      )}

      {/* Modal - Block Recruiter */}
      {userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Block Recruiter Account</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to block <strong className="text-slate-900">{userToBlock.name}</strong> ({userToBlock.email})? They will immediately lose access to sign in.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToBlock(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                disabled={blockMutation.isPending}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {blockMutation.isPending ? "Blocking..." : "Block Recruiter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Unblock Recruiter */}
      {userToUnblock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Unblock Recruiter Account</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to unblock <strong className="text-slate-900">{userToUnblock.name}</strong> ({userToUnblock.email})? This will restore their login access.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToUnblock(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUnblock}
                disabled={unblockMutation.isPending}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {unblockMutation.isPending ? "Unblocking..." : "Unblock Recruiter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

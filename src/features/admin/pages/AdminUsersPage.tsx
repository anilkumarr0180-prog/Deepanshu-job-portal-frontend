import { useMemo, useState } from "react";

import DeleteModal from "../components/DeleteModal";
import EmptyState from "../components/EmptyState";
import FilterDropdown from "../components/FilterDropdown";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import Toolbar from "../components/Toolbar";
import UsersTable from "../components/UsersTable";
import { users } from "../constants";
import type { AdminUser } from "../types";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);
      const matchesFilter = filter === "All" || user.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, search]);

  const pagedUsers = filteredUsers.slice((page - 1) * 5, page * 5);

  return (
    <div className="space-y-6">
      <Toolbar
        title="Users"
        description="Manage platform users, approvals, and account states."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput value={search} onChange={setSearch} />
        <FilterDropdown
          value={filter}
          onChange={setFilter}
          options={["All", "Active", "Pending", "Suspended"]}
        />
      </div>

      {pagedUsers.length > 0 ? (
        <>
          <UsersTable users={pagedUsers} onDelete={(user) => setSelectedUser(user)} />
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(filteredUsers.length / 5))} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState title="No users found" description="Try adjusting your search or filters." />
      )}

      <DeleteModal
        open={Boolean(selectedUser)}
        title="Delete user"
        description={`Delete ${selectedUser?.name ?? "this user"}? This action cannot be undone.`}
        onCancel={() => setSelectedUser(null)}
        onConfirm={() => setSelectedUser(null)}
      />
    </div>
  );
}

import { useMemo, useState } from "react";

import DeleteModal from "../components/DeleteModal";
import EmptyState from "../components/EmptyState";
import FilterDropdown from "../components/FilterDropdown";
import RecruitersTable from "../components/RecruitersTable";
import SearchInput from "../components/SearchInput";
import Toolbar from "../components/Toolbar";
import { recruiters } from "../constants";
import type { AdminRecruiter } from "../types";

export default function AdminRecruitersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRecruiter, setSelectedRecruiter] = useState<AdminRecruiter | null>(null);

  const filteredRecruiters = useMemo(() => {
    const query = search.toLowerCase();
    return recruiters.filter((recruiter) => {
      const matchesSearch =
        recruiter.company.toLowerCase().includes(query) ||
        recruiter.contactName.toLowerCase().includes(query) ||
        recruiter.email.toLowerCase().includes(query);
      const matchesFilter = filter === "All" || recruiter.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, search]);

  return (
    <div className="space-y-6">
      <Toolbar
        title="Recruiters"
        description="Review recruiter accounts, company activity, and moderation actions."
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

      {filteredRecruiters.length > 0 ? (
        <RecruitersTable
          recruiters={filteredRecruiters}
          onDelete={(recruiter) => setSelectedRecruiter(recruiter)}
          onSuspend={(recruiter) => setSelectedRecruiter(recruiter)}
        />
      ) : (
        <EmptyState title="No recruiters found" description="Try a different title or filter." />
      )}

      <DeleteModal
        open={Boolean(selectedRecruiter)}
        title="Delete recruiter"
        description={`Delete ${selectedRecruiter?.company ?? "this recruiter"}? This action cannot be undone.`}
        onCancel={() => setSelectedRecruiter(null)}
        onConfirm={() => setSelectedRecruiter(null)}
      />
    </div>
  );
}

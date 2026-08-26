import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAllApplications } from "../hooks/useAllApplications";
import { useAtsRealtimeSync } from "../hooks/useAtsRealtimeSync";
import { useUpdateApplicationStatus } from "../hooks/useUpdateApplicationStatus";
import { mapApplicantRecord } from "../utils/applicationMapper";
import ApplicantsFilters from "../components/applicants/ApplicantsFilters";
import ApplicantsPageHeader from "../components/applicants/ApplicantsPageHeader";
import ApplicantsPagination from "../components/applicants/ApplicantsPagination";
import ApplicantsTable from "../components/applicants/ApplicantsTable";
import ApplicantsKanbanBoard from "../components/applicants/ApplicantsKanbanBoard";
import ApplicantsViewSwitcher, {
  type ApplicantsViewMode,
} from "../components/applicants/ApplicantsViewSwitcher";
import EmptyApplicants from "../components/applicants/EmptyApplicants";

export default function RecruiterApplicantsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ApplicantsViewMode>("kanban");

  const {
    data: applications,
    isLoading,
    isError,
  } = useAllApplications();

  const updateMutation = useUpdateApplicationStatus();
  useAtsRealtimeSync();

  const allApplicants = useMemo(() => {
    if (!applications) return [];
    return applications.map(mapApplicantRecord);
  }, [applications]);

  const filteredApplicants = useMemo(() => {
    return allApplicants.filter((applicant) => {
      const matchesSearch = `${applicant.candidate} ${applicant.job} ${applicant.skills.join(" ")}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, allApplicants]);

  const handleView = (id: string) => {
    navigate(`/recruiter/applicants/${id}`);
  };

  const handleUpdateStatus = (
    id: string,
    status: string,
    interviewDetails?: any
  ) => {
    updateMutation.mutate({ id, status, interviewDetails });
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <ApplicantsPageHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Action Controls: View Switcher & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ApplicantsViewSwitcher
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="flex-1">
          <ApplicantsFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            totalApplicants={filteredApplicants.length}
          />
        </div>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading candidate applications...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600 shadow-sm">
          <p className="font-bold">Failed to load applications.</p>
          <p className="mt-1 text-xs text-red-500">Please check your network connection and try again.</p>
        </div>
      ) : filteredApplicants.length > 0 ? (
        viewMode === "kanban" ? (
          <ApplicantsKanbanBoard
            applicants={filteredApplicants}
            onView={handleView}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updateMutation.isPending}
          />
        ) : (
          <>
            <ApplicantsTable
              applicants={filteredApplicants}
              onView={handleView}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updateMutation.isPending}
            />
            <ApplicantsPagination />
          </>
        )
      ) : (
        <EmptyApplicants />
      )}
    </div>
  );
}

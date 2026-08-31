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

  const searchFilteredApplicants = useMemo(() => {
    if (!searchTerm.trim()) return allApplicants;
    const term = searchTerm.toLowerCase();
    return allApplicants.filter((applicant) => {
      return `${applicant.candidate} ${applicant.job} ${applicant.skills.join(" ")}`
        .toLowerCase()
        .includes(term);
    });
  }, [searchTerm, allApplicants]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: searchFilteredApplicants.length,
      Applied: 0,
      "Under Review": 0,
      Shortlisted: 0,
      Interview: 0,
      Hired: 0,
      Rejected: 0,
    };
    searchFilteredApplicants.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });
    return counts;
  }, [searchFilteredApplicants]);

  const filteredApplicants = useMemo(() => {
    if (statusFilter === "All") return searchFilteredApplicants;
    return searchFilteredApplicants.filter(
      (applicant) => applicant.status === statusFilter
    );
  }, [statusFilter, searchFilteredApplicants]);

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
    <div className="space-y-5">
      {/* Header with Search */}
      <ApplicantsPageHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Action Controls: View Switcher & Filters with live count badges */}
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
        <ApplicantsViewSwitcher
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="flex-1">
          <ApplicantsFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            totalApplicants={searchFilteredApplicants.length}
            statusCounts={statusCounts}
          />
        </div>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#3C65F5] border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading candidate pipeline...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600 shadow-xs">
          <p className="font-bold">Failed to load applications.</p>
          <p className="mt-1 text-xs text-red-500">Please check your network connection and try again.</p>
        </div>
      ) : searchFilteredApplicants.length === 0 ? (
        <EmptyApplicants />
      ) : viewMode === "kanban" ? (
        <ApplicantsKanbanBoard
          applicants={searchFilteredApplicants}
          statusFilter={statusFilter}
          onView={handleView}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={updateMutation.isPending}
        />
      ) : filteredApplicants.length > 0 ? (
        <>
          <ApplicantsTable
            applicants={filteredApplicants}
            onView={handleView}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updateMutation.isPending}
          />
          <ApplicantsPagination />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200/90 dark:border-[#2A3850] bg-white dark:bg-[#151F32] p-12 text-center shadow-xs">
          <p className="text-sm font-bold text-slate-800 dark:text-white">No applicants in {statusFilter}</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Try selecting another status tab or &quot;All&quot; to view applicants.</p>
          <button
            type="button"
            onClick={() => setStatusFilter("All")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] hover:bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
          >
            View All Applicants
          </button>
        </div>
      )}
    </div>
  );
}

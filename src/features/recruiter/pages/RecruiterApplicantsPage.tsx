import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAllApplications } from "../hooks/useAllApplications";
import { useUpdateApplicationStatus } from "../hooks/useUpdateApplicationStatus";
import { mapApplicantRecord } from "../utils/applicationMapper";
import ApplicantsFilters from "../components/applicants/ApplicantsFilters";
import ApplicantsPageHeader from "../components/applicants/ApplicantsPageHeader";
import ApplicantsPagination from "../components/applicants/ApplicantsPagination";
import ApplicantsTable from "../components/applicants/ApplicantsTable";
import EmptyApplicants from "../components/applicants/EmptyApplicants";

export default function RecruiterApplicantsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    data: applications,
    isLoading,
    isError,
  } = useAllApplications();

  const updateMutation = useUpdateApplicationStatus();

  const allApplicants = useMemo(() => {
    if (!applications) return [];
    return applications.map(mapApplicantRecord);
  }, [applications]);

  const filteredApplicants = useMemo(() => {
    return allApplicants.filter((applicant) => {
      const matchesSearch = `${applicant.candidate} ${applicant.job}`
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

  const handleUpdateStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <ApplicantsPageHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <ApplicantsFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        totalApplicants={filteredApplicants.length}
      />

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading applicants...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
          Failed to load applicants.
        </div>
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
        <EmptyApplicants />
      )}
    </div>
  );
}

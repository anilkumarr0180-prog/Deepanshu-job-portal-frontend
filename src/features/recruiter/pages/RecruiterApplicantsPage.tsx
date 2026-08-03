import { useMemo, useState } from "react";

import ApplicantsFilters from "../components/applicants/ApplicantsFilters";
import ApplicantsPageHeader from "../components/applicants/ApplicantsPageHeader";
import ApplicantsPagination from "../components/applicants/ApplicantsPagination";
import ApplicantsTable from "../components/applicants/ApplicantsTable";
import EmptyApplicants from "../components/applicants/EmptyApplicants";
import { recruiterApplicants } from "../constants/applicants";

export default function RecruiterApplicantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplicants = useMemo(() => {
    return recruiterApplicants.filter((applicant) => {
      const matchesSearch = `${applicant.candidate} ${applicant.job}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <ApplicantsPageHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <ApplicantsFilters statusFilter={statusFilter} onStatusChange={setStatusFilter} />

      {filteredApplicants.length > 0 ? (
        <>
          <ApplicantsTable applicants={filteredApplicants} />
          <ApplicantsPagination />
        </>
      ) : (
        <EmptyApplicants />
      )}
    </div>
  );
}

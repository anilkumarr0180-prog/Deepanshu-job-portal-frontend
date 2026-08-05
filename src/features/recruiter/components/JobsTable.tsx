import { useNavigate } from "react-router-dom";

import JobActions from "./JobActions";
import JobStatusBadge from "./JobStatusBadge";
import type { RecruiterJob, RecruiterJobAction } from "../types";

interface JobsTableProps {
  jobs: RecruiterJob[];
  onDelete?: (jobId: string) => void;
}

export default function JobsTable({ jobs, onDelete }: JobsTableProps) {
  const navigate = useNavigate();

  const handleAction = (action: RecruiterJobAction, jobId: string) => {
    if (action === "view") {
      navigate(`/recruiter/jobs/${jobId}`);
      return;
    }

    if (action === "edit") {
      navigate(`/recruiter/jobs/${jobId}/edit`);
      return;
    }

    if (action === "delete" && onDelete) {
      onDelete(jobId);
      return;
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Job Title</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Applicants</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Posted Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {jobs.map((job) => (
              <tr key={job.id} className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-900">{job.title}</td>
                <td className="px-4 py-3">{job.location}</td>
                <td className="px-4 py-3">{job.type}</td>
                <td className="px-4 py-3">{job.applicants}</td>
                <td className="px-4 py-3">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3">{job.postedDate}</td>
                <td className="px-4 py-3">
                  <JobActions onAction={(action) => handleAction(action, job.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

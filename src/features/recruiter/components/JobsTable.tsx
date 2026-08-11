import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Zap } from "lucide-react";

import JobActions from "./JobActions";
import JobStatusBadge from "./JobStatusBadge";
import QuotaUpgradeModal from "@/features/subscription/components/QuotaUpgradeModal";
import { boostJob } from "@/features/subscription/api/subscriptionApi";
import type { RecruiterJob, RecruiterJobAction } from "../types";

interface JobsTableProps {
  jobs: RecruiterJob[];
  onDelete?: (jobId: string) => void;
}

export default function JobsTable({ jobs, onDelete }: JobsTableProps) {
  const navigate = useNavigate();
  const [boostingJobId, setBoostingJobId] = useState<string | null>(null);
  const [quotaModalState, setQuotaModalState] = useState<{
    isOpen: boolean;
    title?: string;
    message?: string;
  }>({ isOpen: false });

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

  const handleBoostJob = async (jobId: string) => {
    try {
      setBoostingJobId(jobId);
      const res = await boostJob(jobId);
      toast.success(res.message || "Job successfully boosted to Featured!");
      setTimeout(() => window.location.reload(), 800);
    } catch (error: any) {
      const msg = error.response?.data?.message;
      setQuotaModalState({
        isOpen: true,
        title: "Featured Job Quota Reached",
        message: msg || "Your plan allows 0 featured job slots. Upgrade to Recruiter Enterprise for 10 featured job slots.",
      });
    } finally {
      setBoostingJobId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <QuotaUpgradeModal
        isOpen={quotaModalState.isOpen}
        onClose={() => setQuotaModalState({ isOpen: false })}
        title={quotaModalState.title}
        message={quotaModalState.message}
        feature="featured_job"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Job Title</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Boost</th>
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
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleBoostJob(job.id)}
                    disabled={boostingJobId === job.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{boostingJobId === job.id ? "Boosting..." : "Boost"}</span>
                  </button>
                </td>
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

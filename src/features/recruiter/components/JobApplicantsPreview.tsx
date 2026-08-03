import { ArrowUpRight, Eye } from "lucide-react";

interface ApplicantPreview {
  id: string;
  candidate: string;
  experience: string;
  appliedDate: string;
  status: string;
}

interface JobApplicantsPreviewProps {
  applicants: ApplicantPreview[];
}

export default function JobApplicantsPreview({ applicants }: JobApplicantsPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Applicants</h3>
          <p className="mt-1 text-sm text-slate-500">A preview of candidates who recently applied.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          View all
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Applied Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-900">{applicant.candidate}</td>
                <td className="px-4 py-3">{applicant.experience}</td>
                <td className="px-4 py-3">{applicant.appliedDate}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {applicant.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Eye className="h-4 w-4" />
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import { ArrowLeft, Download, MessageSquareMore, UserRoundCheck, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAllApplications } from "../hooks/useAllApplications";
import { useUpdateApplicationStatus } from "../hooks/useUpdateApplicationStatus";
import { mapApplicantDetails } from "../utils/applicationMapper";

export default function RecruiterApplicantDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: applications,
    isLoading,
    isError,
  } = useAllApplications();

  const updateMutation = useUpdateApplicationStatus();

  const application = applications?.find((app) => app._id === id);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading applicant details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
        Failed to load applicant details.
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Applicant not found.
      </div>
    );
  }

  const applicant = mapApplicantDetails(application);

  const handleStatusUpdate = (status: string) => {
    if (!id || updateMutation.isPending) return;
    updateMutation.mutate({ id, status });
  };

  const resumeUrl =
    application.resume || application.applicantId.resumeUrl || "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <Link to="/recruiter/applicants" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Back to applicants
            </Link>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{applicant.candidate}</h2>
              <p className="mt-2 text-sm text-slate-500">{applicant.summary}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleStatusUpdate("Shortlisted")}
              disabled={updateMutation.isPending}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <UserRoundCheck className="h-4 w-4" />
                Shortlist
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={updateMutation.isPending}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Reject
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusUpdate("Interview")}
              disabled={updateMutation.isPending}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquareMore className="h-4 w-4" />
                Schedule Interview
              </span>
            </button>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-lg font-semibold text-slate-900">Candidate Profile</h3>
              <p className="mt-1 text-sm text-slate-500">Professional summary and contact details.</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.email}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Phone</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.phone}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.location}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Experience</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{applicant.experience}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-lg font-semibold text-slate-900">Resume Preview</h3>
              <p className="mt-1 text-sm text-slate-500">Preview placeholder for the attached resume.</p>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              {applicant.resumeLabel}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-lg font-semibold text-slate-900">Experience & Education</h3>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Experience</p>
                <p className="mt-1">{applicant.experience}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Education</p>
                <ul className="mt-2 space-y-2">
                  {applicant.education.map((item) => (
                    <li key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-lg font-semibold text-slate-900">Portfolio & Cover Letter</h3>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Portfolio</p>
                <p className="mt-1 text-slate-700">{applicant.portfolio}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Cover Letter</p>
                <p className="mt-1 leading-7">{applicant.coverLetter}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-lg font-semibold text-slate-900">Notes</h3>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {applicant.notes.map((note) => (
                <li key={note} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-lg font-semibold text-slate-900">Application Timeline</h3>
            </div>
            <div className="mt-6 space-y-4">
              {applicant.timeline.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{item.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Application Status</h3>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              {normalizeStatusLabel(application.status)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function normalizeStatusLabel(status: string): string {
  switch (status) {
    case "Applied":
      return "Pending review";
    case "Shortlisted":
      return "Shortlisted";
    case "Interview":
      return "Interview scheduled";
    case "Rejected":
      return "Rejected";
    case "Hired":
      return "Hired";
    default:
      return "Pending review";
  }
}

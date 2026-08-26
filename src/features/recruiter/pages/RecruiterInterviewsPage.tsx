import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Video,
  Building2,
  PhoneCall,
  ExternalLink,
  Clock,
  Briefcase,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Globe,
} from "lucide-react";

import { useAllApplications } from "../hooks/useAllApplications";
import { useUpdateApplicationStatus } from "../hooks/useUpdateApplicationStatus";
import { mapApplicantRecord } from "../utils/applicationMapper";
import {
  ScheduleInterviewModal,
  type ScheduleInterviewDetails,
} from "../components/applicants/ScheduleInterviewModal";
import type { RecruiterApplicantRecord } from "../types";

export default function RecruiterInterviewsPage() {
  const { data: applications, isLoading, isError } = useAllApplications();
  const updateMutation = useUpdateApplicationStatus();

  const [rescheduleApplicant, setRescheduleApplicant] =
    useState<RecruiterApplicantRecord | null>(null);

  const interviewApplicants = useMemo(() => {
    if (!applications) return [];
    return applications
      .map(mapApplicantRecord)
      .filter(
        (app) =>
          app.status === "Interview" ||
          (app.interviewDetails && app.interviewDetails.date)
      );
  }, [applications]);

  const handleRescheduleSubmit = (details: ScheduleInterviewDetails) => {
    if (!rescheduleApplicant) return;
    updateMutation.mutate({
      id: rescheduleApplicant.id,
      status: "Interview",
      interviewDetails: details,
    });
    setRescheduleApplicant(null);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Interview Schedule</h2>
            <p className="mt-1 text-sm text-slate-500">
              Coordinate and track candidate interviews across all your active job postings.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-[#3C65F5] border border-indigo-100">
            <CalendarDays className="h-4 w-4" />
            <span>{interviewApplicants.length} Scheduled</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading interview schedule...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600 shadow-sm">
          <p className="font-bold">Failed to load interviews.</p>
          <p className="mt-1 text-xs text-red-500">Please check your network and try again.</p>
        </div>
      ) : interviewApplicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] mb-4">
            <CalendarDays className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No interviews scheduled yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            When you move applicants to the Interview stage from the ATS Kanban, they will automatically appear here.
          </p>
          <Link
            to="/recruiter/applicants"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-600"
          >
            <span>Open ATS Kanban</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interviewApplicants.map((applicant) => {
            const details = applicant.interviewDetails;
            const mode = details?.mode || "video";
            const initial = applicant.candidate?.charAt(0)?.toUpperCase() || "C";

            return (
              <div
                key={applicant.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
              >
                <div>
                  {/* Top: Candidate info & Mode Icon */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3C65F5]/15 to-indigo-100 font-extrabold text-[#3C65F5]">
                        {initial}
                      </div>
                      <div>
                        <Link
                          to={`/recruiter/applicants/${applicant.id}`}
                          className="font-bold text-slate-900 transition hover:text-[#3C65F5] hover:underline text-sm"
                        >
                          {applicant.candidate}
                        </Link>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Briefcase className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{applicant.job}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#3C65F5]"
                      title={`Interview Mode: ${mode}`}
                    >
                      {mode === "video" ? (
                        <Video className="h-4 w-4" />
                      ) : mode === "in-person" ? (
                        <Building2 className="h-4 w-4" />
                      ) : (
                        <PhoneCall className="h-4 w-4" />
                      )}
                    </span>
                  </div>

                  {/* Interview Meta Details */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1.5 text-indigo-600">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {details?.date || "Date to be confirmed"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {details?.time || "10:00 AM"}
                      </span>
                    </div>

                    {details?.timezone && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Globe className="h-3 w-3" />
                        <span>{details.timezone}</span>
                      </div>
                    )}

                    {details?.type && (
                      <div className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-100">
                        {details.type}
                      </div>
                    )}

                    {/* Location or Meeting link */}
                    {details?.locationOrLink && (
                      <div className="pt-1">
                        {mode === "video" ? (
                          <a
                            href={
                              details.locationOrLink.startsWith("http")
                                ? details.locationOrLink
                                : `https://${details.locationOrLink}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-[#3C65F5] hover:underline text-xs"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[220px]">
                              {details.locationOrLink}
                            </span>
                          </a>
                        ) : (
                          <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{details.locationOrLink}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {details?.notes && (
                      <p className="mt-1 text-[11px] italic text-slate-500 line-clamp-2">
                        "{details.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleApplicant(applicant)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Reschedule
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(applicant.id, "Hired")}
                    disabled={updateMutation.isPending}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-1"
                    title="Hire Candidate"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Hire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(applicant.id, "Rejected")}
                    disabled={updateMutation.isPending}
                    className="rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                    title="Reject"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                  </button>

                  <Link
                    to={`/recruiter/applicants/${applicant.id}`}
                    className="rounded-xl border border-slate-200 p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                    title="View Profile"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rescheduleApplicant && (
        <ScheduleInterviewModal
          isOpen={Boolean(rescheduleApplicant)}
          onClose={() => setRescheduleApplicant(null)}
          candidateName={rescheduleApplicant.candidate}
          onSchedule={handleRescheduleSubmit}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}

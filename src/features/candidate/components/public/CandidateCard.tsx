import { ArrowRight, CheckCircle2, Mail, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendProfile } from "../../api/profile.api";
import { formatRelativeDate } from "@/features/jobs/utils/jobMapper";

interface CandidateCardProps {
  candidate: BackendProfile;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const displayName = candidate.name?.trim() || "Candidate Professional";
  const initials = displayName
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3C65F5]/40 hover:shadow-xl hover:shadow-blue-500/5 text-center">
      <div className="flex flex-col items-center">
        {/* Candidate Avatar */}
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#3C65F5] to-[#2545CB] text-xl font-extrabold text-white shadow-md shadow-blue-500/15 transition-transform duration-300 group-hover:scale-105">
          {candidate.profilePicture ? (
            <img
              src={candidate.profilePicture}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : initials ? (
            <span>{initials}</span>
          ) : (
            <UserRound className="h-10 w-10 text-white" />
          )}
        </div>

        {/* Name */}
        <h3 className="mt-4 line-clamp-1 text-base font-bold text-[#05264E] transition-colors group-hover:text-[#3C65F5]">
          {displayName}
        </h3>

        {/* Email & Phone contact */}
        {candidate.email && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="line-clamp-1">{candidate.email}</span>
          </p>
        )}

        {candidate.phone && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>{candidate.phone}</span>
          </p>
        )}

        {/* Resume status badge */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {candidate.resumeUrl ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-2xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <CheckCircle2 className="h-3 w-3" />
              <span>Resume Uploaded</span>
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-2xs font-medium text-slate-600">
              Candidate Member
            </span>
          )}
        </div>

        {/* Member since */}
        {candidate.createdAt && (
          <p className="mt-2 text-2xs text-slate-400">
            Joined {formatRelativeDate(candidate.createdAt)}
          </p>
        )}
      </div>

      {/* View Profile Button */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <Link
          to={`/candidates/${candidate._id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-[#3C65F5] hover:shadow-md hover:shadow-blue-500/20"
        >
          <span>View Profile</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

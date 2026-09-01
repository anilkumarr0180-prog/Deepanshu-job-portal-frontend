import { Clock, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

import type { BackendProfile } from "../../api/profile.api";

interface CandidateCardProps {
  candidate: BackendProfile;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const displayName = candidate.name?.trim() || "Candidate Professional";
  const initial = displayName.charAt(0).toUpperCase() || "C";
  const designation = candidate.designation || candidate.headline || "UI/UX Designer";
  const bio =
    candidate.bio ||
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?";

  const skills =
    candidate.skills && candidate.skills.length > 0
      ? candidate.skills.slice(0, 5)
      : ["Figma", "Adobe XD", "PSD", "App", "Digital"];

  const location = candidate.city
    ? `${candidate.city}${candidate.country ? `, ${candidate.country}` : ""}`
    : "Chicago, US";

  const rate = candidate.jobPreferences?.minSalary || 45;

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-[16px] border border-[#E0E6F7] bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#3C65F5]/40 hover:shadow-lg dark:border-slate-800 dark:bg-[#131D2E] text-left">
      <div>
        {/* Top Header: Avatar + Info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Link to={`/candidates/${candidate._id}`} className="block">
              <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-[#3C65F5] text-2xl font-bold text-white shadow-xs">
                {candidate.profilePicture ? (
                  <img
                    src={candidate.profilePicture}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
            </Link>
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#10B981] dark:border-[#131D2E]" />
          </div>

          {/* Candidate Info */}
          <div className="min-w-0 flex-1">
            <Link to={`/candidates/${candidate._id}`}>
              <h3 className="line-clamp-1 text-[17px] font-bold text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9]">
                {displayName}
              </h3>
            </Link>
            <p className="mt-0.5 line-clamp-1 text-[13px] text-[#66789C] dark:text-slate-400">
              {designation}
            </p>
            {/* Rating */}
            <div className="mt-1.5 flex items-center gap-1">
              <div className="flex items-center text-[#FFAA00]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FFAA00]" />
                ))}
              </div>
              <span className="text-[12px] font-medium text-[#66789C] dark:text-slate-400">
                (65)
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-2 text-[13px] leading-[20px] text-[#66789C] dark:text-slate-400 min-h-[40px]">
          {bio}
        </p>

        {/* Skills Chips */}
        <div className="mt-3.5 flex flex-wrap gap-1.5 min-h-[56px] content-start">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-[#EFF4FD] px-2.5 py-1 text-[12px] font-medium text-[#3C65F5] transition-colors hover:bg-[#3C65F5] hover:text-white dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-[#3C65F5] dark:hover:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 w-full">
        <div className="border-t border-[#E0E6F7] pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between text-[12px] text-[#66789C] dark:text-slate-400">
            {/* Location */}
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#A0ABB8] shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>

            {/* Hourly Rate */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock className="h-3.5 w-3.5 text-[#A0ABB8] shrink-0" />
              <span className="font-bold text-[#05264E] dark:text-slate-200">
                ${rate}
                <span className="font-normal text-[#66789C] dark:text-slate-400"> / hour</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

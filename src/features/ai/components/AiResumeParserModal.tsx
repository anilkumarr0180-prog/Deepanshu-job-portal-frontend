import { Sparkles, X, Check, Briefcase, GraduationCap, Code2, User, Loader2 } from "lucide-react";
import type { ParsedResume } from "../types/ai.types";
import { useUpdateProfile } from "@/features/candidate/hooks/useUpdateProfile";
import type { UpdateProfilePayload } from "@/features/candidate/api/profile.api";

interface AiResumeParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedData: ParsedResume | null;
  onSuccess?: () => void;
}

export default function AiResumeParserModal({
  isOpen,
  onClose,
  parsedData,
  onSuccess,
}: AiResumeParserModalProps) {
  const updateProfileMutation = useUpdateProfile();

  if (!isOpen || !parsedData) return null;

  const allSkills = Array.from(
    new Set([
      ...(parsedData.skills?.technical || []),
      ...(parsedData.skills?.soft || []),
    ])
  );

  const handleApplyToProfile = () => {
    const payload: UpdateProfilePayload = {
      headline: parsedData.personalInfo?.headline || undefined,
      bio: parsedData.personalInfo?.summary || undefined,
      skills: allSkills.length > 0 ? allSkills : undefined,
      experience: parsedData.experience?.map((exp) => ({
        company: exp.company,
        title: exp.role,
        description: exp.description || "",
      })),
      education: parsedData.education?.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy || "",
      })),
    };

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Profile Extractor</h2>
              <p className="text-xs text-slate-500">Review the information extracted from your resume</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Extracted Details Preview */}
        <div className="mt-6 space-y-5">
          {/* Summary / Headline */}
          {(parsedData.personalInfo?.headline || parsedData.personalInfo?.summary) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <User className="h-4 w-4 text-indigo-600" />
                Headline & Summary
              </div>
              {parsedData.personalInfo.headline && (
                <p className="text-sm font-semibold text-slate-900">{parsedData.personalInfo.headline}</p>
              )}
              {parsedData.personalInfo.summary && (
                <p className="text-xs text-slate-600 leading-relaxed">{parsedData.personalInfo.summary}</p>
              )}
            </div>
          )}

          {/* Skills */}
          {allSkills.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Code2 className="h-4 w-4 text-indigo-600" />
                Extracted Skills ({allSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {parsedData.experience && parsedData.experience.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Briefcase className="h-4 w-4 text-indigo-600" />
                Work Experience ({parsedData.experience.length})
              </div>
              <div className="space-y-2.5">
                {parsedData.experience.map((exp, idx) => (
                  <div key={idx} className="rounded-lg bg-white border border-slate-200 p-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-slate-900">{exp.role}</span>
                      {exp.duration && <span className="text-xs text-slate-400 font-medium">{exp.duration}</span>}
                    </div>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">{exp.company}</p>
                    {exp.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {parsedData.education && parsedData.education.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                Education ({parsedData.education.length})
              </div>
              <div className="space-y-2">
                {parsedData.education.map((edu, idx) => (
                  <div key={idx} className="rounded-lg bg-white border border-slate-200 p-3">
                    <span className="text-sm font-bold text-slate-900">{edu.degree}</span>
                    <p className="text-xs text-indigo-600 font-medium">{edu.institution}</p>
                    {edu.fieldOfStudy && (
                      <p className="text-xs text-slate-500 mt-0.5">{edu.fieldOfStudy}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyToProfile}
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 transition"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving to Profile...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save to Candidate Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

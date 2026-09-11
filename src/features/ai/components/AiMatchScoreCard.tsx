import { useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Loader2, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useAiMatchScore } from "../hooks/useAiMatchScore";

interface AiMatchScoreCardProps {
  job: {
    _id?: string;
    title: string;
    skills?: string[];
    description?: string;
  };
  candidateProfile?: {
    skills?: string[];
    bio?: string;
    headline?: string;
  } | null;
}

export default function AiMatchScoreCard({ job, candidateProfile }: AiMatchScoreCardProps) {
  const { analyzeMatch, matchResult, isLoading } = useAiMatchScore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRunAnalysis = async () => {
    const candidateSkills = candidateProfile?.skills || [];
    const jobSkills = job.skills || [];

    await analyzeMatch({
      jobId: job._id,
      candidateProfile: {
        skills: candidateSkills,
        summary: candidateProfile?.bio || candidateProfile?.headline || "",
      },
      jobRequirements: {
        title: job.title,
        requiredSkills: jobSkills,
        description: job.description || "",
      },
    });
    setIsExpanded(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "STRONG_FIT":
        return <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">Strong Fit</span>;
      case "POTENTIAL_FIT":
        return <span className="rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5">Good Match</span>;
      case "BORDERLINE":
        return <span className="rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5">Moderate Fit</span>;
      default:
        return <span className="rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5">Low Match</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 p-5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">AI ATS Fit Score</h4>
            <p className="text-[11px] text-slate-500">Check how well your profile matches this role</p>
          </div>
        </div>

        {matchResult && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Main Score Area */}
      {!matchResult ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-violet-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Match with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Calculate My Fit Score
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Score Display Card */}
          <div className="flex items-center justify-between rounded-xl bg-white border border-slate-200 p-3.5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border font-black text-lg ${getScoreColor(matchResult.overallScore)}`}>
                {matchResult.overallScore}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {getGradeBadge(matchResult.grade)}
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {matchResult.overallScore >= 75 ? "High probability of shortlist" : "Review missing skills before applying"}
                </p>
              </div>
            </div>
          </div>

          {/* Reasoning Summary */}
          <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            "{matchResult.summary}"
          </p>

          {/* Expandable Breakdown */}
          {isExpanded && (
            <div className="space-y-3.5 pt-1 text-xs animate-in fade-in duration-150">
              {/* Matched Skills */}
              {matchResult.matchedSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Matched Skills ({matchResult.matchedSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {matchResult.missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    Missing / Desired Skills ({matchResult.missingSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.missingSkills.map((skill, idx) => (
                      <span key={idx} className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Tips */}
              {matchResult.actionableFeedback && matchResult.actionableFeedback.length > 0 && (
                <div className="rounded-lg bg-indigo-50/60 border border-indigo-100 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px]">
                    <Lightbulb className="h-3.5 w-3.5 text-indigo-600" />
                    AI Application Advice
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-indigo-950 text-[11px]">
                    {matchResult.actionableFeedback.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

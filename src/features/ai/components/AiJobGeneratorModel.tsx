import { useState } from "react";
import { Sparkles, X, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { useAiJobGenerator } from "../hooks/useAiJobGenerator";

interface AiJobGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: {
    title: string;
    description: string;
    skills: string[];
    experienceLevel: string;
    employmentType: string;
  }) => void;
}

export default function AiJobGeneratorModal({
  isOpen,
  onClose,
  onApply,
}: AiJobGeneratorModalProps) {
  const { generateJob, generatedData, isLoading, reset } = useAiJobGenerator();

  const [jobTitle, setJobTitle] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD">("MID");
  const [jobType, setJobType] = useState<"Full-time" | "Part-time" | "Contract" | "Internship" | "Remote" | "Hybrid">("Full-time");
  const [additionalNotes, setAdditionalNotes] = useState("");

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await generateJob({
      jobTitle: jobTitle.trim(),
      skills: skillsArray.length > 0 ? skillsArray : [jobTitle.trim()],
      experienceLevel,
      jobType,
      additionalNotes: additionalNotes.trim() || undefined,
    });
  };

  const handleApplyToForm = () => {
    if (!generatedData) return;

    // Format the AI structured response into clean markdown/formatted text
    const formattedDescription = `
${generatedData.summary}

### Key Responsibilities:
${generatedData.responsibilities.map((r) => `• ${r}`).join("\n")}

### Requirements:
${generatedData.requirements.map((r) => `• ${r}`).join("\n")}

${
  generatedData.niceToHave && generatedData.niceToHave.length > 0
    ? `### Nice to Have:\n${generatedData.niceToHave.map((n) => `• ${n}`).join("\n")}`
    : ""
}
`.trim();

    onApply({
      title: generatedData.title || jobTitle,
      description: formattedDescription,
      skills: generatedData.suggestedTags || [],
      experienceLevel: experienceLevel === "SENIOR" || experienceLevel === "LEAD" ? "5+ Years" : experienceLevel === "MID" ? "3-5 Years" : "1-3 Years",
      employmentType: jobType === "Full-time" ? "Full Time" : jobType === "Part-time" ? "Part Time" : jobType,
    });

    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Job Description Copilot</h2>
              <p className="text-xs text-slate-500">Draft high-converting job posts in seconds with Gemini AI</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        {!generatedData ? (
          /* Step 1: Input Form */
          <form onSubmit={handleGenerate} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Key Skills / Tech Stack (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, TypeScript, PostgreSQL, AWS"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Seniority Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e: any) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="JUNIOR">Junior (1-2 yrs)</option>
                  <option value="MID">Mid Level (3-5 yrs)</option>
                  <option value="SENIOR">Senior (5+ yrs)</option>
                  <option value="LEAD">Lead / Architect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e: any) => setJobType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Special Notes / Perks (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Competitive equity, fast-paced startup environment, flexible hours"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !jobTitle.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Job Description
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Generated Preview */
          <div className="mt-6 space-y-5">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Generated successfully! Review the draft below:
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-xs font-medium text-emerald-700 hover:underline"
              >
                Regenerate
              </button>
            </div>

            {/* Preview Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 text-sm text-slate-800 max-h-72 overflow-y-auto">
              <div>
                <span className="font-semibold text-slate-900">Title: </span>
                <span>{generatedData.title}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Summary: </span>
                <p className="mt-1 text-slate-600">{generatedData.summary}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Responsibilities:</span>
                <ul className="list-disc pl-5 mt-1 text-slate-600 space-y-1">
                  {generatedData.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Key Tags:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {generatedData.suggestedTags.map((tag, i) => (
                    <span key={i} className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs text-indigo-700 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Back / Edit Inputs
              </button>
              <button
                type="button"
                onClick={handleApplyToForm}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
              >
                Apply to Form
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

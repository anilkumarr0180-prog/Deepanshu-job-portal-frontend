import { Sparkles } from "lucide-react";

interface SkillsSectionProps {
  skills?: string[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-[#05264E]">Required Skills</h2>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {skills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:border-[#3C65F5]/40 hover:bg-[#EEF3FF] hover:text-[#3C65F5]"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

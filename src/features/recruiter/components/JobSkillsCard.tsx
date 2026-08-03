interface JobSkillsCardProps {
  skills: string[];
}

export default function JobSkillsCard({ skills }: JobSkillsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
        <p className="mt-1 text-sm text-slate-500">Popular capabilities matched to this role.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

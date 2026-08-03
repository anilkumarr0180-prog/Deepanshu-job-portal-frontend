interface JobRequirementsCardProps {
  requirements: string[];
}

export default function JobRequirementsCard({ requirements }: JobRequirementsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Requirements</h3>
        <p className="mt-1 text-sm text-slate-500">Core competencies and experience expected from candidates.</p>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        {requirements.map((item) => (
          <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-slate-900" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

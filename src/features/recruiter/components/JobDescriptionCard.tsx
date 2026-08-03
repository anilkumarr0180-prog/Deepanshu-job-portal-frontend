interface JobDescriptionCardProps {
  description: string[];
}

export default function JobDescriptionCard({ description }: JobDescriptionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Description</h3>
        <p className="mt-1 text-sm text-slate-500">A polished summary of the opportunity.</p>
      </div>

      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        {description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

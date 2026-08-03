interface JobDescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export default function JobDescriptionSection({ description, onDescriptionChange }: JobDescriptionSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Job Description</h3>
        <p className="mt-1 text-sm text-slate-500">Write a clear overview of the role, responsibilities, and impact.</p>
      </div>

      <label htmlFor="job-description" className="mt-6 block text-sm text-slate-600">
        <span className="mb-2 block font-medium text-slate-700">Description</span>
        <textarea
          id="job-description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          rows={10}
          placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
          className="min-h-[180px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
        />
      </label>
    </section>
  );
}

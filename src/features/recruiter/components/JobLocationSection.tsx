const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

interface JobLocationSectionProps {
  location: string;
  onLocationChange: (value: string) => void;
}

export default function JobLocationSection({
  location,
  onLocationChange,
}: JobLocationSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Location</h3>
        <p className="mt-1 text-sm text-slate-500">Where is this role based?</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label htmlFor="location" className="text-sm text-slate-600 md:col-span-2">
          <span className="mb-2 flex items-center gap-1 font-medium text-slate-700">
            Location <span className="text-rose-500">*</span>
          </span>
          <input
            id="location"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            placeholder="e.g. San Francisco, CA or Remote"
            className={inputClassName}
          />
        </label>
      </div>
    </section>
  );
}

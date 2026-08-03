const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

interface JobLocationSectionProps {
  country: string;
  state: string;
  city: string;
  remote: boolean;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onRemoteChange: (value: boolean) => void;
}

export default function JobLocationSection({
  country,
  state,
  city,
  remote,
  onCountryChange,
  onStateChange,
  onCityChange,
  onRemoteChange,
}: JobLocationSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h3 className="text-lg font-semibold text-slate-900">Location</h3>
        <p className="mt-1 text-sm text-slate-500">Choose where the role is based and whether it is remote.</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label htmlFor="country" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Country</span>
          <input
            id="country"
            value={country}
            onChange={(event) => onCountryChange(event.target.value)}
            placeholder="United States"
            className={inputClassName}
          />
        </label>

        <label htmlFor="state" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">State</span>
          <input
            id="state"
            value={state}
            onChange={(event) => onStateChange(event.target.value)}
            placeholder="California"
            className={inputClassName}
          />
        </label>

        <label htmlFor="city" className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">City</span>
          <input
            id="city"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            placeholder="San Francisco"
            className={inputClassName}
          />
        </label>

        <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={remote}
            onChange={(event) => onRemoteChange(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Remote Position
        </label>
      </div>
    </section>
  );
}

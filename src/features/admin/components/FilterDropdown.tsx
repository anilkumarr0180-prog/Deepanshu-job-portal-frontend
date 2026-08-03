interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function FilterDropdown({ value, onChange, options }: FilterDropdownProps) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
      <span className="text-slate-500">Filter</span>
      <select
        aria-label="Filter"
        className="bg-transparent outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

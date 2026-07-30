interface Option {
  label: string;
  value: string;
}

interface AuthSelectProps {
  label: string;
  options: Option[];
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function AuthSelect({
  label,
  options,
  required = false,
  value,
  onChange,
}: AuthSelectProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-[#05264E]">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="h-[56px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-[#05264E] outline-none transition-all duration-200 focus:border-[#3C65F5] focus:ring-2 focus:ring-[#3C65F5]/20"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
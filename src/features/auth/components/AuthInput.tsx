import type { ChangeEvent } from "react";

interface AuthInputProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthInput({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: AuthInputProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-[#05264E]">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-[56px] w-full rounded-xl border border-slate-200 px-4 text-[15px] text-[#05264E] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#3C65F5] focus:ring-2 focus:ring-[#3C65F5]/20"
      />
    </div>
  );
}
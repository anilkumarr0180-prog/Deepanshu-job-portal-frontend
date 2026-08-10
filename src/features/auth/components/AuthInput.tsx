import { useState, type ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const currentType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-[#05264E]">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        <input
          type={currentType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`h-[56px] w-full rounded-xl border border-slate-200 px-4 text-[15px] text-[#05264E] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#3C65F5] focus:ring-2 focus:ring-[#3C65F5]/20 ${
            isPasswordField ? "pr-12" : ""
          }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            title={showPassword ? "Hide password" : "Show password"}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
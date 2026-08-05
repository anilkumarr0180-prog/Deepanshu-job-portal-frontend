import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import leftTreesBg from "@/assets/images/auth/img-2regist.svg";
import rightSaucerBg from "@/assets/images/auth/imgregis-1.svg";

import {
  AuthDivider,
  AuthHeader,
  AuthInput,
  AuthLayout,
  AuthSelect,
  GoogleButton,
} from "../components";
import { registerUser } from "../api/auth.api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error("Please agree to terms and policy.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        role,
      });

      toast.success("User registered successfully.");
      void navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      leftIllustration={leftTreesBg}
      rightIllustration={rightSaucerBg}
    >
      <AuthHeader
        badge="Register"
        title="Start for free Today"
        subtitle="Access to all features. No credit card required."
      />

      <GoogleButton text="Sign up with Google" />

      <AuthDivider />

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="mt-8"
      >
        <AuthInput
          label="Full Name"
          placeholder="Steven Job"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="stevenjob@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <AuthSelect
          label="Register As"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            {
              label: "Candidate",
              value: "candidate",
            },
            {
              label: "Recruiter",
              value: "recruiter",
            },
          ]}
        />

        {/* Terms */}
        <div className="mb-7 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#66789C]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-[#3C65F5]"
            />
            <span>Agree our terms and policy</span>
          </label>

          <button
            type="button"
            className="text-sm font-medium text-[#3C65F5] hover:underline"
          >
            Learn more
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full rounded-xl bg-[#05264E] text-base font-semibold text-white transition-all duration-200 hover:bg-[#031C3B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Submit & Register"}
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[#66789C]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => void navigate("/login")}
            className="font-semibold text-[#3C65F5] hover:underline"
          >
            Sign In
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import leftCityBg from "@/assets/images/auth/img-3.svg";
import rightBalloonBg from "@/assets/images/auth/img-4.svg";

import {
  AuthDivider,
  AuthHeader,
  AuthInput,
  AuthLayout,
  GoogleButton,
} from "../components";
import { loginUser, normalizeAuthPayload } from "../api/auth.api";
import { type AuthUser } from "../context/auth-context";
import useAuth from "../hooks/useAuth";
import { getDashboardRoute } from "../utils/roleNavigation";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      const { token: nextToken, user: nextUser } = normalizeAuthPayload(
        response.data
      );

      if (!nextToken) {
        throw new Error("Authentication token missing from server response.");
      }

      const normalizedUser = (nextUser ?? {}) as AuthUser;
      login(nextToken, normalizedUser);

      toast.success("User logged in successfully.");

      void navigate(getDashboardRoute(normalizedUser.role));
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "Login failed.");
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      leftIllustration={leftCityBg}
      rightIllustration={rightBalloonBg}
    >
      <AuthHeader
        badge="Welcome back!"
        title="Member Login"
        subtitle="Access to all features. No credit card required."
      />

      <GoogleButton text="Sign in with Google" />

      <AuthDivider />

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="mt-8"
      >
        <AuthInput
          label="Username or Email address"
          type="email"
          placeholder="Steven Job"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Remember me & Forgot password */}
        <div className="mb-7 flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-[#3C65F5]"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Forgot Password
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full rounded-xl bg-[#05264E] text-base font-semibold text-white transition-all duration-200 hover:bg-[#031C3B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-[#66789C]">
          Don't have an Account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#3C65F5] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
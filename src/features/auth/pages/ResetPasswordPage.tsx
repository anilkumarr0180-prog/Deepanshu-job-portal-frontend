import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, CheckCircle2, X } from "lucide-react";

import leftCityBg from "@/assets/images/auth/img-3.svg";
import rightBalloonBg from "@/assets/images/auth/img-4.svg";

import {
  AuthHeader,
  AuthInput,
  AuthLayout,
} from "../components";
import { resetPasswordUser } from "../api/auth.api";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Password validation rules matching server-side zod schema
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isMatching = password.length > 0 && password === confirmPassword;

  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    isMatching;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing password reset token.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPasswordUser(token, { password });
      setIsSuccess(true);
      toast.success(response.data?.message || "Password reset successfully!");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to reset password.");
      toast.error(errorMsg);
      if (
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("expired")
      ) {
        setIsExpired(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!token || isExpired) {
    return (
      <AuthLayout
        leftIllustration={leftCityBg}
        rightIllustration={rightBalloonBg}
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <X className="h-10 w-10" />
          </div>
          <AuthHeader
            badge="Security Notice"
            title="Link Expired or Already Used"
            subtitle="This password reset link is invalid, has expired, or was replaced by a newer request."
          />
          <div className="mt-8 space-y-4">
            <Link
              to="/forgot-password"
              className="flex h-14 w-full items-center justify-center rounded-xl bg-[#05264E] text-base font-semibold text-white transition-all duration-200 hover:bg-[#031C3B]"
            >
              Request New Reset Link
            </Link>
            <Link
              to="/login"
              className="inline-block text-sm font-semibold text-[#3C65F5] hover:underline"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      leftIllustration={leftCityBg}
      rightIllustration={rightBalloonBg}
    >
      {!isSuccess ? (
        <>
          <AuthHeader
            badge="Account Security"
            title="Set New Password"
            subtitle="Create a strong password to protect your JobBox account."
          />

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8">
            <AuthInput
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AuthInput
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Password Requirements Checklist */}
            <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs">
              <p className="mb-2 font-semibold text-slate-700">
                Password must contain:
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                <RequirementItem label="At least 8 characters" met={hasMinLength} />
                <RequirementItem label="One uppercase letter" met={hasUppercase} />
                <RequirementItem label="One lowercase letter" met={hasLowercase} />
                <RequirementItem label="One number" met={hasNumber} />
                <RequirementItem label="One special character" met={hasSpecial} />
                <RequirementItem label="Passwords match" met={isMatching} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="h-14 w-full rounded-xl bg-[#05264E] text-base font-semibold text-white transition-all duration-200 hover:bg-[#031C3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Updating Password..." : "Reset Password"}
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-[#3C65F5] hover:underline"
              >
                Cancel and return to Login
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <AuthHeader
            badge="Security Updated"
            title="Password Changed"
            subtitle="Your password has been successfully updated. You can now sign in with your new credentials."
          />

          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-[#05264E] text-base font-semibold text-white transition-all duration-200 hover:bg-[#031C3B]"
            >
              Proceed to Sign In
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <X className="h-3.5 w-3.5 text-slate-300" />
      )}
      <span className={met ? "text-emerald-700 font-medium" : "text-slate-500"}>
        {label}
      </span>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, MailCheck } from "lucide-react";

import leftCityBg from "@/assets/images/auth/img-3.svg";
import rightBalloonBg from "@/assets/images/auth/img-4.svg";

import {
  AuthHeader,
  AuthInput,
  AuthLayout,
} from "../components";
import { forgotPasswordUser } from "../api/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown countdown effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPasswordUser({ email: email.trim().toLowerCase() });
      setIsSubmitted(true);
      setResendCooldown(60);
      toast.success(response.data?.message || "Password reset link sent.");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to process request.");
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
      {!isSubmitted ? (
        <>
          <AuthHeader
            badge="Account Recovery"
            title="Forgot Password"
            subtitle="Enter your email to receive a single-use password reset link."
          />

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8">
            <AuthInput
              label="Email address"
              type="email"
              placeholder="steven@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-14 w-full rounded-xl bg-[#05264E] text-base font-semibold text-white transition-all duration-200 hover:bg-[#031C3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#3C65F5] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign in
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#3C65F5]">
            <MailCheck className="h-10 w-10" />
          </div>

          <AuthHeader
            badge="Email Dispatched"
            title="Check Your Inbox"
            subtitle={`If an account with ${email} exists, a secure password reset link has been sent. The link expires in 15 minutes.`}
          />

          <div className="mt-8 space-y-4">
            <Link
              to="/login"
              className="flex h-14 w-full items-center justify-center rounded-xl bg-[#05264E] text-base font-semibold text-white transition-all duration-200 hover:bg-[#031C3B]"
            >
              Return to Login
            </Link>

            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={() => {
                setIsSubmitted(false);
              }}
              className="text-sm font-medium text-slate-500 hover:text-[#3C65F5] disabled:cursor-not-allowed disabled:text-slate-400 transition-colors"
            >
              {resendCooldown > 0
                ? `Didn't receive an email? Resend in ${resendCooldown}s`
                : "Didn't receive an email? Send another link"}
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

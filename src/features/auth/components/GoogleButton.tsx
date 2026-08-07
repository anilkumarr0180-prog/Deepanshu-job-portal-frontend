import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { googleAuthApi, normalizeAuthPayload } from "../api/auth.api";
import { type AuthUser } from "../context/auth-context";
import useAuth from "../hooks/useAuth";
import { getDashboardRoute } from "../utils/roleNavigation";

interface GoogleButtonProps {
  text: string;
  role?: string;
}

export default function GoogleButton({ text, role }: GoogleButtonProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (tokenResponse: {
    access_token?: string;
    credential?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await googleAuthApi({
        token: tokenResponse.access_token,
        credential: tokenResponse.credential,
        role,
      });

      const { token: nextToken, user: nextUser } = normalizeAuthPayload(
        response.data
      );

      if (!nextToken) {
        throw new Error("Authentication token missing from server response.");
      }

      const normalizedUser = (nextUser ?? {}) as AuthUser;
      login(nextToken, normalizedUser);

      const responseData = (response.data as any)?.data || response.data;
      if (responseData?.isAccountLinked) {
        toast.success("Linked Google to your existing account!");
      } else if (responseData?.isNewUser) {
        toast.success("Account created successfully with Google!");
      } else {
        toast.success("Welcome back! Signed in with Google.");
      }
      void navigate(getDashboardRoute(normalizedUser.role));
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "Google authentication failed.");
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => void handleGoogleSuccess(tokenResponse),
    onError: () => {
      toast.error("Google login cancelled or failed.");
    },
  });

  const handleClick = () => {
    if (
      !googleClientId ||
      googleClientId.startsWith("missing-google-client-id")
    ) {
      toast.error(
        "Google Authentication requires VITE_GOOGLE_CLIENT_ID in your client .env file."
      );
      return;
    }
    loginWithGoogle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-base font-medium text-[#05264E] transition hover:border-[#3C65F5] hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="h-6 w-6"
      />
      <span>{isLoading ? "Authenticating..." : text}</span>
    </button>
  );
}
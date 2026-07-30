import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import heroTop from "@/assets/images/hero/hero-top.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      toast.success("User logged in successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] py-12">
      <div className="container mx-auto flex flex-col-reverse gap-8 lg:flex-row lg:items-center">
        {/* Left: form */}
        <div className="w-full lg:w-1/2">
          <div className="max-w-md mx-auto">
            <p className="text-center text-sm text-slate-500">Welcome back!</p>
            <h2 className="mt-2 text-center text-3xl font-semibold text-slate-900">Member Login</h2>
            <p className="mt-2 text-center text-sm text-slate-500">Access to all features. No credit card required.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 rounded border px-4 py-3 text-sm text-slate-700 hover:shadow"
              >
                <span className="inline-block h-4 w-4">G</span>
                Sign in with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <div className="text-xs text-slate-400">Or continue with</div>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Username or Email address *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded border border-slate-200 bg-white px-3 py-3 text-sm placeholder:text-slate-300"
                  placeholder="Steven Job"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Password *</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full rounded border border-slate-200 bg-white px-3 py-3 text-sm placeholder:text-slate-300"
                  placeholder="************"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>

                <a className="text-slate-500 hover:text-slate-700">Forgot Password</a>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded bg-slate-900 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Login"}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">Don't have an Account? <a href="/register" className="text-slate-900 font-medium">Sign up</a></p>
            </form>
          </div>
        </div>

        {/* Right: image/illustration */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="hidden lg:block max-w-[420px]">
            <img src={heroTop} alt="illustration" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
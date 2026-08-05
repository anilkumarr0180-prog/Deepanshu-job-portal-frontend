import { useNavigate } from "react-router-dom";

import { getDashboardRoute } from "@/features/auth/utils/roleNavigation";
import useAuth from "@/features/auth/hooks/useAuth";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dashboardRoute = getDashboardRoute(user?.role);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">403</h1>
        <p className="mt-4 text-lg text-slate-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(dashboardRoute)}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

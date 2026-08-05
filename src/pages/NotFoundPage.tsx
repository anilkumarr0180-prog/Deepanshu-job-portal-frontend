import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-lg text-slate-600">Page Not Found</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

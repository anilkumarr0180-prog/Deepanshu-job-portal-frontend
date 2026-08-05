interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = "Unable to load jobs. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
      <p className="mb-4 text-sm text-rose-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}

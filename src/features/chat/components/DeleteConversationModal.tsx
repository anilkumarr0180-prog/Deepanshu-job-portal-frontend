import { Trash2, X } from "lucide-react";

interface DeleteConversationModalProps {
  open: boolean;
  userName?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteConversationModal({
  open,
  userName = "this contact",
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConversationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs px-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400">
            <Trash2 className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Chat History?
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete your chat messages with{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{userName}</span>?
              Only your conversation messages will be deleted. Your connection and profiles remain intact.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-98 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Chat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

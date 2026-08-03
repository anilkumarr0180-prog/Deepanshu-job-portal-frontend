interface FormActionsProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  cancelLabel?: string;
  draftLabel?: string;
  submitLabel?: string;
}

export default function FormActions({
  onCancel,
  onSaveDraft,
  onPublish,
  cancelLabel = "Cancel",
  draftLabel = "Save Draft",
  submitLabel = "Publish Job",
}: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end sm:p-6">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        {draftLabel}
      </button>
      <button
        type="button"
        onClick={onPublish}
        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        {submitLabel}
      </button>
    </div>
  );
}

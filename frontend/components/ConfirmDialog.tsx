"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? <p className="mt-2 text-sm text-slate-300">{description}</p> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full border border-rose-400/40 bg-rose-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-rose-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

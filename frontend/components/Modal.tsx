"use client";

import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-900/80 backdrop-blur" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-4 max-h-[75vh] overflow-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 440,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface border border-line rounded-xl shadow-2xl overflow-hidden"
        style={{ width: "100%", maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-5 py-3.5 border-b border-line flex items-center justify-between">
          <div className="text-[14px] font-semibold">{title}</div>
          <button onClick={onClose} className="text-ink-mute hover:text-ink text-[14px] leading-none">×</button>
        </header>
        <div className="px-5 py-4 text-[13px] text-ink-dim leading-relaxed">{children}</div>
        {footer && (
          <footer className="px-5 py-3 border-t border-line bg-canvas/40 flex items-center justify-end gap-2">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Підтвердити",
  cancelLabel = "Скасувати",
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 rounded-md border border-line text-[12px] text-ink-dim hover:text-ink hover:border-lineStrong">
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={
              "px-3 py-1.5 rounded-md text-[12px] font-semibold " +
              (danger ? "bg-bad text-canvas" : "bg-cyan text-canvas")
            }
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {body}
    </Modal>
  );
}

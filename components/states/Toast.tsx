"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type ToastTone = "info" | "success" | "warn" | "error";
interface Toast { id: number; tone: ToastTone; text: string; ttl: number }

interface ToastCtx {
  show: (text: string, opts?: { tone?: ToastTone; ttl?: number }) => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback((text: string, opts?: { tone?: ToastTone; ttl?: number }) => {
    const id = ++idRef.current;
    const t: Toast = { id, text, tone: opts?.tone ?? "info", ttl: opts?.ttl ?? 3500 };
    setToasts((arr) => [...arr, t]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), t.ttl);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "px-3.5 py-2.5 rounded-lg border shadow-lg pointer-events-auto text-[13px] backdrop-blur " +
              toneClasses(t.tone)
            }
          >
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() { return useContext(Ctx); }

function toneClasses(tone: ToastTone): string {
  switch (tone) {
    case "success": return "bg-good/15 border-good/40 text-good";
    case "warn":    return "bg-warn/15 border-warn/40 text-warn";
    case "error":   return "bg-bad/15 border-bad/40 text-bad";
    default:        return "bg-surface/95 border-lineStrong text-ink";
  }
}

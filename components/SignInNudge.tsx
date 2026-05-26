"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth";

// Friendly one-time popup nudging guests to sign in so their progress survives
// across devices. Dismissable for this browser via localStorage; never re-shown
// once dismissed. Once the user signs in, also persists "ok" so the nudge stays
// quiet for return visits.

const KEY = "nudgeDismissed";

export function SignInNudge() {
  const { session, loading } = useSession();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (session) {
      try { localStorage.setItem(KEY, "1"); } catch {}
      return;
    }
    try {
      const dismissed = localStorage.getItem(KEY) === "1";
      if (!dismissed) {
        // Tiny delay so the page paints first and the popup doesn't feel like an interstitial.
        const t = setTimeout(() => setShow(true), 700);
        return () => clearTimeout(t);
      }
    } catch {}
  }, [session, loading]);

  function dismiss() {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={dismiss}>
      <div
        className="w-full max-w-md bg-surface border border-line rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="size-10 rounded-lg flex items-center justify-center bg-cyan-soft text-cyan mb-4" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" />
            </svg>
          </div>
          <h2 className="text-[18px] font-semibold tracking-tightish">Збережи свій прогрес</h2>
          <p className="text-[13px] text-ink-dim mt-2 leading-relaxed">
            Прямо зараз твоя статистика тестів зберігається тільки на цьому пристрої. Увійди,
            щоб історія, точність по темах та виявлені слабкі місця були доступні з будь-якого пристрою.
          </p>
        </div>
        <div className="px-6 py-3 bg-canvas/40 border-t border-line flex items-center justify-end gap-2">
          <button
            onClick={dismiss}
            className="px-3 py-1.5 rounded-md text-[12px] text-ink-dim hover:text-ink"
          >
            Не зараз
          </button>
          <Link
            href="/login"
            onClick={dismiss}
            className="px-3.5 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold"
          >
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}

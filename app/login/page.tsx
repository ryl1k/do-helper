"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Kbd } from "@/components/shell/Kbd";
import { Logo } from "@/components/shell/Logo";
import { signInWithGoogle, signInWithMagicLink, useSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) router.replace("/profile");
  }, [loading, session, router]);

  async function submitMagic(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const redirect = `${window.location.origin}/profile`;
      await signInWithMagicLink(email.trim(), redirect);
      setSent(true);
    } catch (e: any) { setErr(e?.message ?? String(e)); }
    finally { setBusy(false); }
  }

  async function clickGoogle() {
    setErr(null);
    try {
      const redirect = `${window.location.origin}/profile`;
      await signInWithGoogle(redirect);
    } catch (e: any) { setErr(e?.message ?? String(e)); }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[380px]">
        <Logo size={36} />
        <h1 className="text-[26px] font-semibold tracking-tighter2 mt-5">Увійти в <span className="text-cyan">oi</span>study</h1>
        <p className="text-[13px] text-ink-dim mt-1.5 leading-relaxed">
          Збережи прогрес між пристроями. Без входу — статистика залишається лише на цьому пристрої.
        </p>

        {sent ? (
          <div className="mt-6 panel border-good/30 bg-good/[0.06] p-4 text-[13px] text-good">
            Перевір пошту — там посилання для входу.
          </div>
        ) : (
          <>
            <form onSubmit={submitMagic} className="mt-6">
              <div className="eyebrow mb-1.5">Email</div>
              <div className="h-10 border border-lineStrong rounded-md px-3 flex items-center bg-surface focus-within:border-cyan transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full h-full outline-none text-[13px]"
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={busy || !email.trim()}
                className="mt-2.5 w-full py-2.5 rounded-md bg-cyan text-canvas text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-cyan/90 transition-colors"
              >
                {busy ? "Надсилаємо…" : "Надіслати magic-link"}
                {!busy && <Kbd inverse>↵</Kbd>}
              </button>
            </form>

            <div className="flex items-center gap-2.5 my-5">
              <div className="flex-1 h-px bg-line" />
              <span className="eyebrow">або</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            <button
              type="button"
              onClick={clickGoogle}
              className="w-full py-2.5 bg-surface border border-line rounded-md text-[13px] flex items-center justify-center gap-2.5 hover:border-lineStrong transition-colors"
            >
              <GoogleIcon />
              Увійти через Google
            </button>

            <div className="mt-5 panel border-dashed p-3.5 text-[11px] text-ink-dim leading-relaxed flex gap-2.5">
              <span className="text-ink-mute">i</span>
              <span>
                Можна продовжити <Link href="/" className="text-ink underline underline-offset-2">без входу</Link> — твоя статистика залишиться лише на цьому пристрої.
              </span>
            </div>

            {err && <div className="mt-4 text-bad text-[12px]">{err}</div>}
          </>
        )}

        <div className="mt-7 text-[10px] text-ink-mute text-center">
          Студентський проєкт · <Link href="/faq" className="text-ink-dim underline underline-offset-2">умови</Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path fill="#4285F4" d="M15.5 8.18c0-.57-.05-1.12-.15-1.64H8v3.11h4.21a3.6 3.6 0 01-1.56 2.36v1.97h2.52c1.47-1.36 2.33-3.37 2.33-5.8z"/>
      <path fill="#34A853" d="M8 16c2.11 0 3.88-.7 5.17-1.9l-2.52-1.97c-.7.47-1.6.75-2.65.75-2.04 0-3.76-1.38-4.38-3.23H1.04v2.03A8 8 0 008 16z"/>
      <path fill="#FBBC05" d="M3.62 9.65a4.8 4.8 0 010-3.05V4.57H1.04a8 8 0 000 6.86l2.58-1.78z"/>
      <path fill="#EA4335" d="M8 3.18c1.15 0 2.18.4 3 1.17l2.23-2.23A8 8 0 001.04 4.57l2.58 2.03C4.24 4.55 5.96 3.18 8 3.18z"/>
    </svg>
  );
}

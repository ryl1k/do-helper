"use client";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center px-6 py-10">
      <div className="font-mono text-bad text-[14px]">Помилка</div>
      <h1 className="text-[32px] font-semibold tracking-tighter2 mt-2">Щось пішло не так</h1>
      <p className="text-[13px] text-ink-dim mt-2 max-w-md text-center font-mono break-all">
        {error.message}
      </p>
      {error.digest && (
        <p className="text-[11px] text-ink-mute mt-2 font-mono">ID: {error.digest}</p>
      )}
      <div className="flex gap-2 mt-6">
        <button onClick={reset} className="px-4 py-2 rounded-md bg-cyan text-canvas text-[13px] font-semibold">
          Спробувати знову
        </button>
        <Link href="/" className="px-4 py-2 rounded-md border border-line text-[13px] text-ink-dim hover:text-ink hover:border-lineStrong">
          На головну
        </Link>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useApiKey } from "@/lib/use-api-key";

export function ApiKeyGate({ children }: { children: (key: string) => React.ReactNode }) {
  const { key, loaded, save, clear } = useApiKey();
  const [draft, setDraft] = useState("");

  if (!loaded) return null;

  if (!key) {
    return (
      <main className="max-w-md mx-auto p-6 mt-24 space-y-4">
        <h1 className="text-xl font-semibold">Enter your API key</h1>
        <p className="text-sm opacity-70">
          You'll only need to do this once on this device. It's stored locally in your browser.
        </p>
        <input
          type="password"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save(draft)}
          placeholder="paste your key"
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
        />
        <button
          disabled={!draft.trim()}
          onClick={() => save(draft)}
          className="w-full px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          Save and continue
        </button>
      </main>
    );
  }

  return (
    <>
      <div className="fixed top-2 right-3 text-xs opacity-50 hover:opacity-100 z-10">
        key: <span className="font-mono">…{key.slice(-4)}</span>{" "}
        <button onClick={clear} className="underline ml-1">change</button>
      </div>
      {children(key)}
    </>
  );
}

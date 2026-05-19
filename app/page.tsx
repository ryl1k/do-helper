"use client";
import { useCallback, useRef, useState } from "react";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { AnswerPicker } from "@/components/AnswerPicker";

type Result =
  | { status: "extracted" | "duplicate"; dedup_kind: string | null; image_id: string; question_id: string; question?: string; options?: string[]; cost_usd?: number }
  | { status: "not_question"; image_id: string }
  | { status: "error"; error: string };

type Row = { name: string; result: Result | null };

export default function UploadPage() {
  return <ApiKeyGate>{(key) => <Uploader apiKey={key} />}</ApiKeyGate>;
}

function Uploader({ apiKey }: { apiKey: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (files: FileList) => {
    setBusy(true);
    const initial: Row[] = Array.from(files).map((f) => ({ name: f.name, result: null }));
    setRows((prev) => [...initial, ...prev]);

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const fd = new FormData();
      fd.append("file", f);
      try {
        const r = await fetch("/api/upload", { method: "POST", headers: { "x-api-key": apiKey }, body: fd });
        const j = await r.json();
        const result: Result = r.ok ? j : { status: "error", error: j.error || `HTTP ${r.status}` };
        setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, result } : row)));
      } catch (e: any) {
        setRows((prev) =>
          prev.map((row, idx) => (idx === i ? { ...row, result: { status: "error", error: String(e?.message ?? e) } } : row)),
        );
      }
    }
    setBusy(false);
  }, [apiKey]);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upload exam questions</h1>
        <a href="/db" className="text-sm underline opacity-70 hover:opacity-100">view database →</a>
      </header>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-zinc-700 rounded-lg p-10 text-center cursor-pointer hover:border-zinc-500"
      >
        <div className="text-sm opacity-80">Drop images here, or click to pick</div>
        <div className="text-xs opacity-50 mt-1">PNG / JPG, up to 8MB each</div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {busy && <div className="text-sm opacity-70">Processing…</div>}

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 text-sm">
            <div className="flex justify-between">
              <div className="font-mono opacity-80 truncate">{row.name}</div>
              <StatusBadge result={row.result} />
            </div>
            {row.result && "question_id" in row.result && row.result.options && row.result.options.length > 0 && (
              <div className="mt-2 space-y-2">
                {row.result.question && <div className="opacity-90">{row.result.question}</div>}
                <AnswerPicker
                  apiKey={apiKey}
                  questionId={row.result.question_id}
                  options={row.result.options}
                />
                {row.result.dedup_kind && (
                  <div className="text-xs opacity-60">
                    linked to existing question ({row.result.dedup_kind})
                  </div>
                )}
              </div>
            )}
            {row.result && row.result.status === "duplicate" && !("options" in row.result && row.result.options?.length) && (
              <div className="text-xs opacity-60 mt-1">
                linked to existing question ({(row.result as any).dedup_kind})
              </div>
            )}
            {row.result && row.result.status === "error" && (
              <div className="text-red-400 mt-1">{(row.result as any).error}</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

function StatusBadge({ result }: { result: Row["result"] }) {
  if (!result) return <span className="opacity-60">processing…</span>;
  const color =
    result.status === "extracted" ? "bg-emerald-700" :
    result.status === "duplicate" ? "bg-amber-700" :
    result.status === "not_question" ? "bg-zinc-700" : "bg-red-700";
  return <span className={`px-2 py-0.5 rounded text-xs ${color}`}>{result.status}</span>;
}

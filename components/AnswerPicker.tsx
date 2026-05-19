"use client";
import { useState } from "react";

interface Props {
  apiKey: string;
  questionId: string;
  options: string[];
  initialTally?: Record<number, number>;
  initialMyVote?: number | null;
  compact?: boolean;
}

const LETTERS = ["a", "b", "c", "d", "e", "f"];

export function AnswerPicker({
  apiKey, questionId, options, initialTally = {}, initialMyVote = null, compact,
}: Props) {
  const [tally, setTally] = useState<Record<number, number>>(initialTally);
  const [myVote, setMyVote] = useState<number | null>(initialMyVote);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const totalVotes = Object.values(tally).reduce((a, b) => a + b, 0);
  const consensus = pickConsensus(tally);

  async function vote(i: number) {
    if (busy) return;
    setBusy(true); setErr(null);
    const previous = myVote;
    setMyVote(i);
    setTally((t) => {
      const next = { ...t };
      if (previous !== null) next[previous] = Math.max(0, (next[previous] ?? 1) - 1);
      next[i] = (next[i] ?? 0) + 1;
      return next;
    });
    try {
      const r = await fetch("/api/answer", {
        method: "POST",
        headers: { "x-api-key": apiKey, "content-type": "application/json" },
        body: JSON.stringify({ question_id: questionId, chosen_index: i }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "vote failed");
      if (j.tally) setTally(j.tally);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
      setMyVote(previous);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      {options.map((opt, i) => {
        const count = tally[i] ?? 0;
        const isMine = myVote === i;
        const isConsensus = consensus === i && totalVotes > 0;
        const base = "w-full text-left flex items-start gap-3 rounded border px-3 py-2 transition";
        const state = isMine
          ? "border-emerald-500 bg-emerald-950/40"
          : isConsensus
          ? "border-amber-600/60 bg-amber-950/20 hover:border-amber-500"
          : "border-zinc-800 hover:border-zinc-600";
        return (
          <button
            key={i}
            onClick={() => vote(i)}
            disabled={busy}
            className={`${base} ${state} disabled:opacity-70`}
          >
            <span className="opacity-50 w-4 shrink-0">{LETTERS[i] ?? i + 1}.</span>
            <span className="flex-1">{opt}</span>
            <span className="text-xs opacity-60 shrink-0 tabular-nums">
              {count > 0 ? `${count}` : ""}
              {isMine ? " ✓" : ""}
            </span>
          </button>
        );
      })}
      {err && <div className="text-red-400 text-xs">{err}</div>}
      {totalVotes > 0 && (
        <div className="text-xs opacity-50 pt-1">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          {consensus !== null && ` · consensus: ${LETTERS[consensus] ?? consensus + 1}`}
        </div>
      )}
    </div>
  );
}

function pickConsensus(tally: Record<number, number>): number | null {
  let best: number | null = null;
  let max = 0;
  let tie = false;
  for (const [k, v] of Object.entries(tally)) {
    if (v > max) { best = Number(k); max = v; tie = false; }
    else if (v === max) tie = true;
  }
  return tie || best === null ? null : best;
}

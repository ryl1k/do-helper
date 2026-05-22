"use client";
import { letter } from "@/lib/questions";
import { useT } from "@/lib/i18n";

interface Props {
  // The indices the user picked. `undefined` means we don't have the data
  // (old localStorage quizzes saved before we added the `chosen` field).
  chosen?: number[];
  correctIndices: number[];
}

export function AnswerSummary({ chosen, correctIndices }: Props) {
  const { t } = useT();
  const correctText = correctIndices.length > 0 ? correctIndices.map(letter).join(", ") : "—";

  // chosen === undefined: we don't know what was picked (legacy quiz).
  // chosen === []: user submitted nothing, shouldn't happen in practice but handle it.
  const hasPick = chosen !== undefined;
  const youText = hasPick && chosen.length > 0 ? chosen.map(letter).join(", ") : t("review.noAnswer");

  const correct = hasPick &&
    chosen.length === correctIndices.length &&
    chosen.every((c) => correctIndices.includes(c));

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs border-t border-slate-200 dark:border-slate-800 pt-2 mt-1">
      {hasPick && (
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400">{t("review.you")}:</span>
          <span
            className={
              "tabular-nums font-mono px-1.5 py-0.5 rounded " +
              (correct
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300")
            }
          >
            {youText}
          </span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <span className="text-slate-500 dark:text-slate-400">{t("review.correct")}:</span>
        <span className="tabular-nums font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          {correctText}
        </span>
      </div>
    </div>
  );
}

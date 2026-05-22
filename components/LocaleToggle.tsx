"use client";
import { useT } from "@/lib/i18n";

export function LocaleToggle() {
  const { locale, setLocale, mounted } = useT();
  if (!mounted) {
    return <div className="w-[68px] h-9" aria-hidden />;
  }
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden text-xs font-medium">
      {(["uk", "en"] as const).map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={
              "px-2.5 py-1.5 transition-colors uppercase " +
              (active
                ? "bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800")
            }
            aria-pressed={active}
            aria-label={`Switch language to ${l.toUpperCase()}`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

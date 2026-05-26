"use client";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";

const SECTIONS = [
  { id: "about", label: "Про oistudy" },
  { id: "source", label: "Джерело даних" },
  { id: "how", label: "Як працює тест" },
  { id: "stats", label: "Точність та статистика" },
  { id: "contribute", label: "Як долучитись" },
  { id: "report", label: "Звітувати проблему" },
  { id: "contact", label: "Контакти" },
];

const ITEMS: { q: string; a: string; section: string }[] = [
  { section: "about",
    q: "Що таке oistudy?",
    a: "Це інструмент для підготовки до іспитів: завантажуєш банк питань для свого предмета, проходиш тести, бачиш прогрес. Кожне питання має згенероване AI пояснення кожного варіанту відповіді." },
  { section: "source",
    q: "Звідки взято питання?",
    a: "Спочатку — з Crowdly + матеріалів викладачів. Адміни можуть імпортувати свої банки питань через панель адміністратора. Якщо знайдеш помилку — натисни «Поскаржитись» на питанні." },
  { section: "how",
    q: "Як працює тест?",
    a: "Обираєш теми та кількість питань. Можеш увімкнути «Тільки слабкі питання» — фільтрує за точністю < 60%. Натискай 1–4 для вибору варіанта, ↵ — Перевірити/Далі, ← — повернутись на попереднє." },
  { section: "stats",
    q: "Як рахується точність?",
    a: "Точність = правильні відповіді / усі спроби. Локально зберігається повна історія сесій. З входом — синхронізується між пристроями." },
  { section: "stats",
    q: "Чи зберігається прогрес?",
    a: "Так. Без входу — на пристрої (localStorage). З входом — у Supabase, видно з будь-якого пристрою." },
  { section: "contribute",
    q: "Як долучитись?",
    a: "Проєкт open-source. Pull requests вітаються на GitHub. Якщо хочеш додати свій предмет — напиши, дам адмін-доступ." },
  { section: "report",
    q: "Знайшов баг — куди писати?",
    a: "Telegram @ryl1k або створи issue на GitHub." },
  { section: "contact",
    q: "Контакти",
    a: "Telegram: @ryl1k · GitHub: github.com/ryl1k/oistudy" },
];

export default function FaqPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [openItem, setOpenItem] = useState<number | null>(0);

  return (
    <AppShell crumbs={[{ label: "Q/A" }]}>
      <div className="grid lg:grid-cols-[220px_1fr] min-h-full">
        {/* Section nav */}
        <aside className="border-r border-line px-5 sm:px-7 py-7 lg:block hidden">
          <div className="eyebrow mb-2">Розділи</div>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActiveSection(s.id)}
                  className={
                    "w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-colors " +
                    (activeSection === s.id
                      ? "bg-surface2 text-ink font-medium"
                      : "text-ink-dim hover:text-ink hover:bg-surface")
                  }
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <div className="px-6 sm:px-10 py-7">
          <div className="eyebrow">Q/A · довідка</div>
          <h1 className="text-[28px] font-semibold tracking-tighter2 mt-2">Питання та відповіді</h1>
          <p className="text-[14px] text-ink-dim mt-1 max-w-xl leading-relaxed">
            Все про oistudy: звідки питання, як працює тест, як долучитись. Чогось бракує — напиши в Telegram.
          </p>

          <div className="mt-6">
            {ITEMS.filter((it) => it.section === activeSection || activeSection === "about").map((qa, i) => {
              const open = openItem === i;
              return (
                <div key={i} className="border-b border-line py-3.5">
                  <button
                    onClick={() => setOpenItem(open ? null : i)}
                    className="w-full flex items-baseline justify-between gap-4 text-left"
                  >
                    <div className={`text-[15px] font-medium ${open ? "text-ink" : "text-ink-dim"}`}>{qa.q}</div>
                    <span className="text-ink-mute text-[14px]">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="mt-2 text-[13px] text-ink-dim leading-relaxed max-w-xl whitespace-pre-line">
                      {qa.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 panel p-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium">Не знайшов відповідь?</div>
              <div className="text-[12px] text-ink-mute mt-1">Напиши нам у Telegram або створи issue на GitHub.</div>
            </div>
            <Link href="https://t.me/ryl1k" target="_blank" className="px-3.5 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold">
              Telegram
            </Link>
            <Link href="https://github.com/ryl1k/oistudy/issues" target="_blank" className="px-3.5 py-1.5 rounded-md border border-line text-[12px] text-ink hover:border-lineStrong">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

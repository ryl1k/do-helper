"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";

const REPO = "https://github.com/ryl1k/do-helper";
const ISSUES = "https://github.com/ryl1k/do-helper/issues";
const TELEGRAM = "https://t.me/ryl1k";

export default function FaqPage() {
  const { t } = useT();
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("faq.title")}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("faq.subtitle")}</p>
      </header>

      <Section title={t("faq.source.title")} icon={<BookIcon />}>
        <p>{t("faq.source.crowdly")}</p>
        <p>{t("faq.source.vns")}</p>
        <p className="text-slate-600 dark:text-slate-400">{t("faq.source.disclaimer")}</p>
      </Section>

      <Section title={t("faq.contribute.title")} icon={<GitIcon />}>
        <p>{t("faq.contribute.body")}</p>
        <Link
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
        >
          <GitIcon />
          <span>{t("faq.contribute.repo")}</span>
          <ExternalIcon />
        </Link>
      </Section>

      <Section title={t("faq.support.title")} icon={<MessageIcon />}>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            <TelegramIcon />
            <span>{t("faq.support.telegram")}</span>
            <ExternalIcon />
          </Link>
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-500 px-1">
            {t("faq.support.or")}
          </span>
          <Link
            href={ISSUES}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            <BugIcon />
            <span>{t("faq.support.issues")}</span>
            <ExternalIcon />
          </Link>
        </div>
      </Section>
    </main>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
        <span className="inline-flex items-center justify-center size-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-sky-400">
          {icon}
        </span>
        {title}
      </h2>
      <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300 pl-9 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function BookIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></svg>;
}
function GitIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.92c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.79.55C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" /></svg>;
}
function MessageIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
}
function TelegramIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.5 5.99-4.1-1.28c-.88-.27-.89-.88.2-1.31l16-6.16c.74-.27 1.43.18 1.16 1.31l-2.72 12.84c-.18.92-.74 1.14-1.49.71L13.79 17l-1.97 1.91c-.23.23-.42.42-.84.42z" /></svg>;
}
function BugIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="13" r="4" /><path d="M14.5 9.5 16 8M8 8l1.5 1.5M3 13h3M18 13h3M5 8l2 2M19 8l-2 2M5 18l2-2M19 18l-2-2M9 19h6" /></svg>;
}
function ExternalIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>;
}

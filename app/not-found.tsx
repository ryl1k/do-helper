import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center px-6 py-10">
      <div className="text-cyan text-[14px] tracking-wider uppercase font-semibold">404</div>
      <h1 className="text-[32px] font-semibold tracking-tighter2 mt-2">Сторінку не знайдено</h1>
      <p className="text-[13px] text-ink-dim mt-2 max-w-md text-center">
        Можливо, URL застарілий — або предмет видалили. Перейди на головну і обери з нової.
      </p>
      <Link href="/" className="mt-6 px-4 py-2 rounded-md bg-cyan text-canvas text-[13px] font-semibold">
        На головну →
      </Link>
    </div>
  );
}

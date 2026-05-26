export default function ModerationPage() {
  return (
    <div className="px-6 sm:px-7 py-6 max-w-2xl">
      <div className="eyebrow">Адмін</div>
      <h1 className="text-[22px] font-semibold tracking-tighter2 mt-1">Q/A модерація</h1>
      <div className="mt-6 panel p-8 text-center">
        <div className="text-[13px] text-ink-dim mb-1">Поки немає скарг від користувачів.</div>
        <div className="text-[11px] text-ink-mute">Цей розділ покаже всі питання, які користувачі позначили як «помилка».</div>
      </div>
    </div>
  );
}

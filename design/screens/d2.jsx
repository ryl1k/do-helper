// Direction 2 · Конспект — Editorial study
// Warm ink + crimson, serif headlines, sans body, paper feel in dark mode

const D2 = {
  bg: '#14110f',
  surface: '#1c1916',
  surface2: '#221e1a',
  paper: '#f6f1e9',
  border: 'rgba(255,240,220,0.08)',
  borderStrong: 'rgba(255,240,220,0.14)',
  text: '#e7dfd1',
  textDim: '#a89e8c',
  textMute: '#776e5d',
  accent: '#dc2626',
  accentSoft: '#f87171',
  amber: '#e9a23b',
  green: '#7a9a4b',
  slate: '#94a3b8',
  serif: '"Source Serif 4", "Crimson Text", Georgia, serif',
  sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

const D2topics = [
  { id: 'gen', name: 'Загальні питання', sym: '§1', count: 48 },
  { id: 'lp', name: 'Лінійне · симплекс', sym: '§2', count: 86 },
  { id: 'dual', name: 'Двоїстість', sym: '§3', count: 54 },
  { id: 'trans', name: 'Транспортна задача', sym: '§4', count: 71 },
  { id: 'disc', name: 'Дискретне ЛП', sym: '§5', count: 62 },
  { id: 'nonlin', name: 'Нелінійне', sym: '§6', count: 49 },
  { id: 'uni', name: 'Одновимірна', sym: '§7', count: 38 },
  { id: 'multi', name: 'Багатовимірна', sym: '§8', count: 44 },
  { id: 'game', name: 'Ігрові методи', sym: '§9', count: 33 },
  { id: 'other', name: 'Інше', sym: '§*', count: 35 },
];

const D2Header = ({ active = 'home', subject }) => (
  <div style={{ borderBottom: `1px solid ${D2.borderStrong}`, padding: '20px 48px 16px', display: 'flex', alignItems: 'center', gap: 24, fontFamily: D2.sans, background: D2.bg }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 28, height: 28, background: D2.paper, color: D2.bg, fontFamily: D2.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.04em' }}>oi</div>
      <span style={{ fontFamily: D2.serif, fontSize: 18, color: D2.text, letterSpacing: '-0.01em' }}>oistudy</span>
    </div>
    <span style={{ width: 1, height: 16, background: D2.borderStrong }} />
    {['Бібліотека', 'Підготовка', 'Записник', 'Q/A'].map((t, i) => (
      <span key={i} style={{ fontSize: 13, color: i === ['home','prep','notes','qa'].indexOf(active) ? D2.text : D2.textDim, paddingBottom: 4, borderBottom: i === ['home','prep','notes','qa'].indexOf(active) ? `1.5px solid ${D2.accent}` : 'none', marginBottom: -17, paddingTop: 13, fontWeight: 500 }}>{t}</span>
    ))}
    <div style={{ flex: 1 }} />
    {subject && <span style={{ fontSize: 12, color: D2.textMute, fontFamily: D2.mono }}>{subject}</span>}
    <span style={{ fontSize: 12, color: D2.textDim }}>UK · EN</span>
    <div style={{ width: 26, height: 26, borderRadius: 99, background: D2.surface, border: `1px solid ${D2.border}`, color: D2.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>Р</div>
  </div>
);

// ─────────────────────────────────────────────
// 1. HOME
const D2Home = () => (
  <div style={{ width: '100%', height: '100%', background: D2.bg, color: D2.text, fontFamily: D2.sans, display: 'flex', flexDirection: 'column' }}>
    <D2Header active="home" />
    <div style={{ flex: 1, overflow: 'hidden' }}>
      {/* Hero */}
      <div style={{ padding: '40px 48px 32px', borderBottom: `1px solid ${D2.border}`, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 60 }}>
        <div>
          <div style={{ fontSize: 11, color: D2.accent, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Том I · Семестр VI</div>
          <h1 style={{ fontFamily: D2.serif, fontSize: 54, fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0 }}>
            Готуйся не до тесту,<br />а до <em style={{ color: D2.accent }}>розуміння</em>.
          </h1>
          <p style={{ fontSize: 15, color: D2.textDim, lineHeight: 1.6, marginTop: 18, maxWidth: 520 }}>
            Конспект — твоя бібліотека питань, пояснень і слабких місць для іспитів спеціальності ОІС. Кожне питання — з джерелом, темою та коментарем викладача.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button style={{ padding: '12px 22px', background: D2.paper, color: D2.bg, border: 'none', fontSize: 14, fontWeight: 600, fontFamily: D2.sans, cursor: 'pointer' }}>Відкрити предмет →</button>
            <button style={{ padding: '12px 22px', background: 'transparent', color: D2.text, border: `1px solid ${D2.borderStrong}`, fontSize: 14, fontFamily: D2.sans }}>Швидкий тест</button>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>До найближчого іспиту</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: D2.serif, fontSize: 72, fontWeight: 400, color: D2.text, letterSpacing: '-0.04em', lineHeight: 1 }}>12</span>
            <span style={{ fontSize: 14, color: D2.textDim }}>днів</span>
          </div>
          <div style={{ fontSize: 13, color: D2.textDim, marginTop: 4 }}>Дослідження операцій · 14 червня</div>
          <div style={{ marginTop: 22, padding: 16, background: D2.surface, borderLeft: `2px solid ${D2.accent}` }}>
            <div style={{ fontSize: 11, color: D2.accent, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>Фокус на сьогодні</div>
            <div style={{ fontFamily: D2.serif, fontSize: 18, lineHeight: 1.3, color: D2.text }}>«Двоїстість і транспортна задача — твої найслабші теми. 30 хв = +12% точності.»</div>
          </div>
        </div>
      </div>

      {/* Subjects as a typeset list */}
      <div style={{ padding: '32px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
        {[
          { tag: 'ДО', name: 'Дослідження операцій', qs: 520, acc: 62, weak: 3, hot: true },
          { tag: 'БД', name: 'Бази даних', qs: 410, acc: null },
          { tag: 'СА', name: 'Системний аналіз', qs: 287, acc: null },
        ].map((s, i) => (
          <div key={i} style={{ paddingBottom: 20, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontFamily: D2.serif, fontSize: 14, color: D2.textMute, fontStyle: 'italic' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: D2.mono, fontSize: 10, color: D2.accent, letterSpacing: '0.1em' }}>{s.tag}</span>
              {s.hot && <span style={{ fontSize: 10, color: D2.amber, fontFamily: D2.mono, letterSpacing: '0.06em' }}>● АКТИВНО</span>}
            </div>
            <div style={{ fontFamily: D2.serif, fontSize: 26, lineHeight: 1.15, fontWeight: 400, letterSpacing: '-0.01em', marginBottom: 14 }}>{s.name}</div>
            <div style={{ borderTop: `1px solid ${D2.border}`, paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              <span style={{ color: D2.textMute }}>Питань</span>
              <span style={{ fontFamily: D2.mono, color: D2.text, textAlign: 'right' }}>{s.qs}</span>
              <span style={{ color: D2.textMute }}>Точність</span>
              <span style={{ fontFamily: D2.mono, color: s.acc ? D2.text : D2.textMute, textAlign: 'right' }}>{s.acc ? s.acc + '%' : '—'}</span>
              {s.weak !== undefined && <>
                <span style={{ color: D2.textMute }}>Слабкі теми</span>
                <span style={{ fontFamily: D2.mono, color: D2.amber, textAlign: 'right' }}>{s.weak}</span>
              </>}
            </div>
            <div style={{ marginTop: 18, fontSize: 13, fontFamily: D2.serif, fontStyle: 'italic', color: D2.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>
              {s.acc ? 'продовжити читати' : 'розпочати курс'} →
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 2. SUBJECT OVERVIEW
const D2Subject = () => (
  <div style={{ width: '100%', height: '100%', background: D2.bg, color: D2.text, fontFamily: D2.sans, display: 'flex', flexDirection: 'column' }}>
    <D2Header active="prep" subject="ДО · сем. VI" />
    <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 320px' }}>
      {/* Main column */}
      <div style={{ padding: '40px 48px', borderRight: `1px solid ${D2.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
          <span style={{ fontFamily: D2.serif, fontSize: 13, color: D2.textMute, fontStyle: 'italic' }}>Том I, розділ 4</span>
          <span style={{ width: 24, height: 1, background: D2.borderStrong }} />
          <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.08em' }}>520 ПИТАНЬ · 9 ТЕМ</span>
        </div>
        <h1 style={{ fontFamily: D2.serif, fontSize: 46, fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', margin: '6px 0 12px' }}>
          Дослідження <em style={{ color: D2.accent, fontStyle: 'italic' }}>операцій</em>
        </h1>
        <p style={{ fontFamily: D2.serif, fontSize: 17, lineHeight: 1.55, color: D2.textDim, maxWidth: 580, fontStyle: 'italic' }}>
          Прикладна математика для прийняття рішень: лінійне програмування, теорія двоїстості, транспортні задачі, методи оптимізації та теорія ігор.
        </p>

        {/* Table of contents */}
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${D2.borderStrong}`, paddingBottom: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: D2.mono, fontSize: 11, letterSpacing: '0.1em', color: D2.textMute, textTransform: 'uppercase' }}>Зміст</span>
            <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute }}>точн. / питань</span>
          </div>
          {D2topics.slice(0, 9).map((t, i) => {
            const acc = [72, 58, 38, 44, 67, 55, 80, 49, 51][i];
            const done = [42, 71, 22, 31, 49, 28, 30, 18, 14][i];
            const weak = acc < 50;
            return (
              <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '46px 1fr 80px 80px', gap: 14, alignItems: 'baseline', padding: '12px 0', borderBottom: `1px solid ${D2.border}` }}>
                <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 16, color: D2.textMute }}>{t.sym}</span>
                <span style={{ fontFamily: D2.serif, fontSize: 18, color: D2.text, display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  {t.name}
                  {weak && <span style={{ fontSize: 9, color: D2.amber, letterSpacing: '0.1em', fontFamily: D2.mono, textTransform: 'uppercase' }}>● слабка тема</span>}
                </span>
                <span style={{ fontFamily: D2.mono, fontSize: 12, color: weak ? D2.amber : D2.textDim, textAlign: 'right' }}>{acc}%</span>
                <span style={{ fontFamily: D2.mono, fontSize: 12, color: D2.textMute, textAlign: 'right' }}>{done}/{t.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ padding: '40px 36px', overflow: 'hidden' }}>
        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Дії</div>
        {[
          { l: 'Швидкий тест', s: '15 випадкових питань', primary: true },
          { l: 'Каталог', s: 'Усі 520, з фільтрами' },
          { l: 'Слабкі місця', s: '3 теми, 19 питань' },
          { l: 'Q/A до предмету', s: '12 відповідей' },
        ].map((a, i) => (
          <div key={i} style={{ padding: '14px 0', borderBottom: i < 3 ? `1px solid ${D2.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: D2.serif, fontSize: 18, color: a.primary ? D2.accent : D2.text, fontStyle: a.primary ? 'italic' : 'normal' }}>{a.l}</span>
              <span style={{ color: D2.textMute, fontSize: 14 }}>→</span>
            </div>
            <div style={{ fontSize: 12, color: D2.textDim, marginTop: 2 }}>{a.s}</div>
          </div>
        ))}

        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 28, marginBottom: 12 }}>Нотатка викладача</div>
        <div style={{ paddingLeft: 14, borderLeft: `2px solid ${D2.accent}`, fontFamily: D2.serif, fontSize: 14, fontStyle: 'italic', color: D2.textDim, lineHeight: 1.5 }}>
          «На іспиті більшість студентів плутає двоїстість із транспортною. Уважно з симетричними та несиметричними парами.»
          <div style={{ fontFamily: D2.sans, fontSize: 11, color: D2.textMute, fontStyle: 'normal', marginTop: 8 }}>— проф. Iванов, 2025</div>
        </div>
      </div>
    </div>
  </div>
);

// 3. TEST BUILDER
const D2Builder = () => {
  const sel = [true, true, false, true, true, false, true, true, true, true];
  return (
    <div style={{ width: '100%', height: '100%', background: D2.bg, color: D2.text, fontFamily: D2.sans, display: 'flex', flexDirection: 'column' }}>
      <D2Header active="prep" subject="ДО · новий тест" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 380px' }}>
        <div style={{ padding: '40px 48px', borderRight: `1px solid ${D2.border}`, overflow: 'hidden' }}>
          <div style={{ fontFamily: D2.mono, fontSize: 11, color: D2.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Підготовка</div>
          <h1 style={{ fontFamily: D2.serif, fontSize: 42, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1 }}>Складання тесту</h1>
          <p style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 16, color: D2.textDim, marginTop: 0 }}>Обери розділи та обсяг. Усе інше — налаштування за замовчуванням.</p>

          <div style={{ marginTop: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${D2.borderStrong}`, paddingBottom: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: D2.mono, fontSize: 11, letterSpacing: '0.1em', color: D2.textMute, textTransform: 'uppercase' }}>Розділи</span>
              <span style={{ fontSize: 12, color: D2.textDim, display: 'flex', gap: 16 }}>
                <span>усі</span><span>жодного</span><span style={{ color: D2.accent }}>лише слабкі</span>
              </span>
            </div>
            {D2topics.map((t, i) => {
              const acc = [72, 58, 38, 44, 67, 55, 80, 49, 51, 60][i];
              return (
                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '20px 36px 1fr 60px 60px', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${D2.border}` }}>
                  <div style={{ width: 16, height: 16, border: `1.5px solid ${sel[i] ? D2.accent : D2.borderStrong}`, background: sel[i] ? D2.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel[i] && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 5L4 8L9 2" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 14, color: D2.textMute }}>{t.sym}</span>
                  <span style={{ fontFamily: D2.serif, fontSize: 17 }}>{t.name}</span>
                  <span style={{ fontFamily: D2.mono, fontSize: 12, color: acc < 50 ? D2.amber : D2.textDim, textAlign: 'right' }}>{acc}%</span>
                  <span style={{ fontFamily: D2.mono, fontSize: 12, color: D2.textMute, textAlign: 'right' }}>{t.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right composition pane */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Готується</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: D2.serif, fontSize: 88, color: D2.text, letterSpacing: '-0.04em', lineHeight: 0.9 }}>25</span>
            <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 18, color: D2.textDim }}>питань</span>
          </div>
          <div style={{ fontSize: 12, color: D2.textMute, fontFamily: D2.mono, marginTop: 6 }}>~ 12 ХВ · 78 ДОСТУПНИХ</div>

          <div style={{ marginTop: 30, fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Обсяг</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {[10, 25, 50, 78].map((n, i) => (
              <div key={i} style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontFamily: D2.mono, fontSize: 13, border: `1px solid ${n === 25 ? D2.accent : D2.border}`, color: n === 25 ? D2.accent : D2.textDim, background: n === 25 ? 'rgba(220,38,38,0.06)' : 'transparent' }}>{n}</div>
            ))}
          </div>

          <div style={{ marginTop: 26, fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Опції</div>
          {[
            { l: 'Пояснення відразу', on: true },
            { l: 'Перемішувати варіанти', on: true },
            { l: 'Таймер 60 с / питання', on: false },
            { l: 'Лише слабкі (< 60%)', on: false },
          ].map((o, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? `1px solid ${D2.border}` : 'none', fontSize: 13 }}>
              <span style={{ fontFamily: D2.serif, fontStyle: 'italic' }}>{o.l}</span>
              <span style={{ fontFamily: D2.mono, fontSize: 11, color: o.on ? D2.accent : D2.textMute, letterSpacing: '0.1em' }}>{o.on ? '● УВІМК.' : '○ ВИМК.'}</span>
            </div>
          ))}

          <div style={{ flex: 1 }} />
          <button style={{ padding: '16px', background: D2.accent, color: '#fff', border: 'none', fontFamily: D2.serif, fontStyle: 'italic', fontSize: 18, marginTop: 24, cursor: 'pointer' }}>
            Розпочати тест →
          </button>
          <div style={{ textAlign: 'center', fontSize: 11, color: D2.textMute, marginTop: 10, fontFamily: D2.mono }}>⌘ ↵ ЩОБ ЗАПУСТИТИ</div>
        </div>
      </div>
    </div>
  );
};

// 4. TEST-TAKING (mobile)
const D2Take = () => (
  <div style={{ width: '100%', height: '100%', background: D2.bg, color: D2.text, fontFamily: D2.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <div style={{ padding: '8px 24px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: D2.textMute, fontFamily: D2.mono, letterSpacing: '0.06em' }}>СЕСІЯ · 00:42</span>
        <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 14, color: D2.textDim }}>
          <span style={{ color: D2.text, fontFamily: D2.mono, fontStyle: 'normal' }}>7</span> з <span style={{ fontFamily: D2.mono, fontStyle: 'normal' }}>25</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, background: i < 6 ? (i === 1 || i === 4 ? D2.accent : D2.green) : i === 6 ? D2.text : D2.borderStrong }} />
        ))}
      </div>
    </div>

    <div style={{ flex: 1, padding: '8px 26px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
        <span style={{ fontFamily: D2.serif, fontSize: 13, fontStyle: 'italic', color: D2.textMute }}>§4 · Транспортна задача</span>
        <span style={{ flex: 1, height: 1, background: D2.border }} />
        <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute }}>#142</span>
      </div>
      <h2 style={{ fontFamily: D2.serif, fontSize: 22, lineHeight: 1.3, fontWeight: 400, letterSpacing: '-0.01em', margin: 0 }}>
        Метод Фогеля для розв'язання транспортної задачі базується на:
      </h2>

      <div style={{ marginTop: 22 }}>
        {[
          { l: 'a', t: 'Градієнтах функції', state: 'normal' },
          { l: 'б', t: 'Потенціалах рядків та стовпців', state: 'correct' },
          { l: 'в', t: 'Похідних обмежень', state: 'wrong' },
          { l: 'г', t: 'Штрафних вартостях', state: 'normal' },
        ].map((o, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '13px 0',
            borderBottom: i < 3 ? `1px solid ${D2.border}` : 'none',
            alignItems: 'baseline',
            opacity: o.state === 'wrong' ? 0.5 : 1,
          }}>
            <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 16, color: o.state === 'correct' ? D2.accent : o.state === 'wrong' ? D2.accentSoft : D2.textMute, width: 18 }}>{o.l})</span>
            <span style={{ fontFamily: D2.serif, fontSize: 16, flex: 1, textDecoration: o.state === 'wrong' ? 'line-through' : 'none', color: o.state === 'correct' ? D2.text : D2.textDim }}>
              {o.t}
            </span>
            {o.state === 'correct' && <span style={{ fontFamily: D2.mono, fontSize: 10, color: D2.accent, letterSpacing: '0.12em' }}>✓ ВІРНО</span>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '16px 18px', background: D2.surface, borderLeft: `2px solid ${D2.accent}` }}>
        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.accent, letterSpacing: '0.12em', marginBottom: 6 }}>ПРИМІТКА</div>
        <div style={{ fontFamily: D2.serif, fontSize: 14, lineHeight: 1.5, fontStyle: 'italic', color: D2.textDim }}>
          Метод Фогеля використовує <span style={{ color: D2.text, fontStyle: 'normal' }}>штрафні різниці</span> між двома найменшими тарифами в кожному рядку та стовпці — щоб уникнути «дорогих» комбінацій.
        </div>
      </div>
    </div>

    <div style={{ padding: '14px 26px 4px', display: 'flex', alignItems: 'center', gap: 12, borderTop: `1px solid ${D2.border}` }}>
      <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute }}>⌥ закладка</span>
      <div style={{ flex: 1 }} />
      <button style={{ padding: '11px 24px', background: D2.paper, color: D2.bg, border: 'none', fontFamily: D2.serif, fontStyle: 'italic', fontSize: 17, fontWeight: 500 }}>Далі →</button>
    </div>
    <HomeIndicator />
  </div>
);

// 5. RESULTS
const D2Results = () => (
  <div style={{ width: '100%', height: '100%', background: D2.bg, color: D2.text, fontFamily: D2.sans, display: 'flex', flexDirection: 'column' }}>
    <D2Header active="prep" subject="ДО · результат" />
    <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 320px' }}>
      <div style={{ padding: '40px 48px', borderRight: `1px solid ${D2.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4 }}>
          <span style={{ fontFamily: D2.mono, fontSize: 11, letterSpacing: '0.14em', color: D2.textMute, textTransform: 'uppercase' }}>Сесія № 54 · 26 трав, 14:22 · 11:22 хв</span>
        </div>
        <h1 style={{ fontFamily: D2.serif, fontSize: 64, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1, margin: '8px 0 0' }}>
          76<span style={{ color: D2.textMute }}>%</span>
        </h1>
        <p style={{ fontFamily: D2.serif, fontSize: 19, fontStyle: 'italic', color: D2.textDim, marginTop: 8 }}>
          19 із 25 правильно. На <em style={{ color: D2.accent }}>14% краще</em> за середній результат.
        </p>

        {/* Per-topic */}
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${D2.borderStrong}`, paddingBottom: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: D2.mono, fontSize: 11, letterSpacing: '0.1em', color: D2.textMute, textTransform: 'uppercase' }}>За темами</span>
          </div>
          {[
            { sym: '§4', name: 'Транспортна', got: 7, total: 8 },
            { sym: '§2', name: 'Лінійне · симплекс', got: 5, total: 6 },
            { sym: '§3', name: 'Двоїстість', got: 2, total: 5, weak: true },
            { sym: '§9', name: 'Ігрові методи', got: 5, total: 6 },
          ].map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 60px', gap: 14, alignItems: 'baseline', padding: '14px 0', borderBottom: `1px solid ${D2.border}` }}>
              <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 14, color: D2.textMute }}>{t.sym}</span>
              <span style={{ fontFamily: D2.serif, fontSize: 17 }}>
                {t.name}
                {t.weak && <span style={{ marginLeft: 8, fontSize: 10, color: D2.amber, fontFamily: D2.mono, letterSpacing: '0.1em' }}>● ПОТРЕБУЄ УВАГИ</span>}
              </span>
              <span style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {Array.from({ length: t.total }).map((_, j) => (
                  <span key={j} style={{ width: 8, height: 12, background: j < t.got ? D2.text : 'rgba(255,240,220,0.12)' }} />
                ))}
              </span>
              <span style={{ fontFamily: D2.mono, fontSize: 13, textAlign: 'right', color: t.weak ? D2.amber : D2.textDim }}>{t.got}/{t.total}</span>
            </div>
          ))}
        </div>

        {/* Errors */}
        <div style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 36, marginBottom: 10 }}>Помилки</div>
        {[
          { n: 4, t: 'Якщо пряма задача є задачею максимізації, двоїста...', user: 'необмежена', right: 'мінімізації' },
          { n: 11, t: 'Метод штучного базису потребує:', user: 'M-методу', right: 'двофазового методу' },
        ].map((e, i) => (
          <div key={i} style={{ paddingTop: 16, borderTop: `1px solid ${D2.border}` }}>
            <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute }}>#{e.n}</div>
            <div style={{ fontFamily: D2.serif, fontSize: 16, marginTop: 4 }}>{e.t}</div>
            <div style={{ fontSize: 12, color: D2.textDim, marginTop: 6 }}>
              Ти обрав <span style={{ color: D2.accentSoft, textDecoration: 'line-through', fontFamily: D2.serif, fontStyle: 'italic' }}>{e.user}</span>
              <span style={{ margin: '0 10px' }}>·</span>
              правильно <span style={{ color: D2.green, fontFamily: D2.serif, fontStyle: 'italic' }}>{e.right}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Прогрес предмету</div>
        <div style={{ fontFamily: D2.serif, fontSize: 42, marginTop: 8, letterSpacing: '-0.02em' }}>62%<span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 16, color: D2.green, marginLeft: 10 }}>+4</span></div>
        <div style={{ marginTop: 16, height: 4, background: D2.surface }}>
          <div style={{ width: '62%', height: '100%', background: D2.text }} />
        </div>

        <div style={{ marginTop: 30, padding: 18, background: D2.surface, borderLeft: `2px solid ${D2.accent}` }}>
          <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.accent, letterSpacing: '0.12em', marginBottom: 6 }}>РЕКОМЕНДАЦІЯ</div>
          <div style={{ fontFamily: D2.serif, fontSize: 16, fontStyle: 'italic', lineHeight: 1.4 }}>
            «Двоїстість» все ще слабка. 10 цілеспрямованих питань — і ймовірно подолаєш поріг 60%.
          </div>
          <button style={{ marginTop: 14, padding: '10px 16px', background: D2.accent, color: '#fff', border: 'none', fontSize: 13, fontFamily: D2.sans, fontWeight: 500 }}>Тест зі слабких тем →</button>
        </div>

        <div style={{ flex: 1 }} />
        <button style={{ padding: '12px', background: 'transparent', border: `1px solid ${D2.borderStrong}`, color: D2.text, fontFamily: D2.serif, fontStyle: 'italic', fontSize: 15 }}>Новий тест</button>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={{ flex: 1, padding: '8px', background: 'transparent', border: `1px solid ${D2.border}`, color: D2.textDim, fontFamily: D2.mono, fontSize: 11, letterSpacing: '0.06em' }}>ПОВТОР</button>
          <button style={{ flex: 1, padding: '8px', background: 'transparent', border: `1px solid ${D2.border}`, color: D2.textDim, fontFamily: D2.mono, fontSize: 11, letterSpacing: '0.06em' }}>ЕКСПОРТ</button>
        </div>
      </div>
    </div>
  </div>
);

// 6. CATALOG
const D2Catalog = () => (
  <div style={{ width: '100%', height: '100%', background: D2.bg, color: D2.text, fontFamily: D2.sans, display: 'flex', flexDirection: 'column' }}>
    <D2Header active="home" subject="ДО · бібліотека" />
    <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr' }}>
      {/* Filters */}
      <div style={{ padding: '32px 28px', borderRight: `1px solid ${D2.border}`, overflow: 'hidden' }}>
        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>Фільтри</div>

        <div style={{ height: 38, border: `1px solid ${D2.borderStrong}`, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: D2.textMute, fontFamily: D2.serif, fontStyle: 'italic' }}>
          <svg width="13" height="13" viewBox="0 0 14 14"><circle cx="6" cy="6" r="4.5" stroke={D2.textMute} strokeWidth="1.3" fill="none"/><path d="M9.5 9.5L12.5 12.5" stroke={D2.textMute} strokeWidth="1.3" strokeLinecap="round"/></svg>
          пошук фрагменту...
        </div>

        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 24, marginBottom: 8 }}>Теми</div>
        {D2topics.map(t => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '14px 30px 1fr 28px', gap: 8, alignItems: 'baseline', padding: '7px 0', borderBottom: `1px solid ${D2.border}` }}>
            <div style={{ width: 12, height: 12, border: `1.5px solid ${t.id === 'trans' ? D2.accent : D2.borderStrong}`, background: t.id === 'trans' ? D2.accent : 'transparent' }} />
            <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 12, color: D2.textMute }}>{t.sym}</span>
            <span style={{ fontFamily: D2.serif, fontSize: 14, color: t.id === 'trans' ? D2.text : D2.textDim }}>{t.name}</span>
            <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute, textAlign: 'right' }}>{t.count}</span>
          </div>
        ))}

        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 22, marginBottom: 8 }}>Точність</div>
        {['Слабкі (< 50%)', 'Середні', 'Сильні (> 75%)'].map((l, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', fontFamily: D2.serif, fontSize: 13, color: D2.textDim }}>
            <div style={{ width: 12, height: 12, border: `1.5px solid ${D2.borderStrong}` }} />{l}
          </div>
        ))}
      </div>

      {/* Articles */}
      <div style={{ overflow: 'hidden', padding: '32px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4 }}>
          <h1 style={{ fontFamily: D2.serif, fontSize: 38, fontWeight: 400, letterSpacing: '-0.02em', margin: 0 }}>Бібліотека</h1>
          <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 15, color: D2.textDim }}>520 питань, відібрано 30</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.accent, letterSpacing: '0.06em' }}>● ПОКАЗАТИ ВІДПОВІДІ</span>
        </div>

        <div style={{ marginTop: 24 }}>
          {[
            { n: 1, sym: '§4', t: 'Метод Фогеля для розв\'язання транспортної задачі використовує:', opts: ['Градієнти', 'Потенціали', 'Похідні', 'Штрафні вартості'], r: 3 },
            { n: 2, sym: '§7', t: 'Ефективність методу Ньютона значною мірою залежить від:', opts: ['Випадкового вибору точки', 'Симплекса', 'Умов збіжності', 'Матриці Гессе'], r: 3 },
            { n: 3, sym: '§3', t: 'Якщо пряма задача максимізації, то двоїста є:', opts: ['Максимізації', 'Мінімізації', 'Необмежена', 'Несумісна'], r: 1 },
          ].map((q, i) => (
            <article key={i} style={{ padding: '20px 0 24px', borderBottom: `1px solid ${D2.border}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute, letterSpacing: '0.06em' }}>#{q.n}</span>
                <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 12, color: D2.accent }}>{q.sym}</span>
              </div>
              <h3 style={{ fontFamily: D2.serif, fontSize: 21, lineHeight: 1.25, fontWeight: 400, margin: '4px 0 14px', letterSpacing: '-0.01em' }}>{q.t}</h3>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {q.opts.map((o, j) => (
                  <li key={j} style={{ display: 'flex', gap: 12, padding: '5px 0', fontFamily: D2.serif, fontSize: 15, color: j === q.r ? D2.text : D2.textDim }}>
                    <span style={{ fontStyle: 'italic', color: j === q.r ? D2.accent : D2.textMute, width: 18 }}>{['а','б','в','г'][j]})</span>
                    <span style={{ flex: 1 }}>{o}</span>
                    {j === q.r && <span style={{ fontFamily: D2.mono, fontSize: 10, color: D2.accent, letterSpacing: '0.12em' }}>✓</span>}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 7. ADMIN
const D2Admin = () => (
  <div style={{ width: '100%', height: '100%', background: D2.bg, color: D2.text, fontFamily: D2.sans, display: 'flex', flexDirection: 'column' }}>
    <D2Header active="prep" subject="Адмін · редколегія" />
    <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '220px 1fr 400px' }}>
      <div style={{ padding: '32px 24px', borderRight: `1px solid ${D2.border}`, fontFamily: D2.serif }}>
        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Розділ</div>
        {[
          { l: 'Питання', n: 520, a: true },
          { l: 'Теми', n: 9 },
          { l: 'Предмети', n: 3 },
          { l: 'Імпорт CSV', n: null },
          { l: 'Q/A модерація', n: 4 },
          { l: 'Студенти', n: 142 },
        ].map((it, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${D2.border}`, color: it.a ? D2.text : D2.textDim, fontStyle: it.a ? 'italic' : 'normal' }}>
            <span style={{ fontSize: 15 }}>{it.l}</span>
            <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute }}>{it.n ?? ''}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '32px 36px', overflow: 'hidden', borderRight: `1px solid ${D2.border}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
          <h1 style={{ fontFamily: D2.serif, fontSize: 34, fontWeight: 400, letterSpacing: '-0.02em', margin: 0 }}>Питання</h1>
          <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 15, color: D2.textDim }}>520, з них 4 у чернетках</span>
          <div style={{ flex: 1 }} />
          <button style={{ padding: '8px 14px', background: D2.accent, color: '#fff', border: 'none', fontFamily: D2.serif, fontStyle: 'italic', fontSize: 14 }}>+ нове</button>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '36px 56px 1fr 90px 80px', gap: 12, padding: '8px 0', borderBottom: `1px solid ${D2.borderStrong}`, fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span>#</span><span>тема</span><span>текст</span><span>точн.</span><span>стат.</span>
          </div>
          {[
            { n: 142, sym: '§4', t: 'Метод Фогеля для розв\'язання...', acc: 44, s: 'опубл.' },
            { n: 143, sym: '§3', t: 'Двоїста задача мінімізації передбачає...', acc: 51, s: 'опубл.' },
            { n: 144, sym: '§8', t: 'У методі Ньютона матриця Гессе повинна бути...', acc: null, s: 'чернетка', d: true },
            { n: 145, sym: '§5', t: 'Алгоритм Дейкстри застосовується для...', acc: 78, s: 'опубл.' },
            { n: 146, sym: '§9', t: 'У теорії ігор сідлова точка існує коли...', acc: null, s: 'ревʼю', r: true },
            { n: 147, sym: '§2', t: 'Виродженість базисного розв\'язку...', acc: 62, s: 'опубл.' },
          ].map((q, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 56px 1fr 90px 80px', gap: 12, padding: '12px 0', borderBottom: `1px solid ${D2.border}`, alignItems: 'baseline', background: q.d ? 'rgba(233,162,59,0.04)' : 'transparent', paddingLeft: q.d ? 8 : 0, marginLeft: q.d ? -8 : 0 }}>
              <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.textMute }}>{q.n}</span>
              <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 13, color: D2.accent }}>{q.sym}</span>
              <span style={{ fontFamily: D2.serif, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.t}</span>
              <span style={{ fontFamily: D2.mono, fontSize: 11, color: q.acc === null ? D2.textMute : q.acc < 50 ? D2.amber : D2.textDim }}>{q.acc === null ? '—' : q.acc + '%'}</span>
              <span style={{ fontFamily: D2.mono, fontSize: 10, letterSpacing: '0.08em', color: q.d ? D2.amber : q.r ? D2.accent : D2.textDim, textTransform: 'uppercase' }}>{q.s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 32px', overflow: 'hidden', background: D2.surface }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Чернетка №144</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: D2.mono, fontSize: 11, color: D2.amber }}>● не збережено</span>
        </div>
        <h2 style={{ fontFamily: D2.serif, fontSize: 22, lineHeight: 1.3, fontWeight: 400, margin: '8px 0 14px', borderBottom: `1px dashed ${D2.borderStrong}`, paddingBottom: 14 }}>
          У методі Ньютона матриця Гессе повинна бути<span style={{ color: D2.accent }}>|</span>
        </h2>

        <div style={{ fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Варіанти</div>
        {['Додатньо визначеною', 'Симетричною', 'Невиродженою', 'Виродженою'].map((o, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '8px 0', borderBottom: `1px solid ${D2.border}` }}>
            <span style={{ fontFamily: D2.serif, fontStyle: 'italic', fontSize: 14, color: i === 0 ? D2.accent : D2.textMute, width: 18 }}>{['а','б','в','г'][i]})</span>
            <span style={{ fontFamily: D2.serif, fontSize: 15, flex: 1, color: i === 0 ? D2.text : D2.textDim }}>{o}</span>
            {i === 0 && <span style={{ fontFamily: D2.mono, fontSize: 10, color: D2.accent, letterSpacing: '0.1em' }}>✓ ПРАВ.</span>}
          </div>
        ))}

        <div style={{ marginTop: 22, fontFamily: D2.mono, fontSize: 10, color: D2.textMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Пояснення (Markdown)</div>
        <div style={{ padding: 14, background: D2.bg, fontFamily: D2.serif, fontStyle: 'italic', fontSize: 14, color: D2.textDim, lineHeight: 1.55, border: `1px solid ${D2.border}` }}>
          Метод Ньютона збігається до локального мінімуму лише коли матриця Гессе **додатньо визначена** в околі точки...
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, padding: '12px', background: D2.accent, color: '#fff', border: 'none', fontFamily: D2.serif, fontStyle: 'italic', fontSize: 15 }}>Опублікувати →</button>
          <button style={{ padding: '12px 18px', background: 'transparent', border: `1px solid ${D2.borderStrong}`, color: D2.textDim, fontFamily: D2.mono, fontSize: 11, letterSpacing: '0.06em' }}>ЗБЕРЕГТИ</button>
        </div>
      </div>
    </div>
  </div>
);

window.D2Screens = { D2Home, D2Subject, D2Builder, D2Take, D2Results, D2Catalog, D2Admin };

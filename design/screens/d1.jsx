// Direction 1 · Метод — Linear-inspired
// Deep navy + cyan, clean sans, mono numerals, dense

const D1 = {
  bg: '#0a0b0d',
  surface: '#111315',
  surface2: '#15181c',
  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.1)',
  text: '#e6e8ec',
  textDim: '#a0a4ac',
  textMute: '#6b7079',
  accent: '#5eb6ff',
  accentDim: 'rgba(94,182,255,0.15)',
  violet: '#a78bfa',
  green: '#4ade80',
  amber: '#fbbf24',
  red: '#f87171',
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

const topics = [
  { id: 'gen', name: 'Загальні', color: '#a0a4ac', count: 48 },
  { id: 'lp', name: 'ЛП · симплекс', color: '#5eb6ff', count: 86 },
  { id: 'dual', name: 'Двоїстість', color: '#a78bfa', count: 54 },
  { id: 'trans', name: 'Транспортна', color: '#4ade80', count: 71 },
  { id: 'disc', name: 'Дискретне ЛП', color: '#34d399', count: 62 },
  { id: 'nonlin', name: 'Нелінійне', color: '#fbbf24', count: 49 },
  { id: 'uni', name: 'Одновимірна', color: '#c084fc', count: 38 },
  { id: 'multi', name: 'Багатовимірна', color: '#ec4899', count: 44 },
  { id: 'game', name: 'Ігрові методи', color: '#f87171', count: 33 },
  { id: 'other', name: 'Інше', color: '#6b7079', count: 35 },
];

// ─────────────────────────────────────────────
// Top bar shared across desktop screens
const D1Topbar = ({ subject, active }) => (
  <div style={{
    height: 44, borderBottom: `1px solid ${D1.border}`,
    display: 'flex', alignItems: 'center', padding: '0 16px',
    background: D1.bg, fontFamily: D1.sans, fontSize: 13, color: D1.text,
    gap: 14,
  }}>
    <div style={{
      width: 22, height: 22, borderRadius: 6,
      background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: D1.mono, fontSize: 10, fontWeight: 700, color: '#0a0b0d',
      letterSpacing: '-0.02em',
    }}>oi</div>
    <span style={{ color: D1.textMute, fontSize: 12 }}>oistudy</span>
    {subject && <>
      <span style={{ color: D1.textMute }}>/</span>
      <span style={{ color: D1.text, fontWeight: 500 }}>{subject}</span>
    </>}
    <div style={{ flex: 1 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: D1.textDim, fontSize: 12 }}>
      <span style={{ padding: '4px 8px', borderRadius: 5, background: D1.surface2 }}>Пошук</span>
      <Kbd>⌘</Kbd><Kbd>K</Kbd>
    </div>
    <div style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${D1.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: D1.textDim }}>R</div>
  </div>
);

const D1SideNav = ({ active = 'home' }) => {
  const items = [
    { id: 'home', name: 'Огляд', kb: 'G H' },
    { id: 'subjects', name: 'Предмети', kb: 'G S' },
    { id: 'test', name: 'Тест', kb: 'T' },
    { id: 'cat', name: 'Каталог', kb: 'C' },
    { id: 'qa', name: 'Q/A', kb: '?' },
  ];
  return (
    <div style={{ width: 188, borderRight: `1px solid ${D1.border}`, padding: '14px 8px', fontFamily: D1.sans, fontSize: 13 }}>
      <div style={{ padding: '4px 10px', color: D1.textMute, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Робоча область</div>
      {items.map(it => (
        <div key={it.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', borderRadius: 6, marginBottom: 1,
          background: active === it.id ? D1.surface2 : 'transparent',
          color: active === it.id ? D1.text : D1.textDim,
          fontWeight: active === it.id ? 500 : 400,
        }}>
          <span>{it.name}</span>
          <span style={{ fontFamily: D1.mono, fontSize: 10, color: D1.textMute, letterSpacing: 0 }}>{it.kb}</span>
        </div>
      ))}
      <div style={{ padding: '4px 10px', color: D1.textMute, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '18px 0 6px' }}>Предмети</div>
      {[
        { name: 'Дослідження операцій', tag: 'ДО', active: true },
        { name: 'Бази даних', tag: 'БД' },
        { name: 'Системний аналіз', tag: 'СА' },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', color: s.active ? D1.text : D1.textDim, borderRadius: 6, background: s.active ? D1.surface2 : 'transparent' }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, background: D1.surface, fontFamily: D1.mono, fontSize: 9, fontWeight: 600, color: D1.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.tag}</span>
          <span style={{ flex: 1, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// 1. HOME / SUBJECT HUB
const D1Home = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="home" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '32px 40px 24px', borderBottom: `1px solid ${D1.border}` }}>
          <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Огляд · 1 предмет</div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>З поверненням, Роман.</div>
          <div style={{ fontSize: 14, color: D1.textDim, marginTop: 4 }}>До найближчого іспиту — <span style={{ fontFamily: D1.mono, color: D1.text }}>12 днів</span>. Сьогодні рекомендуємо опрацювати <span style={{ color: D1.accent }}>Двоїстість</span> та <span style={{ color: D1.accent }}>Транспортну задачу</span>.</div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: `1px solid ${D1.border}` }}>
          {[
            { l: 'Опрацьовано', v: '322', s: '/ 520 питань' },
            { l: 'Точність', v: '62%', s: '+4 за тиждень', up: true },
            { l: 'Серія', v: '7', s: 'днів поспіль' },
            { l: 'Слабкі теми', v: '3', s: 'потребують уваги', warn: true },
          ].map((s, i) => (
            <div key={i} style={{ padding: '18px 24px', borderRight: i < 3 ? `1px solid ${D1.border}` : 'none' }}>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.l}</div>
              <div style={{ fontFamily: D1.mono, fontSize: 24, fontWeight: 500, color: s.warn ? D1.amber : D1.text, marginTop: 4, letterSpacing: '-0.02em' }}>{s.v}</div>
              <div style={{ fontSize: 11, color: s.up ? D1.green : D1.textMute, marginTop: 2 }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* Two-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0 }}>
          {/* Subjects list */}
          <div style={{ padding: '20px 24px 24px 40px', borderRight: `1px solid ${D1.border}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Предмети</div>
              <div style={{ fontSize: 11, color: D1.textMute }}>Sort: остання активність</div>
            </div>
            <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, overflow: 'hidden', background: D1.surface }}>
              {[
                { tag: 'ДО', name: 'Дослідження операцій', topics: 9, qs: 520, acc: 62, done: 322, hot: true },
                { tag: 'БД', name: 'Бази даних', topics: 7, qs: 410, acc: 0, done: 0, hot: false, empty: true },
                { tag: 'СА', name: 'Системний аналіз', topics: 6, qs: 287, acc: 0, done: 0, hot: false, empty: true },
              ].map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 90px 110px', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < 2 ? `1px solid ${D1.border}` : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: s.empty ? D1.surface2 : 'linear-gradient(135deg,#5eb6ff,#a78bfa)', fontFamily: D1.mono, fontSize: 11, fontWeight: 700, color: s.empty ? D1.textMute : '#0a0b0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.tag}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {s.name}
                      {s.hot && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 3, background: 'rgba(251,191,36,0.12)', color: D1.amber, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>активний</span>}
                    </div>
                    <div style={{ fontSize: 11, color: D1.textMute, marginTop: 2, fontFamily: D1.mono }}>{s.qs} питань · {s.topics} тем</div>
                  </div>
                  <div style={{ fontFamily: D1.mono, fontSize: 12, color: s.empty ? D1.textMute : D1.text }}>{s.empty ? '—' : `${s.done}/${s.qs}`}</div>
                  <div style={{ fontFamily: D1.mono, fontSize: 12, color: s.empty ? D1.textMute : D1.accent }}>{s.empty ? '—' : `${s.acc}%`}</div>
                  <div style={{ fontSize: 11, color: D1.textDim, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    {s.empty ? 'Почати' : 'Продовжити'}
                    <span style={{ color: D1.textMute }}>→</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 24, marginBottom: 12 }}>Рекомендоване на сьогодні</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { l: 'Швидкий тест', s: '15 питань · 8 хв', a: D1.accent },
                { l: 'Слабкі місця', s: 'Двоїстість, Транспортна', a: D1.amber },
              ].map((r, i) => (
                <div key={i} style={{ padding: 14, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface }}>
                  <div style={{ width: 6, height: 6, borderRadius: 99, background: r.a, marginBottom: 8 }} />
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.l}</div>
                  <div style={{ fontSize: 11, color: D1.textMute, marginTop: 2 }}>{r.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div style={{ padding: '20px 40px 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Активність</div>
              <div style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>Останні 12 тижнів</div>
            </div>
            {/* Heatmap */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3, padding: 12, background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 8 }}>
              {Array.from({ length: 12 * 7 }).map((_, i) => {
                const seed = (Math.sin(i * 9.3) + 1) / 2;
                const v = seed > 0.85 ? 4 : seed > 0.65 ? 3 : seed > 0.4 ? 2 : seed > 0.2 ? 1 : 0;
                const c = ['rgba(255,255,255,0.04)', 'rgba(94,182,255,0.15)', 'rgba(94,182,255,0.35)', 'rgba(94,182,255,0.6)', 'rgba(94,182,255,0.9)'][v];
                return <div key={i} style={{ aspectRatio: '1', borderRadius: 2, background: c }} />;
              })}
            </div>
            <div style={{ fontSize: 11, color: D1.textMute, marginTop: 8, fontFamily: D1.mono, display: 'flex', justifyContent: 'space-between' }}>
              <span>54 сесії</span><span>1,247 питань</span>
            </div>

            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 24, marginBottom: 10 }}>Слабкі теми</div>
            {[
              { name: 'Двоїстість', acc: 38, color: D1.violet },
              { name: 'Транспортна', acc: 44, color: D1.green },
              { name: 'Ігрові методи', acc: 51, color: D1.red },
            ].map((t, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: t.color }} />{t.name}</span>
                  <span style={{ fontFamily: D1.mono, color: D1.amber }}>{t.acc}%</span>
                </div>
                <div style={{ height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${t.acc}%`, height: '100%', background: D1.amber, opacity: 0.7 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: '8px 12px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.textDim, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Створити тест зі слабких тем</span>
              <Kbd>F</Kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 2. SUBJECT OVERVIEW
const D1Subject = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Дослідження операцій" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="subjects" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '28px 40px 22px', borderBottom: `1px solid ${D1.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontWeight: 700, color: '#0a0b0d' }}>ДО</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Дослідження операцій</div>
              <div style={{ fontSize: 12, color: D1.textMute, fontFamily: D1.mono, marginTop: 2 }}>520 питань · 9 тем · 62% точність</div>
            </div>
            <div style={{ flex: 1 }} />
            <button style={{ padding: '7px 12px', borderRadius: 6, background: D1.accent, border: 'none', color: '#0a0b0d', fontSize: 12, fontWeight: 600, fontFamily: D1.sans, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <span>▶</span> Швидкий тест <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>T</Kbd>
            </button>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 22, fontSize: 13, marginTop: 18 }}>
            {['Огляд', 'Теми', 'Каталог', 'Результати', 'Q/A'].map((t, i) => (
              <div key={i} style={{ paddingBottom: 10, color: i === 0 ? D1.text : D1.textDim, borderBottom: i === 0 ? `1.5px solid ${D1.accent}` : 'none', marginBottom: -1, fontWeight: i === 0 ? 500 : 400 }}>{t}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0, flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 24px 40px', overflow: 'hidden' }}>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Теми · 9</div>
            <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, overflow: 'hidden', background: D1.surface }}>
              {topics.slice(0, 9).map((t, i) => {
                const acc = [72, 58, 38, 44, 67, 55, 80, 49, 51][i];
                const done = [42, 71, 22, 31, 49, 28, 30, 18, 14][i];
                return (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 90px 70px 70px 80px', alignItems: 'center', gap: 14, padding: '11px 16px', borderBottom: i < 8 ? `1px solid ${D1.border}` : 'none' }}>
                    <span style={{ width: 7, height: 7, borderRadius: 99, background: t.color }} />
                    <span style={{ fontSize: 13 }}>{t.name}</span>
                    <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>{done}/{t.count}</span>
                    <div style={{ height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: `${(done / t.count) * 100}%`, height: '100%', background: t.color, opacity: 0.7, borderRadius: 999 }} />
                    </div>
                    <span style={{ fontFamily: D1.mono, fontSize: 12, color: acc < 50 ? D1.amber : acc < 65 ? D1.text : D1.green }}>{acc}%</span>
                    <span style={{ fontSize: 11, color: D1.textDim, textAlign: 'right' }}>Почати →</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ padding: '20px 40px 24px 24px', borderLeft: `1px solid ${D1.border}` }}>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Швидкі дії</div>
            {[
              { l: 'Тест', s: 'Випадкові питання з тем', k: 'T' },
              { l: 'Каталог', s: '520 питань · фільтри', k: 'C' },
              { l: 'Слабкі місця', s: '3 теми < 50% точність', k: 'F' },
              { l: 'Q/A', s: 'Питання та відповіді', k: '?' },
            ].map((a, i) => (
              <div key={i} style={{ padding: '11px 12px', border: `1px solid ${D1.border}`, borderRadius: 7, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: D1.surface }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.l}</div>
                  <div style={{ fontSize: 11, color: D1.textMute, marginTop: 1 }}>{a.s}</div>
                </div>
                <Kbd>{a.k}</Kbd>
              </div>
            ))}

            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '20px 0 10px' }}>Останні сесії</div>
            {[
              { d: 'Сьогодні · 14:22', q: '25 питань', acc: 76, dur: '11 хв' },
              { d: 'Вчора · 19:08', q: '50 питань', acc: 64, dur: '23 хв' },
              { d: '24 трав · 10:31', q: '15 питань', acc: 53, dur: '7 хв' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '8px 0', borderTop: i > 0 ? `1px solid ${D1.border}` : 'none' }}>
                <div style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>{s.d}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 12 }}>
                  <span>{s.q}</span>
                  <span style={{ fontFamily: D1.mono, color: s.acc < 60 ? D1.amber : D1.green }}>{s.acc}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 3. TEST BUILDER
const D1Builder = () => {
  const sel = [true, true, false, true, true, false, true, true, true, true];
  return (
    <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
      <D1Topbar subject="Дослідження операцій · Тест" />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <D1SideNav active="test" />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px' }}>
          <div style={{ padding: '28px 40px', overflow: 'hidden' }}>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Новий тест</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Налаштування</div>
            <div style={{ fontSize: 13, color: D1.textDim, marginTop: 4 }}>Обери теми та кількість питань. <Kbd>⌘</Kbd>+<Kbd>Enter</Kbd> щоб запустити.</div>

            <div style={{ marginTop: 24, fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Теми</span>
              <span style={{ display: 'flex', gap: 6 }}><span style={{ color: D1.textDim }}>усі</span><span>·</span><span style={{ color: D1.textDim }}>жодної</span><span>·</span><span style={{ color: D1.accent }}>слабкі</span></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${D1.border}`, borderRadius: 8, overflow: 'hidden', background: D1.surface }}>
              {topics.map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: i < 8 ? `1px solid ${D1.border}` : 'none', borderRight: i % 2 === 0 ? `1px solid ${D1.border}` : 'none' }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: sel[i] ? D1.accent : 'transparent', border: sel[i] ? `1px solid ${D1.accent}` : `1px solid ${D1.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel[i] && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1 4.5L3.5 7L8 1.5" stroke="#0a0b0d" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: t.color }} />
                  <span style={{ fontSize: 13, flex: 1 }}>{t.name}</span>
                  <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>{t.count}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Кількість питань</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 88, height: 40, border: `1px solid ${D1.borderStrong}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontSize: 18, background: D1.surface }}>25</div>
              <div style={{ flex: 1, height: 4, borderRadius: 999, background: D1.surface2, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '32%', background: D1.accent, borderRadius: 999 }} />
                <div style={{ position: 'absolute', left: '32%', top: -4, width: 12, height: 12, borderRadius: 99, background: D1.text, marginLeft: -6, boxShadow: '0 0 0 3px rgba(94,182,255,0.2)' }} />
              </div>
              <div style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>макс 78</div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[10, 25, 50, 'усі'].map((p, i) => (
                <div key={i} style={{ padding: '5px 12px', borderRadius: 5, background: p === 25 ? D1.surface2 : 'transparent', border: `1px solid ${p === 25 ? D1.borderStrong : D1.border}`, fontFamily: D1.mono, fontSize: 11, color: p === 25 ? D1.text : D1.textDim }}>{p}</div>
              ))}
            </div>

            <div style={{ marginTop: 24, fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Опції</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { l: 'Показувати пояснення відразу', on: true },
                { l: 'Перемішати варіанти', on: true },
                { l: 'Таймер · 60 сек на питання', on: false },
                { l: 'Тільки слабкі питання (точність < 60%)', on: false },
              ].map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: `1px solid ${D1.border}`, borderRadius: 6, background: D1.surface }}>
                  <span style={{ fontSize: 13 }}>{o.l}</span>
                  <div style={{ width: 28, height: 16, borderRadius: 99, background: o.on ? D1.accent : D1.surface2, position: 'relative', border: `1px solid ${o.on ? D1.accent : D1.border}` }}>
                    <div style={{ position: 'absolute', top: 1, left: o.on ? 13 : 1, width: 12, height: 12, borderRadius: 99, background: o.on ? '#0a0b0d' : D1.textDim, transition: 'left .15s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderLeft: `1px solid ${D1.border}`, padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Готовий до запуску</div>
            <div style={{ fontFamily: D1.mono, fontSize: 56, fontWeight: 500, letterSpacing: '-0.04em', marginTop: 8 }}>25</div>
            <div style={{ fontSize: 13, color: D1.textDim }}>питань з <span style={{ color: D1.text }}>7 тем</span></div>
            <div style={{ fontSize: 12, color: D1.textMute, marginTop: 4, fontFamily: D1.mono }}>≈ 12 хв · 78 доступних</div>

            <div style={{ marginTop: 18, padding: 12, border: `1px solid ${D1.border}`, borderRadius: 7, background: D1.surface }}>
              <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Розподіл</div>
              <div style={{ height: 6, display: 'flex', borderRadius: 999, overflow: 'hidden', background: D1.surface2 }}>
                {topics.filter((_, i) => sel[i]).map((t, i) => (
                  <div key={i} style={{ flex: 1, background: t.color, opacity: 0.85 }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {topics.filter((_, i) => sel[i]).map(t => (
                  <span key={t.id} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: D1.surface2, color: D1.textDim, fontFamily: D1.mono, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 99, background: t.color }} />{t.name}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }} />
            <button style={{ padding: '12px 16px', background: D1.accent, border: 'none', borderRadius: 8, color: '#0a0b0d', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: D1.sans }}>
              Старт <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>⌘ ↵</Kbd>
            </button>
            <div style={{ fontSize: 11, color: D1.textMute, textAlign: 'center', marginTop: 8 }}>Або зберегти як шаблон</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. TEST-TAKING (mobile)
const D1Take = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    {/* Progress */}
    <div style={{ padding: '6px 18px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: D1.textDim }}>
          <span style={{ color: D1.textMute }}>×</span>
          <span style={{ fontFamily: D1.mono, color: D1.text }}>7</span><span style={{ color: D1.textMute }}>/</span><span style={{ fontFamily: D1.mono }}>25</span>
        </div>
        <div style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textMute }}>00:42</div>
      </div>
      <div style={{ height: 3, background: D1.surface2, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: '28%', height: '100%', background: D1.accent }} />
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < 6 ? (i === 1 || i === 4 ? D1.red : D1.green) : i === 6 ? D1.accent : D1.surface2 }} />
        ))}
      </div>
    </div>

    {/* Question */}
    <div style={{ flex: 1, padding: '14px 22px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: D1.green }} />
        <span style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono, letterSpacing: '0.04em' }}>ТРАНСПОРТНА · #142</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: D1.textMute }}>◇</span>
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.4, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 18 }}>
        Метод Фогеля для розв'язання транспортної задачі базується на:
      </div>
      {[
        { l: 'a', t: 'Градієнтах функції', state: 'normal' },
        { l: 'б', t: 'Потенціалах рядків та стовпців', state: 'correct' },
        { l: 'в', t: 'Похідних обмежень', state: 'wrong' },
        { l: 'г', t: 'Штрафних вартостях', state: 'normal' },
      ].map((o, i) => (
        <div key={i} style={{
          padding: '13px 14px', marginBottom: 8, borderRadius: 8,
          border: `1px solid ${o.state === 'correct' ? D1.green : o.state === 'wrong' ? D1.red : D1.border}`,
          background: o.state === 'correct' ? 'rgba(74,222,128,0.08)' : o.state === 'wrong' ? 'rgba(248,113,113,0.06)' : D1.surface,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 5,
            background: o.state === 'correct' ? D1.green : o.state === 'wrong' ? D1.red : D1.surface2,
            color: o.state === 'normal' ? D1.textMute : '#0a0b0d',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontSize: 12, fontWeight: 600 }}>{o.l}</div>
          <span style={{ fontSize: 14, flex: 1 }}>{o.t}</span>
          {o.state === 'correct' && <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke={D1.green} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
          {o.state === 'wrong' && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2L10 10M10 2L2 10" stroke={D1.red} strokeWidth="2" strokeLinecap="round"/></svg>}
        </div>
      ))}
    </div>

    {/* Explanation drawer */}
    <div style={{ borderTop: `1px solid ${D1.border}`, background: D1.surface, padding: '16px 22px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: D1.accent, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Пояснення</div>
        <div style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>точність теми 44%</div>
      </div>
      <div style={{ fontSize: 13, color: D1.textDim, lineHeight: 1.5 }}>
        Метод Фогеля будує початковий допустимий розв'язок, обчислюючи <span style={{ color: D1.text }}>штрафні різниці</span> між двома найменшими тарифами в кожному рядку та стовпці. Це дозволяє уникнути «дорогих» комбінацій клітинок.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <div style={{ padding: '8px 12px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>Закладка <Kbd>B</Kbd></div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '10px 18px', borderRadius: 7, background: D1.accent, color: '#0a0b0d', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>Далі <Kbd style={{ background: 'rgba(0,0,0,0.2)', color: '#0a0b0d', border: 'none' }}>↵</Kbd></div>
      </div>
    </div>
    <HomeIndicator />
  </div>
);

// 5. RESULTS
const D1Results = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Дослідження операцій · Результати" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="test" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '32px 40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, borderBottom: `1px solid ${D1.border}` }}>
          <div>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Сесія завершена · 11 хв 22 сек</div>
            <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 8 }}>19 з 25 правильно</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 12 }}>
              <div>
                <div style={{ fontFamily: D1.mono, fontSize: 44, color: D1.green, letterSpacing: '-0.04em' }}>76<span style={{ fontSize: 24, color: D1.textMute }}>%</span></div>
                <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>точність</div>
              </div>
              <div style={{ width: 1, height: 60, background: D1.border }} />
              <div>
                <div style={{ fontFamily: D1.mono, fontSize: 24, color: D1.green, letterSpacing: '-0.02em' }}>+14%</div>
                <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>vs середнє</div>
              </div>
              <div>
                <div style={{ fontFamily: D1.mono, fontSize: 24, color: D1.text, letterSpacing: '-0.02em' }}>27 с</div>
                <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>середній час</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>По темах</div>
            {[
              { name: 'Транспортна', total: 8, correct: 7, color: D1.green },
              { name: 'ЛП · симплекс', total: 6, correct: 5, color: D1.accent },
              { name: 'Двоїстість', total: 5, correct: 2, color: D1.violet, weak: true },
              { name: 'Ігрові методи', total: 6, correct: 5, color: D1.red },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: t.color }} />
                <span style={{ fontSize: 13, flex: 1 }}>{t.name}</span>
                <span style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: t.total }).map((_, j) => (
                    <span key={j} style={{ width: 6, height: 12, borderRadius: 1, background: j < t.correct ? t.color : 'rgba(255,255,255,0.08)' }} />
                  ))}
                </span>
                <span style={{ fontFamily: D1.mono, fontSize: 12, width: 44, textAlign: 'right', color: t.weak ? D1.amber : D1.textDim }}>{t.correct}/{t.total}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Помилки · 6 питань</div>
            <div style={{ fontSize: 11, color: D1.textMute }}>Фільтр: <span style={{ color: D1.text }}>помилкові</span> · усі · флаговані</div>
          </div>
          <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, overflow: 'hidden', background: D1.surface }}>
            {[
              { n: 4, t: 'Якщо пряма задача є задачею максимізації, двоїста...', a: 'Двоїстість', user: 'необмежена', right: 'мінімізації' },
              { n: 11, t: 'Метод штучного базису потребує:', a: 'ЛП · симплекс', user: 'M-методу', right: 'двофазового методу' },
              { n: 17, t: 'У транспортній задачі ефективний цикл проходить через:', a: 'Транспортна', user: 'мінімум', right: 'базисні клітинки' },
            ].map((q, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 90px', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < 2 ? `1px solid ${D1.border}` : 'none' }}>
                <span style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textMute }}>#{q.n}</span>
                <div>
                  <div style={{ fontSize: 13 }}>{q.t}</div>
                  <div style={{ fontSize: 11, marginTop: 4, color: D1.textMute }}>
                    Ти: <span style={{ color: D1.red, textDecoration: 'line-through' }}>{q.user}</span>
                    <span style={{ margin: '0 8px' }}>·</span>
                    Правильно: <span style={{ color: D1.green }}>{q.right}</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: D1.textDim, fontFamily: D1.mono }}>{q.a}</span>
                <span style={{ fontSize: 12, color: D1.accent, textAlign: 'right' }}>Переглянути →</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button style={{ padding: '10px 18px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, fontFamily: D1.sans, display: 'flex', alignItems: 'center', gap: 8 }}>Повторити помилки <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>R</Kbd></button>
            <button style={{ padding: '10px 18px', background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 7, fontSize: 13 }}>Новий тест</button>
            <button style={{ padding: '10px 18px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 7, fontSize: 13 }}>Експорт</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 6. CATALOG
const D1Catalog = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Дослідження операцій · Каталог" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="cat" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Filter bar */}
        <div style={{ padding: '14px 28px', borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 32, border: `1px solid ${D1.border}`, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, background: D1.surface }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke={D1.textMute} strokeWidth="1.3"/><path d="M9.5 9.5L12.5 12.5" stroke={D1.textMute} strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 13, color: D1.textMute }}>Пошук по 520 питанням...</span>
            <div style={{ flex: 1 }} />
            <Kbd>/</Kbd>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.textDim }}>
            <span>+</span> Фільтр
          </div>
          <div style={{ padding: '6px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.textDim }}>Сортувати: №</div>
        </div>

        {/* Active filters & topic chips */}
        <div style={{ padding: '10px 28px', borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 4 }}>Теми</span>
          <div style={{ padding: '3px 9px', borderRadius: 99, fontSize: 11, background: D1.accentDim, color: D1.accent, fontWeight: 500, fontFamily: D1.mono }}>усі · 520</div>
          {topics.map(t => (
            <div key={t.id} style={{ padding: '3px 9px', borderRadius: 99, fontSize: 11, background: 'transparent', border: `1px solid ${D1.border}`, color: D1.textDim, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: t.color }} />{t.name} <span style={{ color: D1.textMute, fontFamily: D1.mono }}>{t.count}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '8px 28px', borderBottom: `1px solid ${D1.border}`, fontSize: 11, color: D1.textMute, fontFamily: D1.mono, display: 'flex', justifyContent: 'space-between' }}>
          <span>520 питань · 30 на сторінці</span>
          <span>Показати відповіді</span>
        </div>

        {/* Questions list - table */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {[
            { n: 1, t: 'Метод Фогеля для розв\'язання транспортної задачі використовує:', topic: 'Транспортна', color: D1.green, opts: ['Градієнти', 'Потенціали', 'Похідні', 'Штрафні вартості'], correct: 3, acc: 44 },
            { n: 2, t: 'Ефективність методу Ньютона значною мірою залежить від:', topic: 'Одновимірна / Багатовимірна', color: D1.violet, opts: ['Випадкового вибору точки', 'Симплекса', 'Умов збіжності', 'Матриці Гессе'], correct: 3, acc: 67 },
            { n: 3, t: 'Якщо пряма задача максимізації, то двоїста задача є:', topic: 'Двоїстість', color: D1.violet, opts: ['Максимізації', 'Мінімізації', 'Необмежена', 'Несумісна'], correct: 1, acc: 38 },
            { n: 4, t: 'У методі гілок і меж відсікають варіанти за:', topic: 'Дискретне ЛП', color: D1.green, opts: ['Верхньою межею', 'Нижньою межею', 'Випадково', 'За індексом'], correct: 0, acc: 55 },
          ].map((q, i) => (
            <div key={i} style={{ padding: '14px 28px', borderBottom: `1px solid ${D1.border}`, display: 'grid', gridTemplateColumns: '40px 1fr 60px 80px', gap: 16, alignItems: 'start' }}>
              <span style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textMute, paddingTop: 1 }}>#{q.n}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{q.t}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {q.opts.map((o, j) => (
                    <span key={j} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: D1.surface, border: `1px solid ${D1.border}`, color: D1.textDim, fontFamily: D1.mono }}>
                      <span style={{ color: D1.textMute, marginRight: 6 }}>{['a','б','в','г'][j]}</span>{o}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, fontFamily: D1.mono }}>
                  <span style={{ width: 5, height: 5, borderRadius: 99, background: q.color }} />
                  <span style={{ color: D1.textMute }}>{q.topic}</span>
                </div>
              </div>
              <span style={{ fontFamily: D1.mono, fontSize: 11, color: q.acc < 50 ? D1.amber : D1.textDim, paddingTop: 1, textAlign: 'right' }}>{q.acc}%</span>
              <span style={{ fontSize: 11, color: D1.accent, paddingTop: 1, textAlign: 'right' }}>відкрити →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 7. ADMIN
const D1Admin = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Адмін · Питання" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <div style={{ width: 188, borderRight: `1px solid ${D1.border}`, padding: '14px 8px', fontFamily: D1.sans, fontSize: 13 }}>
        <div style={{ padding: '4px 10px', color: D1.textMute, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Адмін</div>
        {[
          { n: 'Питання', a: true },
          { n: 'Теми' },
          { n: 'Предмети' },
          { n: 'Імпорт CSV' },
          { n: 'Q/A модерація' },
          { n: 'Студенти' },
          { n: 'Аналітика' },
        ].map((it, i) => (
          <div key={i} style={{ padding: '6px 10px', borderRadius: 6, marginBottom: 1, color: it.a ? D1.text : D1.textDim, background: it.a ? D1.surface2 : 'transparent', fontWeight: it.a ? 500 : 400 }}>{it.n}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px' }}>
        <div style={{ padding: '22px 28px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Дослідження операцій</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Питання · 520</div>
            </div>
            <button style={{ padding: '7px 12px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>+ Нове питання <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>N</Kbd></button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 32, border: `1px solid ${D1.border}`, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, background: D1.surface, fontSize: 12, color: D1.textMute }}>
              <span>Пошук...</span>
            </div>
            <div style={{ padding: '6px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 11, color: D1.textDim }}>Тема: усі</div>
            <div style={{ padding: '6px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 11, color: D1.textDim }}>Статус: чернетки 4</div>
          </div>

          <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, overflow: 'hidden', background: D1.surface }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 90px 80px 80px', gap: 12, padding: '8px 14px', borderBottom: `1px solid ${D1.border}`, fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span>#</span><span>Питання</span><span>Тема</span><span>Статус</span><span>Точність</span><span>Дії</span>
            </div>
            {[
              { n: 142, t: 'Метод Фогеля для розв\'язання...', topic: 'Транспортна', color: D1.green, s: 'опубл.', acc: 44 },
              { n: 143, t: 'Двоїста задача мінімізації...', topic: 'Двоїстість', color: D1.violet, s: 'опубл.', acc: 51 },
              { n: 144, t: 'У методі Ньютона матриця Гессе...', topic: 'Багатовимірна', color: '#ec4899', s: 'чернетка', acc: 0, draft: true },
              { n: 145, t: 'Алгоритм Дейкстри застосовується для...', topic: 'Дискретне ЛП', color: '#34d399', s: 'опубл.', acc: 78 },
              { n: 146, t: 'У теорії ігор сідлова точка...', topic: 'Ігрові методи', color: D1.red, s: 'ревʼю', acc: 0, review: true },
            ].map((q, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 90px 80px 80px', gap: 12, padding: '10px 14px', borderBottom: i < 4 ? `1px solid ${D1.border}` : 'none', alignItems: 'center', fontSize: 12 }}>
                <span style={{ fontFamily: D1.mono, color: D1.textMute }}>{q.n}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.t}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: D1.textDim, fontSize: 11 }}><span style={{ width: 5, height: 5, borderRadius: 99, background: q.color }} />{q.topic}</span>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: q.draft ? 'rgba(251,191,36,0.12)' : q.review ? 'rgba(94,182,255,0.12)' : 'rgba(74,222,128,0.1)', color: q.draft ? D1.amber : q.review ? D1.accent : D1.green, width: 'fit-content', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>{q.s}</span>
                <span style={{ fontFamily: D1.mono, color: q.acc === 0 ? D1.textMute : q.acc < 50 ? D1.amber : D1.text }}>{q.acc === 0 ? '—' : q.acc + '%'}</span>
                <span style={{ color: D1.textMute }}>·  ·  ·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right edit panel */}
        <div style={{ borderLeft: `1px solid ${D1.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, background: D1.surface }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Редагування · #144</div>
              <div style={{ fontSize: 11, color: D1.amber, marginTop: 2, fontFamily: D1.mono }}>● Чернетка · не збережено</div>
            </div>
            <Kbd>esc</Kbd>
          </div>
          <div>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Питання</div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: D1.bg, border: `1px solid ${D1.border}`, fontSize: 13, lineHeight: 1.4 }}>
              У методі Ньютона матриця Гессе повинна бути:
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Варіанти · правильний відмічено</div>
            {['Додатньо визначеною', 'Симетричною', 'Невиродженою', 'Виродженою'].map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 5, marginBottom: 3, background: i === 0 ? 'rgba(74,222,128,0.08)' : D1.bg, border: `1px solid ${i === 0 ? D1.green : D1.border}` }}>
                <div style={{ width: 14, height: 14, borderRadius: 99, border: `1.5px solid ${i === 0 ? D1.green : D1.border}`, background: i === 0 ? D1.green : 'transparent' }} />
                <span style={{ fontSize: 12, flex: 1 }}>{o}</span>
                <span style={{ fontFamily: D1.mono, fontSize: 10, color: D1.textMute }}>{['а','б','в','г'][i]}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Тема · Пояснення</div>
            <div style={{ padding: '6px 10px', borderRadius: 5, background: D1.bg, border: `1px solid ${D1.border}`, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: '#ec4899' }} />Багатовимірна оптимізація
            </div>
            <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 6, background: D1.bg, border: `1px solid ${D1.border}`, fontSize: 12, color: D1.textDim, lineHeight: 1.5 }}>
              Метод Ньютона збігається до локального мінімуму лише коли матриця Гессе додатньо визначена в точці...
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ flex: 1, padding: '9px 12px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>Опублікувати <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>⌘ ↵</Kbd></button>
            <button style={{ padding: '9px 12px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12 }}>Зберегти</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.D1Screens = { D1Home, D1Subject, D1Builder, D1Take, D1Results, D1Catalog, D1Admin };
window.D1 = D1;
window.D1topics = topics;
window.D1Topbar = D1Topbar;
window.D1SideNav = D1SideNav;

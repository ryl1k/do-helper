// D · Mobile suite · Метод

const D1 = window.D1;

// Shared mobile header
const M1Topbar = ({ title = 'oistudy', back = false, action = null }) => (
  <div style={{ height: 48, borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: D1.sans, gap: 10 }}>
    {back ? (
      <span style={{ color: D1.textDim, fontSize: 18, width: 24 }}>←</span>
    ) : (
      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontSize: 10, fontWeight: 700, color: '#0a0b0d' }}>oi</div>
    )}
    <span style={{ fontSize: 15, fontWeight: 600, color: D1.text }}>{title}</span>
    <div style={{ flex: 1 }} />
    {action || <span style={{ color: D1.textDim, fontSize: 16 }}>⌕</span>}
  </div>
);

// Bottom tab bar
const M1Tabs = ({ active }) => (
  <div style={{ borderTop: `1px solid ${D1.border}`, padding: '8px 12px 4px', display: 'flex', justifyContent: 'space-around', background: D1.bg }}>
    {[
      { id: 'home', l: 'Огляд', i: '⌂' },
      { id: 'test', l: 'Тест', i: '▶' },
      { id: 'cat', l: 'Каталог', i: '☰' },
      { id: 'me', l: 'Профіль', i: '◉' },
    ].map(t => (
      <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: active === t.id ? D1.accent : D1.textMute, fontSize: 10, fontWeight: 500 }}>
        <span style={{ fontSize: 16 }}>{t.i}</span>
        <span>{t.l}</span>
      </div>
    ))}
  </div>
);

// 18. HOME MOBILE
const D1HomeMobile = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <M1Topbar title="oistudy" />
    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ padding: '18px 18px 14px' }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>26 трав · 14:22</div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>З поверненням, Роман.</div>
        <div style={{ fontSize: 13, color: D1.textDim, marginTop: 4 }}>До іспиту з ДО — <span style={{ color: D1.text, fontFamily: D1.mono }}>12 днів</span></div>
      </div>

      {/* Quick stats — horizontal scroll */}
      <div style={{ display: 'flex', gap: 8, padding: '0 18px 14px', overflowX: 'auto' }}>
        {[
          { l: 'Точність', v: '62%', s: '+4 за тиждень' },
          { l: 'Серія', v: '7д', s: 'найкр. 12' },
          { l: 'Слабкі теми', v: '3', s: 'фокус', warn: true },
        ].map((s, i) => (
          <div key={i} style={{ flex: '0 0 auto', minWidth: 110, padding: 12, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.l}</div>
            <div style={{ fontFamily: D1.mono, fontSize: 22, marginTop: 4, color: s.warn ? D1.amber : D1.text }}>{s.v}</div>
            <div style={{ fontSize: 10, color: D1.textMute, marginTop: 2 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Recommended */}
      <div style={{ padding: '6px 18px 14px' }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Рекомендовано</div>
        <div style={{ padding: 14, background: 'linear-gradient(135deg, rgba(94,182,255,0.1), rgba(167,139,250,0.05))', border: `1px solid ${D1.accent}`, borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: D1.accent }} />
            <span style={{ fontSize: 11, color: D1.accent, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Фокус-сесія</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>15 питань зі слабких тем — двоїстість, транспортна, ігрові методи</div>
          <div style={{ fontSize: 11, color: D1.textDim, marginTop: 6, fontFamily: D1.mono }}>~ 8 хв · підвищить точність на ≈10%</div>
          <button style={{ marginTop: 10, padding: '8px 14px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, width: '100%' }}>Розпочати →</button>
        </div>
      </div>

      {/* Subjects */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Предмети · 3</div>
        {[
          { tag: 'ДО', name: 'Дослідження операцій', qs: 520, acc: 62, active: true },
          { tag: 'БД', name: 'Бази даних', qs: 410, acc: null },
          { tag: 'СА', name: 'Системний аналіз', qs: 287, acc: null },
        ].map((s, i) => (
          <div key={i} style={{ padding: 12, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: s.active ? 'linear-gradient(135deg,#5eb6ff,#a78bfa)' : D1.surface2, fontFamily: D1.mono, fontSize: 11, fontWeight: 700, color: s.active ? '#0a0b0d' : D1.textMute, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.tag}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
              <div style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono, marginTop: 1 }}>
                {s.qs} питань{s.acc !== null && ` · ${s.acc}%`}
              </div>
            </div>
            <span style={{ color: D1.textMute, fontSize: 13 }}>→</span>
          </div>
        ))}
      </div>
    </div>
    <M1Tabs active="home" />
    <HomeIndicator />
  </div>
);

// 19. SUBJECT MOBILE
const D1SubjectMobile = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <M1Topbar title="ДО" back />
    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ padding: '14px 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 7, background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontSize: 12, fontWeight: 700, color: '#0a0b0d' }}>ДО</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Дослідження операцій</div>
            <div style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>520 питань · 9 тем</div>
          </div>
        </div>
      </div>

      {/* Big actions */}
      <div style={{ padding: '0 18px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button style={{ padding: '14px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <span style={{ fontSize: 14 }}>▶ Тест</span>
          <span style={{ fontSize: 10, opacity: 0.8 }}>Випадкові питання</span>
        </button>
        <button style={{ padding: '14px', background: D1.surface, color: D1.text, border: `1px solid ${D1.border}`, borderRadius: 10, fontSize: 14, fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <span style={{ fontSize: 14 }}>☰ Каталог</span>
          <span style={{ fontSize: 10, color: D1.textMute }}>520 питань</span>
        </button>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{ padding: 14, background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Прогрес</span>
            <span style={{ fontFamily: D1.mono, fontSize: 13, color: D1.accent }}>322 / 520</span>
          </div>
          <div style={{ height: 4, background: D1.surface2, borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: '62%', height: '100%', background: D1.accent }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: D1.textMute }}>
            <span>точність 62%</span>
            <span style={{ color: D1.amber }}>3 слабкі теми</span>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div style={{ padding: '0 18px 18px' }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Теми · 9</div>
        {window.D1topics.slice(0, 6).map((t, i) => {
          const acc = [72, 58, 38, 44, 67, 55][i];
          const weak = acc < 50;
          return (
            <div key={t.id} style={{ padding: '10px 12px', background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 7, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: t.color }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t.name}
                  {weak && <span style={{ fontSize: 9, color: D1.amber, padding: '1px 5px', borderRadius: 3, background: 'rgba(251,191,36,0.12)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>слабка</span>}
                </div>
                <div style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono, marginTop: 2 }}>{t.count} питань · точн. {acc}%</div>
              </div>
              <span style={{ color: D1.textMute, fontSize: 13 }}>→</span>
            </div>
          );
        })}
      </div>
    </div>
    <M1Tabs active="home" />
    <HomeIndicator />
  </div>
);

// 20. CATALOG MOBILE
const D1CatalogMobile = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <M1Topbar title="Каталог" back action={<span style={{ color: D1.accent, fontSize: 13 }}>Фільтр</span>} />

    {/* Search */}
    <div style={{ padding: '10px 16px', borderBottom: `1px solid ${D1.border}` }}>
      <div style={{ height: 38, background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 8, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="6" cy="6" r="4.5" stroke={D1.textMute} strokeWidth="1.3" fill="none"/><path d="M9.5 9.5L12.5 12.5" stroke={D1.textMute} strokeWidth="1.3" strokeLinecap="round"/></svg>
        <span style={{ fontSize: 13, color: D1.textMute }}>Шукати у 520 питаннях...</span>
      </div>
    </div>

    {/* Topic chips */}
    <div style={{ padding: '8px 16px', borderBottom: `1px solid ${D1.border}`, display: 'flex', gap: 5, overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 11, background: D1.accentDim, color: D1.accent, fontWeight: 500, fontFamily: D1.mono, flexShrink: 0 }}>усі · 520</span>
      {window.D1topics.slice(0, 6).map(t => (
        <span key={t.id} style={{ padding: '4px 10px', borderRadius: 99, fontSize: 11, color: D1.textDim, border: `1px solid ${D1.border}`, flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: 99, background: t.color }} />{t.name}
        </span>
      ))}
    </div>

    <div style={{ padding: '8px 16px', fontSize: 11, color: D1.textMute, fontFamily: D1.mono, borderBottom: `1px solid ${D1.border}`, display: 'flex', justifyContent: 'space-between' }}>
      <span>520 питань</span><span>відповіді ✓</span>
    </div>

    <div style={{ flex: 1, overflow: 'auto' }}>
      {[
        { n: 1, t: 'Метод Фогеля для розв\'язання транспортної задачі використовує:', topic: 'Транспортна', color: '#4ade80', opts: ['Градієнти', 'Потенціали', 'Похідні', 'Штрафні вартості'], r: 3, acc: 44 },
        { n: 2, t: 'Ефективність методу Ньютона значною мірою залежить від:', topic: 'Багатовимірна', color: '#ec4899', opts: ['Випадк. вибору', 'Симплекса', 'Умов збіжності', 'Матриці Гессе'], r: 3, acc: 67 },
        { n: 3, t: 'Якщо пряма задача максимізації, то двоїста:', topic: 'Двоїстість', color: '#a78bfa', opts: ['Максимізації', 'Мінімізації', 'Необмежена', 'Несумісна'], r: 1, acc: 38 },
      ].map((q, i) => (
        <div key={i} style={{ padding: '14px 16px', borderBottom: `1px solid ${D1.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>#{q.n}</span>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: q.color }} />
            <span style={{ fontSize: 11, color: D1.textDim }}>{q.topic}</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: D1.mono, fontSize: 11, color: q.acc < 50 ? D1.amber : D1.textMute }}>{q.acc}%</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, lineHeight: 1.3 }}>{q.t}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {q.opts.map((o, j) => (
              <div key={j} style={{ padding: '6px 10px', borderRadius: 5, fontSize: 11, border: `1px solid ${j === q.r ? D1.green : D1.border}`, background: j === q.r ? 'rgba(74,222,128,0.06)' : D1.surface, color: j === q.r ? D1.text : D1.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: D1.mono, fontSize: 9, color: j === q.r ? D1.green : D1.textMute }}>{['а','б','в','г'][j]}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o}</span>
                {j === q.r && <span style={{ fontSize: 9, color: D1.green }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <M1Tabs active="cat" />
    <HomeIndicator />
  </div>
);

// 21. RESULTS MOBILE
const D1ResultsMobile = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
      <span style={{ color: D1.textDim, fontSize: 18 }}>×</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: D1.text }}>Результат</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 13, color: D1.accent }}>Експорт</span>
    </div>

    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ padding: '12px 18px 24px' }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Сесія завершена · 11 хв</div>

        {/* Big score */}
        <div style={{ marginTop: 16, padding: 22, background: D1.surface, borderRadius: 12, border: `1px solid ${D1.green}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top, rgba(74,222,128,0.12), transparent 60%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: D1.mono, fontSize: 72, fontWeight: 500, letterSpacing: '-0.04em', color: D1.green, lineHeight: 1 }}>76%</div>
            <div style={{ fontSize: 14, color: D1.textDim, marginTop: 8 }}>19 з 25 правильно</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10, fontSize: 11, fontFamily: D1.mono, color: D1.textMute }}>
              <span>+14% vs сер.</span>
              <span>·</span>
              <span>27с / питання</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>По темах</div>
          {[
            { name: 'Транспортна', got: 7, total: 8, c: '#4ade80' },
            { name: 'ЛП · симплекс', got: 5, total: 6, c: '#5eb6ff' },
            { name: 'Двоїстість', got: 2, total: 5, c: '#a78bfa', weak: true },
            { name: 'Ігрові методи', got: 5, total: 6, c: '#f87171' },
          ].map((t, i) => (
            <div key={i} style={{ padding: '10px 12px', border: `1px solid ${D1.border}`, borderRadius: 7, background: D1.surface, marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: t.c }} />
                <span style={{ fontSize: 13, flex: 1 }}>{t.name}</span>
                <span style={{ fontFamily: D1.mono, fontSize: 12, color: t.weak ? D1.amber : D1.textDim }}>{t.got}/{t.total}</span>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: t.total }).map((_, j) => (
                  <span key={j} style={{ flex: 1, height: 6, borderRadius: 1, background: j < t.got ? t.c : D1.surface2 }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, padding: 14, background: 'rgba(251,191,36,0.06)', border: `1px solid rgba(251,191,36,0.3)`, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: D1.amber, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>Фокус</div>
          <div style={{ fontSize: 13, color: D1.text, lineHeight: 1.5 }}>Двоїстість — 2/5. 10 цілеспрямованих питань підвищать точність на ~15%.</div>
        </div>
      </div>
    </div>

    <div style={{ padding: '10px 16px 14px', borderTop: `1px solid ${D1.border}`, display: 'flex', gap: 8 }}>
      <button style={{ flex: 1, padding: 12, background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 8, fontSize: 13 }}>Новий тест</button>
      <button style={{ flex: 1.4, padding: 12, background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Повторити помилки</button>
    </div>
    <HomeIndicator />
  </div>
);

// 22. ADMIN ON MOBILE — desktop-only message
const D1AdminMobile = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <M1Topbar title="Адмін" />
    <div style={{ flex: 1, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div style={{ width: 60, height: 44, border: `1.5px solid ${D1.textMute}`, borderRadius: 5, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 18, height: 3, background: D1.textMute, borderRadius: 1 }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Потрібен великий екран</div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Адмінка доступна тільки на компʼютері</div>
        <div style={{ fontSize: 13, color: D1.textDim, marginTop: 8, lineHeight: 1.5 }}>
          Робота з даними — редагування питань, імпорт, аналітика — потребує більше місця ніж телефон може дати комфортно.
        </div>
        <div style={{ marginTop: 22, padding: 14, background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 8, textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Що можна на телефоні</div>
          <div style={{ fontSize: 12, color: D1.textDim, lineHeight: 1.7 }}>
            ✓ Проходити тести<br />
            ✓ Переглядати каталог<br />
            ✓ Дивитись результати та статистику<br />
            ✓ Скаржитись на питання
          </div>
        </div>
        <button style={{ marginTop: 18, padding: '10px 16px', background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 7, fontSize: 13 }}>← Повернутись</button>
      </div>
    </div>
    <HomeIndicator />
  </div>
);

window.D1Mobile = { D1HomeMobile, D1SubjectMobile, D1CatalogMobile, D1ResultsMobile, D1AdminMobile };

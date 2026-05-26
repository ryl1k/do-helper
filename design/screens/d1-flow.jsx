// A · Core flow expansion · Метод direction

const D1 = window.D1;
const D1Topbar = window.D1Topbar;
const D1SideNav = window.D1SideNav;

// 1. TEST · PLAYING · DESKTOP
const D1TakeDesktop = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    {/* Top bar — minimal during test */}
    <div style={{ height: 48, borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: D1.textDim }}>
        <span style={{ width: 22, height: 22, borderRadius: 5, background: D1.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>×</span>
        <span style={{ fontFamily: D1.mono, color: D1.text }}>7</span><span style={{ color: D1.textMute }}>/</span><span style={{ fontFamily: D1.mono }}>25</span>
        <span style={{ color: D1.textMute, marginLeft: 8 }}>Дослідження операцій · тест</span>
      </div>
      <div style={{ flex: 1, height: 4, background: D1.surface2, borderRadius: 99, overflow: 'hidden', maxWidth: 360, position: 'relative' }}>
        <div style={{ width: '28%', height: '100%', background: D1.accent }} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textDim }}>00:42 · сер. 27с</div>
      <div style={{ padding: '4px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 11, color: D1.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>Завершити <Kbd>esc</Kbd></div>
    </div>

    {/* Progress dots row */}
    <div style={{ padding: '8px 20px', borderBottom: `1px solid ${D1.border}`, display: 'flex', gap: 3 }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < 6 ? (i === 1 || i === 4 ? D1.red : D1.green) : i === 6 ? D1.accent : D1.surface2 }} />
      ))}
    </div>

    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '64px 1fr 360px', minHeight: 0 }}>
      {/* Left rail — bookmarks */}
      <div style={{ borderRight: `1px solid ${D1.border}`, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        {[
          { i: '◆', l: 'Закладка', k: 'B' },
          { i: '⚑', l: 'Поскаржитись', k: 'R' },
          { i: '↺', l: 'Пропустити', k: 'S' },
          { i: '☰', l: 'Палітра', k: 'P' },
        ].map((b, i) => (
          <div key={i} style={{ width: 36, height: 36, borderRadius: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: D1.textDim, fontSize: 14, gap: 1 }}>
            <span>{b.i}</span>
            <span style={{ fontFamily: D1.mono, fontSize: 9, color: D1.textMute }}>{b.k}</span>
          </div>
        ))}
      </div>

      {/* Center — question */}
      <div style={{ padding: '36px 56px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: D1.green }} />
          <span style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono, letterSpacing: '0.06em' }}>ТРАНСПОРТНА · #142 · 1 правильна</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>точність теми 44%</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.3, margin: 0, maxWidth: 720 }}>
          Метод Фогеля для розв'язання транспортної задачі базується на:
        </h1>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 720 }}>
          {[
            { l: '1', t: 'Градієнтах функції', state: 'normal' },
            { l: '2', t: 'Потенціалах рядків та стовпців', state: 'correct' },
            { l: '3', t: 'Похідних обмежень', state: 'wrong', user: true },
            { l: '4', t: 'Штрафних вартостях', state: 'normal' },
          ].map((o, i) => (
            <div key={i} style={{
              padding: '14px 18px', borderRadius: 9,
              border: `1px solid ${o.state === 'correct' ? D1.green : o.state === 'wrong' ? D1.red : D1.border}`,
              background: o.state === 'correct' ? 'rgba(74,222,128,0.06)' : o.state === 'wrong' ? 'rgba(248,113,113,0.06)' : D1.surface,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6,
                background: o.state === 'correct' ? D1.green : o.state === 'wrong' ? D1.red : D1.surface2,
                color: o.state === 'normal' ? D1.textDim : '#0a0b0d',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontSize: 12, fontWeight: 600 }}>{o.l}</div>
              <span style={{ fontSize: 15, flex: 1 }}>{o.t}</span>
              {o.state === 'correct' && <span style={{ fontSize: 11, color: D1.green, fontFamily: D1.mono }}>✓ правильно</span>}
              {o.user && <span style={{ fontSize: 11, color: D1.red, fontFamily: D1.mono }}>твій вибір</span>}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28 }}>
          <button style={{ padding: '10px 16px', background: 'transparent', border: `1px solid ${D1.border}`, borderRadius: 7, color: D1.textDim, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>← Попереднє <Kbd>←</Kbd></button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>натисни 1–4 щоб обрати</span>
          <button style={{ padding: '11px 22px', background: D1.accent, border: 'none', borderRadius: 7, color: '#0a0b0d', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>Далі <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>↵</Kbd></button>
        </div>
      </div>

      {/* Right — explanation */}
      <div style={{ borderLeft: `1px solid ${D1.border}`, padding: '28px 28px', background: D1.surface, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, color: D1.accent, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Пояснення</div>
        <div style={{ fontSize: 14, color: D1.text, lineHeight: 1.55 }}>
          Метод Фогеля будує початковий допустимий розв'язок, обчислюючи <span style={{ color: D1.accent }}>штрафні різниці</span> — різниці між двома найменшими тарифами в кожному рядку та стовпці. Клітинка з найбільшим штрафом заповнюється першою.
        </div>
        <div style={{ marginTop: 16, padding: 12, background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 7, fontFamily: D1.mono, fontSize: 11, color: D1.textDim, lineHeight: 1.5 }}>
          <div style={{ color: D1.textMute, marginBottom: 4 }}>// псевдокод</div>
          for each row, col:<br />
          &nbsp;&nbsp;Δ = min2 − min1<br />
          pick max Δ; fill cell; reduce
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Пов'язані питання</div>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['#143 · Двоїста транспортна задача', '#88 · Метод північно-західного кута', '#211 · Виродженість плану'].map((q, i) => (
            <div key={i} style={{ fontSize: 12, color: D1.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>→ {q}</div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ flex: 1, padding: '8px', background: 'transparent', border: `1px solid ${D1.border}`, borderRadius: 6, color: D1.textDim, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>◆ Закладка <Kbd>B</Kbd></button>
          <button style={{ padding: '8px 12px', background: 'transparent', border: `1px solid ${D1.border}`, borderRadius: 6, color: D1.textDim, fontSize: 11 }}>Скаржитись</button>
        </div>
      </div>
    </div>
  </div>
);

// 2. TEST · MULTI-CORRECT (mobile)
const D1TakeMulti = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <div style={{ padding: '6px 18px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: D1.textDim }}>
          <span style={{ color: D1.textMute }}>×</span>
          <span style={{ fontFamily: D1.mono, color: D1.text }}>9</span><span style={{ color: D1.textMute }}>/</span><span style={{ fontFamily: D1.mono }}>25</span>
        </div>
        <div style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textMute }}>01:14</div>
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < 8 ? (i === 1 || i === 4 ? D1.red : D1.green) : i === 8 ? D1.accent : D1.surface2 }} />
        ))}
      </div>
    </div>

    <div style={{ flex: 1, padding: '14px 22px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: D1.violet }} />
        <span style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono, letterSpacing: '0.04em' }}>ДВОЇСТІСТЬ · #311</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: D1.accentDim, color: D1.accent, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>обери всі</span>
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.4, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 14 }}>
        Які з наведених тверджень про двоїсту задачу є істинними?
      </div>
      <div style={{ fontSize: 12, color: D1.textMute, fontFamily: D1.mono, marginBottom: 14 }}>// 2 з 4 правильних</div>

      {[
        { l: 'a', t: 'Двоїста задача максимізації перетворюється на мінімізацію', sel: true, correct: true },
        { l: 'б', t: 'Кількість обмежень дорівнює кількості змінних прямої', sel: true, correct: true },
        { l: 'в', t: 'Має ту саму матрицю обмежень без транспонування', sel: false, correct: false },
        { l: 'г', t: 'Завжди має необмежений розв\'язок', sel: false, correct: false },
      ].map((o, i) => (
        <div key={i} style={{
          padding: '12px 14px', marginBottom: 8, borderRadius: 8,
          border: `1px solid ${o.sel ? D1.accent : D1.border}`,
          background: o.sel ? D1.accentDim : D1.surface,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 5,
            background: o.sel ? D1.accent : 'transparent',
            border: o.sel ? `1px solid ${D1.accent}` : `1px solid ${D1.borderStrong}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {o.sel && <svg width="11" height="11" viewBox="0 0 9 9"><path d="M1 4.5L3.5 7L8 1.5" stroke="#0a0b0d" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>}
          </div>
          <span style={{ fontSize: 14, flex: 1 }}>{o.t}</span>
          <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>{o.l}</span>
        </div>
      ))}
    </div>

    <div style={{ borderTop: `1px solid ${D1.border}`, padding: '14px 22px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 11, color: D1.textDim, fontFamily: D1.mono }}>● 2 обрано</div>
      <div style={{ flex: 1 }} />
      <button style={{ padding: '10px 18px', borderRadius: 7, background: D1.accent, color: '#0a0b0d', border: 'none', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>Перевірити <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>↵</Kbd></button>
    </div>
    <HomeIndicator />
  </div>
);

// 3. TEST · NO-ANSWER (mobile)
const D1TakeNoAnswer = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <div style={{ padding: '6px 18px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: D1.textDim }}>
          <span style={{ color: D1.textMute }}>×</span>
          <span style={{ fontFamily: D1.mono, color: D1.text }}>14</span><span style={{ color: D1.textMute }}>/</span><span style={{ fontFamily: D1.mono }}>25</span>
        </div>
        <div style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textMute }}>03:21</div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < 13 ? D1.green : i === 13 ? D1.amber : D1.surface2 }} />
        ))}
      </div>
    </div>

    <div style={{ flex: 1, padding: '14px 22px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: '#34d399' }} />
        <span style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono, letterSpacing: '0.04em' }}>ДИСКРЕТНЕ ЛП · #244</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: 'rgba(251,191,36,0.12)', color: D1.amber, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>немає відповіді</span>
      </div>
      <div style={{ fontSize: 17, lineHeight: 1.4, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 14 }}>
        У методі гілок і меж нижня оцінка для задачі мінімізації обчислюється як:
      </div>

      {[
        { l: 'a', t: 'Розв\'язок неперервної релаксації' },
        { l: 'б', t: 'Максимум серед усіх гілок' },
        { l: 'в', t: 'Випадкове значення' },
        { l: 'г', t: 'Сума коефіцієнтів цільової функції' },
      ].map((o, i) => (
        <div key={i} style={{
          padding: '11px 14px', marginBottom: 7, borderRadius: 8,
          border: `1px dashed ${D1.border}`,
          background: D1.surface,
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: 0.7,
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: D1.surface2, color: D1.textMute, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontSize: 11 }}>{o.l}</div>
          <span style={{ fontSize: 14, flex: 1, color: D1.textDim }}>{o.t}</span>
        </div>
      ))}

      <div style={{ marginTop: 18, padding: '14px 16px', background: 'rgba(251,191,36,0.06)', border: `1px solid rgba(251,191,36,0.25)`, borderRadius: 8 }}>
        <div style={{ fontSize: 11, color: D1.amber, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>В базі ще немає правильної відповіді</div>
        <div style={{ fontSize: 13, color: D1.textDim, lineHeight: 1.5 }}>
          Це питання було імпортовано без розмітки. Допоможи спільноті — запропонуй правильний варіант, і викладач підтвердить.
        </div>
      </div>
    </div>

    <div style={{ borderTop: `1px solid ${D1.border}`, padding: '14px 22px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: '11px', background: 'transparent', border: `1px solid ${D1.borderStrong}`, borderRadius: 7, color: D1.text, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>⚑ Запропонувати</button>
        <button style={{ padding: '11px 18px', background: D1.accent, border: 'none', borderRadius: 7, color: '#0a0b0d', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>Пропустити <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>S</Kbd></button>
      </div>
    </div>
    <HomeIndicator />
  </div>
);

// 4. PROFILE / ACCOUNT
const D1Profile = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Профіль" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="home" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '32px 40px 24px', borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontWeight: 700, fontSize: 22, color: '#0a0b0d' }}>Р</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Роман Коваленко</div>
            <div style={{ fontSize: 13, color: D1.textDim, marginTop: 2 }}>roman.k@lpnu.ua · ОІС, 4 курс · з 12 січ 2025</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '6px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.textDim }}>Редагувати</div>
          <div style={{ padding: '6px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.red }}>Вийти</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: `1px solid ${D1.border}` }}>
          {[
            { l: 'Сесій', v: '54', s: 'усі предмети' },
            { l: 'Питань зроблено', v: '1,247' },
            { l: 'Серія', v: '7д', s: 'найкраща 12д' },
            { l: 'Точність', v: '64%', s: 'усі предмети' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '16px 24px', borderRight: i < 3 ? `1px solid ${D1.border}` : 'none' }}>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.l}</div>
              <div style={{ fontFamily: D1.mono, fontSize: 22, marginTop: 4 }}>{s.v}</div>
              {s.s && <div style={{ fontSize: 11, color: D1.textMute, marginTop: 2 }}>{s.s}</div>}
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 40px 24px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Історія сесій</div>
              <div style={{ fontSize: 11, color: D1.textMute }}>останні 30</div>
            </div>
            <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, overflow: 'hidden' }}>
              {[
                { d: 'Сьогодні · 14:22', subj: 'ДО', q: 25, acc: 76, wrong: 6, expand: true },
                { d: 'Сьогодні · 09:08', subj: 'ДО', q: 15, acc: 80, wrong: 3 },
                { d: 'Вчора · 19:08', subj: 'ДО', q: 50, acc: 64, wrong: 18 },
                { d: '24 трав · 10:31', subj: 'БД', q: 15, acc: 53, wrong: 7 },
                { d: '23 трав · 21:14', subj: 'ДО', q: 25, acc: 72, wrong: 7 },
              ].map((s, i) => (
                <div key={i} style={{ borderBottom: i < 4 ? `1px solid ${D1.border}` : 'none' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 38px 1fr 70px 70px 24px', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>{s.d}</span>
                    <span style={{ fontFamily: D1.mono, fontSize: 10, fontWeight: 600, color: D1.accent, padding: '2px 6px', background: D1.accentDim, borderRadius: 3, width: 'fit-content', textAlign: 'center' }}>{s.subj}</span>
                    <span style={{ fontSize: 12 }}>{s.q} питань · {s.wrong} помилок</span>
                    <span style={{ fontFamily: D1.mono, fontSize: 12, color: s.acc < 60 ? D1.amber : D1.green, textAlign: 'right' }}>{s.acc}%</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: Math.min(s.q, 10) }).map((_, j) => (
                        <span key={j} style={{ width: 4, height: 10, borderRadius: 1, background: j < Math.round(s.acc / 10) ? D1.green : D1.red, opacity: 0.7 }} />
                      ))}
                    </div>
                    <span style={{ color: D1.textMute, textAlign: 'center', fontSize: 11 }}>{s.expand ? '▾' : '▸'}</span>
                  </div>
                  {s.expand && (
                    <div style={{ borderTop: `1px solid ${D1.border}`, background: D1.bg, padding: '12px 16px 14px' }}>
                      <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Помилки</div>
                      {[
                        { n: 4, t: 'Якщо пряма задача максимізації...', wrong: 'необмежена', right: 'мінімізації' },
                        { n: 11, t: 'Метод штучного базису потребує:', wrong: 'M-методу', right: 'двофазового методу' },
                      ].map((w, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 12 }}>
                          <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute, width: 36 }}>#{w.n}</span>
                          <span style={{ flex: 1, color: D1.textDim }}>{w.t}</span>
                          <span style={{ color: D1.red, textDecoration: 'line-through', fontSize: 11 }}>{w.wrong}</span>
                          <span style={{ color: D1.textMute }}>→</span>
                          <span style={{ color: D1.green, fontSize: 11 }}>{w.right}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <button style={{ padding: '6px 11px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>Повторити помилки</button>
                        <button style={{ padding: '6px 11px', background: 'transparent', border: `1px solid ${D1.border}`, color: D1.textDim, borderRadius: 5, fontSize: 11 }}>Переглянути сесію</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Налаштування</div>
            <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, padding: 6 }}>
              {[
                { l: 'Тема', v: 'Темна', knob: true },
                { l: 'Мова', v: 'Українська' },
                { l: 'Сповіщення про іспити', v: 'За 14 днів' },
                { l: 'Звукові сигнали', v: 'Вимк.' },
                { l: 'Експорт історії', v: 'CSV · PDF', action: true },
              ].map((s, i) => (
                <div key={i} style={{ padding: '10px 12px', borderBottom: i < 4 ? `1px solid ${D1.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13 }}>{s.l}</span>
                  <span style={{ fontSize: 12, color: s.action ? D1.accent : D1.textDim, fontFamily: s.knob ? D1.mono : D1.sans }}>{s.v}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 24, marginBottom: 10 }}>Дані</div>
            <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, padding: 14 }}>
              <div style={{ fontSize: 12, color: D1.textDim, lineHeight: 1.5, marginBottom: 12 }}>
                Локальна історія: <span style={{ color: D1.text, fontFamily: D1.mono }}>2.4 MB</span> · 54 сесії, кеш питань
              </div>
              <button style={{ padding: '8px 12px', background: 'transparent', border: `1px solid ${D1.border}`, color: D1.red, borderRadius: 5, fontSize: 12, fontFamily: D1.sans, width: '100%' }}>Очистити локальну історію</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 5. LOGIN (mobile-friendly width)
const D1Login = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
    <div style={{ width: '100%', maxWidth: 380 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontWeight: 700, color: '#0a0b0d', marginBottom: 22 }}>oi</div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Увійти в oistudy</h1>
      <p style={{ fontSize: 13, color: D1.textDim, marginTop: 6, lineHeight: 1.5 }}>Збережи прогрес між пристроями та сесіями. Без входу — статистика залишається лише локально.</p>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</div>
        <div style={{ height: 40, border: `1px solid ${D1.borderStrong}`, borderRadius: 7, padding: '0 12px', display: 'flex', alignItems: 'center', background: D1.surface, fontSize: 13, color: D1.text }}>
          <span style={{ color: D1.text }}>roman.k@lpnu.ua</span>
          <span style={{ width: 1, height: 14, background: D1.accent, marginLeft: 1, animation: 'caret 1s steps(2) infinite' }} />
        </div>
        <button style={{ marginTop: 10, width: '100%', padding: '11px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Надіслати magic-link <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>↵</Kbd></button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
        <div style={{ flex: 1, height: 1, background: D1.border }} />
        <span style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>або</span>
        <div style={{ flex: 1, height: 1, background: D1.border }} />
      </div>

      <button style={{ width: '100%', padding: '11px', background: D1.surface, color: D1.text, border: `1px solid ${D1.border}`, borderRadius: 7, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: D1.sans }}>
        <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#4285F4" d="M15.5 8.18c0-.57-.05-1.12-.15-1.64H8v3.11h4.21a3.6 3.6 0 01-1.56 2.36v1.97h2.52c1.47-1.36 2.33-3.37 2.33-5.8z"/><path fill="#34A853" d="M8 16c2.11 0 3.88-.7 5.17-1.9l-2.52-1.97c-.7.47-1.6.75-2.65.75-2.04 0-3.76-1.38-4.38-3.23H1.04v2.03A8 8 0 008 16z"/><path fill="#FBBC05" d="M3.62 9.65a4.8 4.8 0 010-3.05V4.57H1.04a8 8 0 000 6.86l2.58-1.78z"/><path fill="#EA4335" d="M8 3.18c1.15 0 2.18.4 3 1.17l2.23-2.23A8 8 0 001.04 4.57l2.58 2.03C4.24 4.55 5.96 3.18 8 3.18z"/></svg>
        Увійти через Google
      </button>

      <div style={{ marginTop: 24, padding: '12px 14px', background: D1.surface, border: `1px dashed ${D1.border}`, borderRadius: 7, fontSize: 11, color: D1.textDim, lineHeight: 1.5, display: 'flex', gap: 10 }}>
        <span style={{ color: D1.textMute }}>i</span>
        <span>Можна продовжити <span style={{ color: D1.text, textDecoration: 'underline', textUnderlineOffset: 2 }}>без входу</span> — твоя статистика залишиться лише на цьому пристрої.</span>
      </div>

      <div style={{ marginTop: 28, fontSize: 10, color: D1.textMute, textAlign: 'center' }}>Тільки для студентів ЛПНУ ОІС · <span style={{ color: D1.textDim, textDecoration: 'underline', textUnderlineOffset: 2 }}>умови</span></div>
    </div>
  </div>
);

// 6. Q/A (FAQ)
const D1QA = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Q/A · довідка" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="home" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '220px 1fr' }}>
        <div style={{ padding: '32px 16px 24px 28px', borderRight: `1px solid ${D1.border}` }}>
          <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Розділи</div>
          {[
            { l: 'Про oistudy', a: true },
            { l: 'Джерело даних' },
            { l: 'Як працює тест' },
            { l: 'Точність та статистика' },
            { l: 'Як долучитись' },
            { l: 'Звітувати проблему' },
            { l: 'Контакти' },
          ].map((it, i) => (
            <div key={i} style={{ padding: '6px 10px', borderRadius: 5, color: it.a ? D1.text : D1.textDim, background: it.a ? D1.surface2 : 'transparent', fontSize: 13, fontWeight: it.a ? 500 : 400, marginBottom: 1 }}>{it.l}</div>
          ))}
        </div>
        <div style={{ padding: '32px 40px', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Q/A · довідка</div>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 8 }}>Питання та відповіді</h1>
          <p style={{ fontSize: 14, color: D1.textDim, marginTop: 4, maxWidth: 580, lineHeight: 1.55 }}>
            Все про oistudy: звідки питання, як зберігається прогрес, як долучитись. Якщо чогось бракує — напиши в Telegram.
          </p>

          <div style={{ marginTop: 22 }}>
            {[
              { q: 'Звідки взято питання?', a: 'Питання зібрано з Crowdly та з матеріалів викладачів ЛПНУ ОІС. Кожне має посилання на джерело (видно у Каталозі). Якщо знайдеш помилку — натисни «Поскаржитись».', open: true },
              { q: 'Чи зберігається прогрес?', a: 'Так. Без входу — локально на пристрої. З входом — синхронізується між пристроями.', open: false },
              { q: 'Як рахується точність?', a: 'Точність = правильні / спроби. Враховуються усі сесії, навіть незавершені.', open: false },
              { q: 'Чи можу я додати своє питання?', a: 'Так — відкрий питання в Каталозі і натисни «Запропонувати». Викладач затвердить.', open: false },
              { q: 'Чи це офіційний ресурс ЛПНУ?', a: 'Ні. Це студентський проєкт. Усі питання — для підготовки, на іспит не впливає.', open: false },
              { q: 'Знайшов баг — куди писати?', a: 'Telegram @oistudy_team або форма нижче.', open: false },
            ].map((qa, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${D1.border}`, padding: '14px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: qa.open ? D1.text : D1.textDim }}>{qa.q}</div>
                  <span style={{ color: D1.textMute, fontSize: 13 }}>{qa.open ? '−' : '+'}</span>
                </div>
                {qa.open && <div style={{ fontSize: 13, color: D1.textDim, lineHeight: 1.6, marginTop: 8, maxWidth: 580 }}>{qa.a}</div>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: 16, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Не знайшов відповідь?</div>
              <div style={{ fontSize: 12, color: D1.textMute, marginTop: 2 }}>Напиши нам у Telegram або через форму.</div>
            </div>
            <div style={{ flex: 1 }} />
            <button style={{ padding: '8px 14px', background: D1.accent, border: 'none', borderRadius: 6, color: '#0a0b0d', fontSize: 12, fontWeight: 600 }}>Telegram</button>
            <button style={{ padding: '8px 14px', background: 'transparent', border: `1px solid ${D1.border}`, borderRadius: 6, color: D1.text, fontSize: 12 }}>Форма</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.D1Flow = { D1TakeDesktop, D1TakeMulti, D1TakeNoAnswer, D1Profile, D1Login, D1QA };

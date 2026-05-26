// C · States / patterns + E · Edge cases

const D1 = window.D1;
const D1Topbar = window.D1Topbar;
const D1SideNav = window.D1SideNav;

// ─────────────────────────────────────────────
// SKELETON
const Skel = ({ w = '60%', h = 12, r = 3 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08), rgba(255,255,255,0.04))', backgroundSize: '200% 100%' }} />
);

const D1Skeleton = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar />
    <div style={{ display: 'flex', flex: 1 }}>
      <D1SideNav />
      <div style={{ flex: 1, padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Skel w={36} h={36} r={8} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skel w={240} h={18} />
            <Skel w={160} h={11} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${D1.border}`, borderRadius: 8, marginTop: 16, padding: 0, overflow: 'hidden' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ padding: 18, borderRight: i < 4 ? `1px solid ${D1.border}` : 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Skel w={80} h={9} />
              <Skel w={70} h={22} />
              <Skel w={100} h={9} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, border: `1px solid ${D1.border}`, borderRadius: 8 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 70px 80px', gap: 14, alignItems: 'center', padding: '14px 16px', borderBottom: i < 5 ? `1px solid ${D1.border}` : 'none' }}>
              <Skel w={7} h={7} r={99} />
              <Skel w={`${50 + i * 5}%`} h={12} />
              <Skel w={50} h={11} />
              <Skel w={60} h={11} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>↑ Skeleton state · показуємо доки fetch завантажує</div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// EMPTY STATES (5 in one artboard)
const EmptyFrame = ({ title, children }) => (
  <div style={{ padding: 18, border: `1px solid ${D1.border}`, borderRadius: 10, background: D1.surface, display: 'flex', flexDirection: 'column' }}>
    <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{title}</div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>{children}</div>
  </div>
);
const D1Empty = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, padding: 28, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Empty states</div>
      <div style={{ fontSize: 12, color: D1.textDim }}>// Стани коли немає даних — теплі, з підказкою куди йти далі</div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14, height: 'calc(100% - 60px)' }}>
      <EmptyFrame title="1 · Адмін без предметів">
        <div style={{ textAlign: 'center', maxWidth: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="10" width="28" height="22" rx="3" stroke={D1.textMute} strokeWidth="1.5" strokeDasharray="3 3"/>
              <line x1="6" y1="18" x2="34" y2="18" stroke={D1.textMute} strokeWidth="1.5" strokeDasharray="3 3"/>
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Жодного предмету</div>
          <div style={{ fontSize: 12, color: D1.textDim, marginTop: 6, lineHeight: 1.5 }}>Створи перший предмет — потім додамо теми та питання.</div>
          <button style={{ marginTop: 14, padding: '7px 14px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>+ Новий предмет</button>
        </div>
      </EmptyFrame>

      <EmptyFrame title="2 · Профіль · ще жодного тесту">
        <div style={{ textAlign: 'center', maxWidth: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: 4, height: 16, background: D1.border, borderRadius: 2 }} />)}
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Ще не пройдено жодного тесту</div>
          <div style={{ fontSize: 12, color: D1.textDim, marginTop: 6, lineHeight: 1.5 }}>Спробуй швидкий тест на 15 питань — побачиш свої слабкі теми.</div>
          <button style={{ marginTop: 14, padding: '7px 14px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Запустити тест →</button>
        </div>
      </EmptyFrame>

      <EmptyFrame title="3 · Каталог · фільтр без збігів">
        <div style={{ textAlign: 'center', maxWidth: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <svg width="36" height="36" viewBox="0 0 36 36"><circle cx="15" cy="15" r="10" fill="none" stroke={D1.textMute} strokeWidth="1.5"/><line x1="23" y1="23" x2="30" y2="30" stroke={D1.textMute} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Нічого не знайдено</div>
          <div style={{ fontSize: 12, color: D1.textDim, marginTop: 6, lineHeight: 1.5 }}>Спробуй послабити фільтри або інший пошуковий запит.</div>
          <button style={{ marginTop: 14, padding: '6px 12px', background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 5, fontSize: 12 }}>Скинути фільтри</button>
        </div>
      </EmptyFrame>

      <EmptyFrame title="4 · Предмет з 0 питань">
        <div style={{ textAlign: 'center', maxWidth: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: D1.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: D1.textMute, fontFamily: D1.mono }}>0</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>У цьому предметі ще немає питань</div>
          <div style={{ fontSize: 12, color: D1.textDim, marginTop: 6, lineHeight: 1.5 }}>Імпортуй з CSV, додай вручну, або скористайся AI-парсингом.</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 6, justifyContent: 'center' }}>
            <button style={{ padding: '6px 12px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>AI імпорт</button>
            <button style={{ padding: '6px 12px', background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 5, fontSize: 11 }}>+ Питання</button>
          </div>
        </div>
      </EmptyFrame>

      <EmptyFrame title="5 · Без помилок ✨">
        <div style={{ textAlign: 'center', maxWidth: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, gap: 4 }}>
            {[0,1,2,3,4].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: 99, background: D1.green }} />)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Жодної помилки!</div>
          <div style={{ fontSize: 12, color: D1.textDim, marginTop: 6, lineHeight: 1.5 }}>Усі 25 правильно. Спробуй темнішу складність — додай слабкі теми.</div>
          <button style={{ marginTop: 14, padding: '6px 12px', background: 'transparent', color: D1.accent, border: `1px solid ${D1.accent}`, borderRadius: 5, fontSize: 11, fontWeight: 600 }}>Складніший тест</button>
        </div>
      </EmptyFrame>

      <EmptyFrame title="6 · Q/A · ще немає відповідей">
        <div style={{ textAlign: 'center', maxWidth: 220 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: D1.textMute, fontFamily: D1.mono, fontSize: 22 }}>?</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Поки що тиша</div>
          <div style={{ fontSize: 12, color: D1.textDim, marginTop: 6, lineHeight: 1.5 }}>Постав перше питання — викладач або хтось зі студентів відповість.</div>
        </div>
      </EmptyFrame>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// ERROR / 404
const D1Error = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ maxWidth: 460, textAlign: 'center' }}>
        <div style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute, letterSpacing: '0.12em', marginBottom: 14 }}>404 · NOT_FOUND</div>
        <div style={{ fontFamily: D1.mono, fontSize: 96, fontWeight: 500, letterSpacing: '-0.04em', color: D1.accent, lineHeight: 1 }}>404</div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 14 }}>Сторінку не знайдено</div>
        <div style={{ fontSize: 14, color: D1.textDim, marginTop: 8, lineHeight: 1.55 }}>
          Можливо посилання застаріло, або предмет/тема видалені. Спробуй повернутись на головну або скористатись пошуком.
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button style={{ padding: '9px 16px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>← На головну <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>G H</Kbd></button>
          <button style={{ padding: '9px 16px', background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 7, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>Пошук <Kbd>⌘ K</Kbd></button>
        </div>
        <div style={{ marginTop: 30, padding: 14, background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 7, fontFamily: D1.mono, fontSize: 11, color: D1.textMute, textAlign: 'left' }}>
          <div style={{ color: D1.textDim }}>// debug</div>
          <div>request_id: <span style={{ color: D1.text }}>req_8af3b21c</span></div>
          <div>path: <span style={{ color: D1.text }}>/subjects/foo/topics/bar</span></div>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// MODALS / DIALOGS (3 in one artboard, on dimmed BG)
const D1Modals = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, position: 'relative', fontFamily: D1.sans, color: D1.text, overflow: 'hidden' }}>
    {/* Background sample */}
    <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
      <D1Topbar subject="Адмін · Питання" />
      <div style={{ display: 'flex', flex: 1 }}>
        <D1SideNav />
        <div style={{ padding: 28, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 22, fontWeight: 600 }}>Питання · 520</div>
          </div>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} />

    {/* Three modals composited side-by-side via grid */}
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'center', padding: '0 32px', gap: 20 }}>
      {/* Confirm delete */}
      <div style={{ background: D1.surface, border: `1px solid ${D1.borderStrong}`, borderRadius: 10, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(248,113,113,0.12)', color: D1.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>!</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Видалити питання?</div>
        </div>
        <div style={{ fontSize: 13, color: D1.textDim, lineHeight: 1.5 }}>
          Питання <span style={{ fontFamily: D1.mono, color: D1.text }}>#144</span> буде видалено остаточно. Студенти більше не побачать його у тестах та каталозі.
        </div>
        <div style={{ marginTop: 14, padding: 10, background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>
          // 21 відповідь буде збережена в логах
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button style={{ padding: '7px 14px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12 }}>Скасувати</button>
          <button style={{ padding: '7px 14px', background: D1.red, color: '#0a0b0d', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Видалити</button>
        </div>
      </div>

      {/* Unsaved changes */}
      <div style={{ background: D1.surface, border: `1px solid ${D1.borderStrong}`, borderRadius: 10, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(251,191,36,0.12)', color: D1.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>●</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Незбережені зміни</div>
        </div>
        <div style={{ fontSize: 13, color: D1.textDim, lineHeight: 1.5 }}>
          У тебе є зміни в питанні <span style={{ fontFamily: D1.mono, color: D1.text }}>#144</span> які не збережено. Якщо вийти зараз — зміни буде втрачено.
        </div>
        <div style={{ marginTop: 14, padding: 10, background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12, color: D1.textDim }}>
          • Текст питання<br />
          • Варіант (а)<br />
          • Пояснення
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button style={{ padding: '7px 14px', background: 'transparent', color: D1.red, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12 }}>Відкинути</button>
          <button style={{ padding: '7px 14px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12 }}>Скасувати</button>
          <button style={{ padding: '7px 14px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Зберегти</button>
        </div>
      </div>

      {/* Sign out */}
      <div style={{ background: D1.surface, border: `1px solid ${D1.borderStrong}`, borderRadius: 10, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: D1.surface2, color: D1.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>↗</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Вийти з акаунту?</div>
        </div>
        <div style={{ fontSize: 13, color: D1.textDim, lineHeight: 1.5 }}>
          Прогрес залишиться в хмарі — можна повернутись на будь-якому пристрої.
        </div>
        <div style={{ marginTop: 14, padding: 10, background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12, color: D1.textDim, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 99, background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)', color: '#0a0b0d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>Р</div>
          <span>Роман Коваленко <span style={{ color: D1.textMute }}>· roman.k@lpnu.ua</span></span>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button style={{ padding: '7px 14px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12 }}>Лишусь</button>
          <button style={{ padding: '7px 14px', background: D1.text, color: D1.bg, border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Вийти</button>
        </div>
      </div>
    </div>

    {/* Caption */}
    <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: D1.textMute, fontFamily: D1.mono, letterSpacing: '0.06em' }}>
      Confirm delete · Unsaved changes · Sign-out · (Esc щоб закрити будь-який)
    </div>
  </div>
);

// ─────────────────────────────────────────────
// TOAST / SAVE INDICATOR
const D1Toasts = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, position: 'relative', fontFamily: D1.sans, color: D1.text, overflow: 'hidden' }}>
    <div style={{ opacity: 0.4 }}>
      <D1Topbar subject="Адмін · Питання" />
      <div style={{ padding: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>Питання · 520</div>
      </div>
    </div>

    <div style={{ position: 'absolute', inset: 0, padding: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Toasts · інлайн-індикатори</div>

      {/* Inline save */}
      <div style={{ padding: '10px 14px', background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 7, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12, color: D1.textDim, alignSelf: 'flex-start' }}>
        <span style={{ width: 10, height: 10, borderRadius: 99, background: D1.green }} />
        Збережено <span style={{ color: D1.textMute, fontFamily: D1.mono }}>· 2с тому</span>
      </div>

      <div style={{ padding: '10px 14px', background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 7, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12, color: D1.textDim, alignSelf: 'flex-start' }}>
        <div style={{ width: 10, height: 10, borderRadius: 99, border: `1.5px solid ${D1.accent}`, borderRightColor: 'transparent' }} />
        Зберігаємо…
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(251,191,36,0.06)', border: `1px solid rgba(251,191,36,0.3)`, borderRadius: 7, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12, color: D1.amber, alignSelf: 'flex-start' }}>
        <span style={{ fontSize: 13 }}>●</span>
        Незбережені зміни · <span style={{ color: D1.textDim, textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}>зберегти</span>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Toast · правий нижній кут</div>
    </div>

    {/* Bottom-right toasts */}
    <div style={{ position: 'absolute', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10, width: 360 }}>
      <div style={{ padding: '12px 14px', background: D1.surface, border: `1px solid ${D1.borderStrong}`, borderRadius: 9, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(74,222,128,0.12)', color: D1.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Питання опубліковано</div>
          <div style={{ fontSize: 11, color: D1.textMute, marginTop: 2 }}>#144 «У методі Ньютона матриця Гессе...»</div>
        </div>
        <span style={{ fontSize: 12, color: D1.accent, cursor: 'pointer' }}>Скасувати</span>
      </div>

      <div style={{ padding: '12px 14px', background: D1.surface, border: `1px solid ${D1.borderStrong}`, borderRadius: 9, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(248,113,113,0.12)', color: D1.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>!</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Помилка збереження</div>
          <div style={{ fontSize: 11, color: D1.textMute, marginTop: 2 }}>Перевір мережу і спробуй ще раз</div>
        </div>
        <span style={{ fontSize: 12, color: D1.accent, cursor: 'pointer' }}>Повторити</span>
      </div>

      <div style={{ padding: '12px 14px', background: D1.surface, border: `1px solid ${D1.borderStrong}`, borderRadius: 9, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: D1.accentDim, color: D1.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>i</div>
        <div style={{ flex: 1, fontSize: 13 }}>28 питань імпортовано з AI-парсингу</div>
        <span style={{ fontSize: 12, color: D1.textDim }}>Переглянути →</span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// EDGE 23 · No-name greeting
const D1EdgeNoName = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="home" />
      <div style={{ flex: 1 }}>
        <div style={{ padding: '32px 40px 24px', borderBottom: `1px solid ${D1.border}` }}>
          <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Перший візит · без імені</div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>Привіт 👋</div>
          <div style={{ fontSize: 14, color: D1.textDim, marginTop: 6, maxWidth: 580, lineHeight: 1.55 }}>
            Це oistudy — підготовка до іспитів ОІС. Тут <span style={{ color: D1.text, fontFamily: D1.mono }}>520 питань</span> з Дослідження операцій з поясненнями. Почни звідки зручно.
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
            <button style={{ padding: '9px 16px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600 }}>Швидкий тест · 15 питань</button>
            <button style={{ padding: '9px 16px', background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 7, fontSize: 13 }}>Подивитись каталог</button>
            <button style={{ padding: '9px 16px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 7, fontSize: 13 }}>Як це працює?</button>
          </div>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Поки що порожньо</div>
          <div style={{ padding: 24, border: `1px dashed ${D1.border}`, borderRadius: 8, background: D1.surface, textAlign: 'center', color: D1.textDim, fontSize: 13 }}>
            Зроби перший тест і тут зʼявиться твоя статистика, прогрес та слабкі теми.
          </div>
        </div>
      </div>
    </div>
  </div>
);

// EDGE 24 · Signed-out banner
const D1EdgeSignedOut = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    {/* Banner */}
    <div style={{ background: D1.accentDim, borderBottom: `1px solid ${D1.accent}`, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: D1.accent }} />
      <span style={{ color: D1.text }}>Ти працюєш <strong>без входу</strong> — статистика залишається тільки на цьому пристрої.</span>
      <div style={{ flex: 1 }} />
      <button style={{ padding: '5px 12px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>Увійти</button>
      <span style={{ color: D1.textMute, cursor: 'pointer' }}>×</span>
    </div>
    <D1Topbar />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="home" />
      <div style={{ flex: 1, padding: '24px 40px' }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Гість · localStorage</div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>З поверненням 👋</div>
        <div style={{ fontSize: 14, color: D1.textDim, marginTop: 4 }}>Ти зробив 14 питань на цьому пристрої · 64% точність</div>

        <div style={{ marginTop: 20, padding: 16, background: D1.surface, border: `1px solid ${D1.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: D1.surface2, color: D1.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>↗</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Збережи прогрес</div>
            <div style={{ fontSize: 12, color: D1.textDim, marginTop: 2 }}>Увійди — і твоя статистика буде доступна на будь-якому пристрої.</div>
          </div>
          <button style={{ padding: '9px 16px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600 }}>Увійти →</button>
          <button style={{ padding: '9px 16px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 7, fontSize: 13 }}>Пізніше</button>
        </div>

        <div style={{ marginTop: 20, fontSize: 12, color: D1.textMute, lineHeight: 1.6 }}>
          На цьому пристрої · <span style={{ fontFamily: D1.mono, color: D1.textDim }}>2.4 MB</span> локально · 1 сесія<br />
          <span style={{ color: D1.textMute }}>// якщо очистиш кеш браузера — прогрес зникне</span>
        </div>
      </div>
    </div>
  </div>
);

// EDGE 25 · Test with 0 eligible questions
const D1EdgeZeroQuestions = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Дослідження операцій · Тест" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1SideNav active="test" />
      <div style={{ flex: 1, padding: '32px 40px', overflow: 'hidden' }}>
        <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Новий тест</div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Налаштування</div>

        <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(251,191,36,0.06)', border: `1px solid rgba(251,191,36,0.3)`, borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(251,191,36,0.12)', color: D1.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>!</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: D1.amber }}>0 питань відповідає твоїм фільтрам</div>
            <div style={{ fontSize: 12, color: D1.textDim, marginTop: 4, lineHeight: 1.5 }}>
              Обрано тільки «Слабкі теми» з точністю &lt; 30% — у тебе таких немає. Спробуй послабити фільтр або обрати інші теми.
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
              <button style={{ padding: '5px 11px', background: 'transparent', color: D1.amber, border: `1px solid ${D1.amber}`, borderRadius: 5, fontSize: 11, fontWeight: 600 }}>Слабкі &lt; 60%</button>
              <button style={{ padding: '5px 11px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 11 }}>Усі теми</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: 18, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, opacity: 0.7 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 6, background: D1.bg, opacity: 0.6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid ${D1.border}`, background: 'transparent' }} />
                <span style={{ width: 6, height: 6, borderRadius: 99, background: D1.textMute }} />
                <span style={{ fontSize: 13, color: D1.textDim }}>Тема {i + 1}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>0</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button disabled style={{ padding: '12px 22px', background: D1.surface2, color: D1.textMute, border: `1px solid ${D1.border}`, borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 8 }}>
            Старт <span style={{ fontFamily: D1.mono, fontSize: 11 }}>· 0 питань</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

window.D1States = { D1Skeleton, D1Empty, D1Error, D1Modals, D1Toasts, D1EdgeNoName, D1EdgeSignedOut, D1EdgeZeroQuestions };

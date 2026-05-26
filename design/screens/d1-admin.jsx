// B · Admin extras · Метод

const D1 = window.D1;
const D1Topbar = window.D1Topbar;
const D1topics = window.D1topics;

const D1AdminSide = ({ active }) => {
  const items = [
    { id: 'q', l: 'Питання', n: 520 },
    { id: 'subj', l: 'Предмети', n: 3 },
    { id: 'topics', l: 'Теми', n: 9 },
    { id: 'import', l: 'Імпорт CSV / AI', n: null },
    { id: 'mod', l: 'Q/A модерація', n: 4 },
    { id: 'users', l: 'Студенти', n: 142 },
    { id: 'an', l: 'Аналітика', n: null },
  ];
  return (
    <div style={{ width: 192, borderRight: `1px solid ${D1.border}`, padding: '14px 8px' }}>
      <div style={{ padding: '4px 10px', color: D1.textMute, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Адмін</div>
      {items.map(it => (
        <div key={it.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', borderRadius: 6, marginBottom: 1,
          background: active === it.id ? D1.surface2 : 'transparent',
          color: active === it.id ? D1.text : D1.textDim,
          fontWeight: active === it.id ? 500 : 400,
          fontSize: 13,
        }}>
          <span>{it.l}</span>
          {it.n !== null && <span style={{ fontFamily: D1.mono, fontSize: 10, color: D1.textMute }}>{it.n}</span>}
        </div>
      ))}
    </div>
  );
};

// 7. ADMIN · SUBJECTS
const D1AdminSubjects = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Адмін · Предмети" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1AdminSide active="subj" />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 420px' }}>
        <div style={{ padding: '22px 28px', overflow: 'hidden', borderRight: `1px solid ${D1.border}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Адмін</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Предмети · 3</div>
            </div>
            <button style={{ padding: '7px 12px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>+ Новий предмет <Kbd style={{ background: 'rgba(0,0,0,0.15)', color: '#0a0b0d', border: 'none' }}>N</Kbd></button>
          </div>

          <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '14px 36px 1fr 90px 80px 90px 70px', gap: 12, padding: '10px 14px', borderBottom: `1px solid ${D1.border}`, fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span>≡</span><span>Тег</span><span>Назва</span><span>Тем</span><span>Питань</span><span>Колір</span><span>Дії</span>
            </div>
            {[
              { tag: 'ДО', name: 'Дослідження операцій', slug: 'do', topics: 9, qs: 520, color: '#5eb6ff', active: true },
              { tag: 'БД', name: 'Бази даних', slug: 'db', topics: 7, qs: 410, color: '#a78bfa' },
              { tag: 'СА', name: 'Системний аналіз', slug: 'sa', topics: 6, qs: 287, color: '#4ade80' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px 36px 1fr 90px 80px 90px 70px', gap: 12, padding: '12px 14px', borderBottom: i < 2 ? `1px solid ${D1.border}` : 'none', alignItems: 'center', background: s.active ? D1.surface2 : 'transparent' }}>
                <span style={{ color: D1.textMute, cursor: 'grab' }}>≡</span>
                <span style={{ fontFamily: D1.mono, fontSize: 10, color: '#0a0b0d', background: s.color, padding: '3px 6px', borderRadius: 3, fontWeight: 700, width: 'fit-content' }}>{s.tag}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>/{s.slug}</div>
                </div>
                <span style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textDim }}>{s.topics}</span>
                <span style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textDim }}>{s.qs}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: s.color }} />
                  <span style={{ fontFamily: D1.mono, fontSize: 10, color: D1.textMute }}>{s.color}</span>
                </span>
                <span style={{ color: D1.textMute, fontSize: 14 }}>· · ·</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Архів</div>
          <div style={{ padding: '12px 14px', border: `1px dashed ${D1.border}`, borderRadius: 7, fontSize: 12, color: D1.textMute, textAlign: 'center', background: D1.surface }}>
            Жодного видаленого предмету
          </div>
        </div>

        {/* Editor */}
        <div style={{ borderLeft: `1px solid ${D1.border}`, padding: '22px 24px', background: D1.surface, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Редагування · ДО</div>
            <Kbd>esc</Kbd>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Slug</div>
            <div style={{ padding: '8px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontFamily: D1.mono, fontSize: 12, color: D1.text }}>do</div>
          </div>

          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Назва UK</div>
              <div style={{ padding: '8px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 13 }}>Дослідження операцій</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Назва EN</div>
              <div style={{ padding: '8px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 13, color: D1.textDim }}>Operations research</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Опис (для LLM-парсера та сторінки)</div>
            <div style={{ padding: '10px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.textDim, lineHeight: 1.5, minHeight: 64 }}>
              Прикладна математика для прийняття рішень: лінійне програмування, теорія двоїстості, транспортні задачі...
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Акцент</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['#5eb6ff', '#a78bfa', '#4ade80', '#34d399', '#fbbf24', '#c084fc', '#ec4899', '#f87171', '#6b7079', '#22d3ee'].map((c, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: 5, background: c, border: i === 0 ? `2px solid ${D1.text}` : `1px solid ${D1.border}`, cursor: 'pointer' }} />
              ))}
            </div>
            <div style={{ marginTop: 10, padding: 12, background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: '#5eb6ff', fontFamily: D1.mono, fontSize: 11, fontWeight: 700, color: '#0a0b0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ДО</div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Дослідження операцій</span>
              <span style={{ fontSize: 10, color: D1.textMute, marginLeft: 'auto' }}>превʼю</span>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Порядок</div>
            <div style={{ padding: '8px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontFamily: D1.mono, fontSize: 12, width: 80 }}>1</div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            <button style={{ flex: 1, padding: '9px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Зберегти</button>
            <button style={{ padding: '9px 14px', background: 'transparent', color: D1.red, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12 }}>Видалити</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 8. ADMIN · TOPICS
const D1AdminTopics = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Адмін · Теми · ДО" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1AdminSide active="topics" />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px' }}>
        <div style={{ padding: '22px 28px', overflow: 'hidden', borderRight: `1px solid ${D1.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Адмін · теми</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Дослідження операцій · 9 тем</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ padding: '5px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 11, color: D1.textDim }}>Предмет: ДО ▾</div>
            <button style={{ padding: '7px 12px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>+ Нова тема</button>
          </div>

          <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '14px 14px 1fr 70px 70px 90px 50px', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${D1.border}`, fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span>≡</span><span>•</span><span>Тема · slug</span><span>Питань</span><span>Точн.</span><span>Колір</span><span></span>
            </div>
            {D1topics.slice(0, 9).map((t, i) => {
              const acc = [72, 58, 38, 44, 67, 55, 80, 49, 51][i];
              return (
                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '14px 14px 1fr 70px 70px 90px 50px', gap: 10, padding: '10px 14px', borderBottom: i < 8 ? `1px solid ${D1.border}` : 'none', alignItems: 'center', background: i === 2 ? D1.surface2 : 'transparent' }}>
                  <span style={{ color: D1.textMute, cursor: 'grab' }}>≡</span>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: t.color }} />
                  <div>
                    <div style={{ fontSize: 13 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: D1.textMute, fontFamily: D1.mono, marginTop: 1 }}>/{t.id}</div>
                  </div>
                  <span style={{ fontFamily: D1.mono, fontSize: 12, color: D1.textDim }}>{t.count}</span>
                  <span style={{ fontFamily: D1.mono, fontSize: 12, color: acc < 50 ? D1.amber : D1.textDim }}>{acc}%</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: t.color }} />
                    <span style={{ fontFamily: D1.mono, fontSize: 10, color: D1.textMute }}>token</span>
                  </span>
                  <span style={{ color: D1.textMute, fontSize: 13, textAlign: 'right' }}>· · ·</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div style={{ borderLeft: `1px solid ${D1.border}`, padding: '22px 24px', background: D1.surface, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Редагування</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: '#a78bfa' }} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>Двоїстість</span>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Slug</div>
            <div style={{ padding: '8px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontFamily: D1.mono, fontSize: 12 }}>duality</div>
          </div>

          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Повна назва</div>
              <div style={{ padding: '8px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 13 }}>Двоїстість</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Коротка</div>
              <div style={{ padding: '8px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 13 }}>Двоїстість</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Hint (EN, для LLM)</div>
            <div style={{ padding: '10px 12px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, color: D1.textDim, lineHeight: 1.5, fontStyle: 'italic' }}>
              Duality theorems in LP, weak/strong duality, complementary slackness, dual simplex method.
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Колір</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {['#5eb6ff', '#a78bfa', '#4ade80', '#34d399', '#fbbf24', '#c084fc', '#ec4899', '#f87171', '#6b7079', '#22d3ee'].map((c, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: c, border: i === 1 ? `2px solid ${D1.text}` : `1px solid ${D1.border}` }} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Питань у темі</div>
          <div style={{ marginTop: 4, fontFamily: D1.mono, fontSize: 28 }}>54</div>

          <div style={{ flex: 1 }} />
          <button style={{ marginTop: 16, padding: '9px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Зберегти зміни</button>
        </div>
      </div>
    </div>
  </div>
);

// 9. ADMIN · IMPORT (AI)
const D1AdminImport = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Адмін · Імпорт" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1AdminSide active="import" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 28px 14px', borderBottom: `1px solid ${D1.border}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Імпорт</div>
            <div style={{ fontSize: 12, color: D1.textDim }}>Вставка → AI-парсинг → ревʼю → збереження</div>
          </div>
          {/* Stepper */}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            {[
              { l: '1 · Вставити сирий текст', s: 'done' },
              { l: '2 · AI-розбір', s: 'done' },
              { l: '3 · Ревʼю · 28 знайдено', s: 'active' },
              { l: '4 · Зберегти', s: 'pending' },
            ].map((s, i, arr) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: '6px 10px', borderRadius: 5, fontSize: 12,
                  background: s.s === 'active' ? D1.accentDim : 'transparent',
                  color: s.s === 'done' ? D1.green : s.s === 'active' ? D1.accent : D1.textMute,
                  border: `1px solid ${s.s === 'active' ? D1.accent : D1.border}`,
                }}>{s.s === 'done' ? '✓ ' : ''}{s.l}</div>
                {i < arr.length - 1 && <span style={{ color: D1.textMute, fontSize: 11 }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 28px 22px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Знайдені питання · 28</div>
              <div style={{ display: 'flex', gap: 8, fontSize: 11, color: D1.textDim }}>
                <span>● 24 готові</span>
                <span style={{ color: D1.amber }}>● 3 без відповіді</span>
                <span style={{ color: D1.red }}>● 1 дублікат</span>
              </div>
            </div>
            <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 110px 80px 70px', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${D1.border}`, fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <span><input type="checkbox" defaultChecked style={{ accentColor: D1.accent }} /></span>
                <span>Питання + варіанти</span><span>Тема (AI)</span><span>Впевн.</span><span>Стан</span>
              </div>
              {[
                { t: 'Метод штрафних функцій застосовується для:', topic: 'Нелінійне', conf: 0.92, state: 'ok' },
                { t: 'Принцип оптимальності Беллмана говорить що...', topic: 'Дискретне ЛП', conf: 0.81, state: 'ok' },
                { t: 'У задачі лінійного програмування...', topic: 'ЛП · симплекс', conf: 0.68, state: 'noans', warn: true },
                { t: 'Метод золотого перерізу — це:', topic: 'Одновимірна', conf: 0.95, state: 'ok' },
                { t: 'Сідлова точка існує коли...', topic: 'Ігрові методи', conf: 0.88, state: 'dup', warn: true },
              ].map((q, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 110px 80px 70px', gap: 10, padding: '12px 14px', borderBottom: i < 4 ? `1px solid ${D1.border}` : 'none', alignItems: 'center', background: q.warn ? 'rgba(251,191,36,0.04)' : 'transparent' }}>
                  <input type="checkbox" defaultChecked={!q.warn} style={{ accentColor: D1.accent }} />
                  <div>
                    <div style={{ fontSize: 13 }}>{q.t}</div>
                    <div style={{ fontSize: 11, color: D1.textMute, marginTop: 3 }}>4 варіанти знайдено · правильний: <span style={{ color: q.state === 'noans' ? D1.amber : D1.green }}>{q.state === 'noans' ? 'не визначено' : 'a'}</span></div>
                  </div>
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: D1.surface2, color: D1.textDim, fontFamily: D1.mono, width: 'fit-content' }}>{q.topic}</span>
                  <div>
                    <div style={{ fontFamily: D1.mono, fontSize: 11, color: q.conf < 0.75 ? D1.amber : D1.green }}>{(q.conf * 100).toFixed(0)}%</div>
                    <div style={{ height: 3, background: D1.surface2, borderRadius: 99, marginTop: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${q.conf * 100}%`, height: '100%', background: q.conf < 0.75 ? D1.amber : D1.green }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: q.state === 'ok' ? 'rgba(74,222,128,0.1)' : q.state === 'dup' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)', color: q.state === 'ok' ? D1.green : q.state === 'dup' ? D1.red : D1.amber, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', width: 'fit-content' }}>{q.state === 'ok' ? 'готово' : q.state === 'dup' ? 'дубль' : 'без відп.'}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderLeft: `1px solid ${D1.border}`, padding: '18px 24px', background: D1.surface, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Параметри парсингу</div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Предмет</div>
              <div style={{ padding: '7px 10px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, background: 'linear-gradient(135deg,#5eb6ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D1.mono, fontSize: 9, color: '#0a0b0d', fontWeight: 700 }}>ДО</span>
                Дослідження операцій
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Модель</div>
              <div style={{ padding: '7px 10px', background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 6, fontFamily: D1.mono, fontSize: 11 }}>claude-haiku-4-5 ▾</div>
            </div>

            <div style={{ marginTop: 18, padding: 12, background: D1.bg, border: `1px solid ${D1.border}`, borderRadius: 7 }}>
              <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Використання LLM</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }}>
                <div>
                  <div style={{ color: D1.textMute }}>Токени</div>
                  <div style={{ fontFamily: D1.mono, fontSize: 14, color: D1.text }}>12,484</div>
                </div>
                <div>
                  <div style={{ color: D1.textMute }}>Вартість</div>
                  <div style={{ fontFamily: D1.mono, fontSize: 14, color: D1.text }}>$0.04</div>
                </div>
                <div>
                  <div style={{ color: D1.textMute }}>Час</div>
                  <div style={{ fontFamily: D1.mono, fontSize: 14, color: D1.text }}>6.2s</div>
                </div>
                <div>
                  <div style={{ color: D1.textMute }}>Знайдено</div>
                  <div style={{ fontFamily: D1.mono, fontSize: 14, color: D1.text }}>28</div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }} />
            <button style={{ padding: '11px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600 }}>Зберегти 24 обраних →</button>
            <button style={{ marginTop: 6, padding: '9px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 12 }}>← Назад на парсинг</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 10. ADMIN · Q/A MODERATION
const D1AdminMod = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Адмін · Модерація" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1AdminSide active="mod" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '22px 28px 14px', borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Адмін · модерація</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Q/A · черга <span style={{ color: D1.amber }}>4</span></div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
            <span style={{ padding: '4px 10px', borderRadius: 5, background: D1.accentDim, color: D1.accent }}>Усі 4</span>
            <span style={{ padding: '4px 10px', borderRadius: 5, color: D1.textDim, border: `1px solid ${D1.border}` }}>Скарги 3</span>
            <span style={{ padding: '4px 10px', borderRadius: 5, color: D1.textDim, border: `1px solid ${D1.border}` }}>Пропозиції 1</span>
          </div>
        </div>

        <div style={{ padding: '14px 28px 20px', overflow: 'auto' }}>
          {[
            {
              kind: 'flag', who: 'roman.k', when: '2 хв тому',
              q: 'Метод гілок і меж відсікає варіанти за:',
              note: 'Перевірте варіант (в) — здається це теж може бути правильно, у конспекті проф. Іванова обидва варіанти.',
              opts: ['Верхньою межею', 'Нижньою межею', 'Випадково', 'За індексом'], r: 0, flagged: 2,
            },
            {
              kind: 'flag', who: 'andrii.h', when: '23 хв',
              q: 'У теорії ігор сідлова точка існує коли:',
              note: 'Очевидна помилка — правильна відповідь має бути (б), а у вас (а).',
              opts: ['Стратегії унікальні', 'min(max) = max(min)', 'Усі виграші додатні', 'Гравців більше двох'], r: 0,
            },
          ].map((c, i) => (
            <div key={i} style={{ padding: 18, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 3, background: 'rgba(248,113,113,0.12)', color: D1.red, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>⚑ скарга</span>
                <span style={{ fontSize: 12, color: D1.textDim }}>{c.who} · {c.when}</span>
                {c.flagged > 1 && <span style={{ fontSize: 11, color: D1.amber, fontFamily: D1.mono }}>· {c.flagged}-й раз позначено</span>}
                <div style={{ flex: 1 }} />
                <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>#{i + 144}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>{c.q}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                {c.opts.map((o, j) => (
                  <div key={j} style={{ padding: '8px 12px', borderRadius: 5, fontSize: 12, border: `1px solid ${j === c.r ? D1.green : D1.border}`, background: j === c.r ? 'rgba(74,222,128,0.06)' : D1.bg, color: j === c.r ? D1.text : D1.textDim, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: D1.mono, fontSize: 10, color: j === c.r ? D1.green : D1.textMute }}>{['а','б','в','г'][j]}</span>
                    <span style={{ flex: 1 }}>{o}</span>
                    {j === c.r && <span style={{ fontSize: 10, color: D1.green }}>✓ зараз правильна</span>}
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 12px', borderLeft: `2px solid ${D1.amber}`, background: 'rgba(251,191,36,0.04)', fontSize: 13, color: D1.textDim, fontStyle: 'italic', lineHeight: 1.5 }}>
                «{c.note}»
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                <button style={{ padding: '7px 12px', background: D1.accent, color: '#0a0b0d', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Редагувати питання</button>
                <button style={{ padding: '7px 12px', background: 'transparent', color: D1.text, border: `1px solid ${D1.borderStrong}`, borderRadius: 5, fontSize: 12 }}>Прийняти зміну</button>
                <button style={{ padding: '7px 12px', background: 'transparent', color: D1.textDim, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12 }}>Відхилити</button>
                <div style={{ flex: 1 }} />
                <button style={{ padding: '7px 12px', background: 'transparent', color: D1.textMute, border: `1px solid ${D1.border}`, borderRadius: 5, fontSize: 12 }}>Написати студенту</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 11. ADMIN · STUDENTS
const D1AdminUsers = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Адмін · Студенти" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1AdminSide active="users" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '22px 28px 14px', borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Адмін · студенти</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Профілі · 142</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ height: 32, width: 240, border: `1px solid ${D1.border}`, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, fontSize: 12, color: D1.textMute, background: D1.surface }}>
            <span>Шукати ім'я або email...</span>
          </div>
          <div style={{ padding: '5px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 11, color: D1.textDim }}>Курс: усі ▾</div>
        </div>

        <div style={{ padding: '14px 28px', overflow: 'hidden' }}>
          <div style={{ border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 110px 70px 90px 70px 70px 90px', gap: 12, padding: '10px 14px', borderBottom: `1px solid ${D1.border}`, fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span></span><span>Студент</span><span>Email</span><span>Сесій</span><span>Точність</span><span>Курс</span><span>Адмін</span><span>Дата</span>
            </div>
            {[
              { name: 'Роман Коваленко', email: 'roman.k@lpnu.ua', q: 54, acc: 64, year: 4, admin: true },
              { name: 'Андрій Гнатюк', email: 'andrii.h@lpnu.ua', q: 38, acc: 71, year: 4 },
              { name: 'Софія Мельник', email: 'sofiia.m@lpnu.ua', q: 88, acc: 82, year: 4 },
              { name: 'Богдан Ткач', email: 'bogdan.t@lpnu.ua', q: 12, acc: 45, year: 3 },
              { name: 'Олена Бойко', email: 'olena.b@lpnu.ua', q: 67, acc: 76, year: 4, admin: true },
              { name: 'Дмитро Шевченко', email: 'dmytro.s@lpnu.ua', q: 4, acc: 50, year: 3 },
              { name: 'Анна Дудник', email: 'anna.d@lpnu.ua', q: 22, acc: 59, year: 4 },
            ].map((u, i, arr) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 110px 70px 90px 70px 70px 90px', gap: 12, padding: '10px 14px', borderBottom: i < arr.length - 1 ? `1px solid ${D1.border}` : 'none', alignItems: 'center', fontSize: 13 }}>
                <div style={{ width: 28, height: 28, borderRadius: 99, background: `hsl(${i * 47}, 30%, 25%)`, color: D1.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{u.name.split(' ').map(x => x[0]).join('')}</div>
                <span>{u.name}</span>
                <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textDim }}>{u.email.split('@')[0]}@</span>
                <span style={{ fontFamily: D1.mono, fontSize: 12 }}>{u.q}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: D1.mono, fontSize: 12, color: u.acc < 60 ? D1.amber : D1.green }}>{u.acc}%</span>
                  <div style={{ width: 30, height: 3, background: D1.surface2, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${u.acc}%`, height: '100%', background: u.acc < 60 ? D1.amber : D1.green }} />
                  </div>
                </div>
                <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textDim }}>{u.year} курс</span>
                <div style={{ width: 28, height: 16, borderRadius: 99, background: u.admin ? D1.accent : D1.surface2, position: 'relative', border: `1px solid ${u.admin ? D1.accent : D1.border}` }}>
                  <div style={{ position: 'absolute', top: 1, left: u.admin ? 13 : 1, width: 12, height: 12, borderRadius: 99, background: u.admin ? '#0a0b0d' : D1.textDim }} />
                </div>
                <span style={{ fontFamily: D1.mono, fontSize: 10, color: D1.textMute, textAlign: 'right' }}>12 січ '25</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', fontSize: 11, color: D1.textMute, fontFamily: D1.mono }}>
            <span>1–7 з 142</span>
            <div style={{ flex: 1 }} />
            <span>← попередня</span>
            <span style={{ margin: '0 12px', color: D1.text }}>1</span>
            <span>наступна →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 12. ADMIN · ANALYTICS
const D1AdminAnalytics = () => (
  <div style={{ width: '100%', height: '100%', background: D1.bg, color: D1.text, fontFamily: D1.sans, display: 'flex', flexDirection: 'column' }}>
    <D1Topbar subject="Адмін · Аналітика" />
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <D1AdminSide active="an" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '22px 28px 14px', borderBottom: `1px solid ${D1.border}`, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Адмін</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Аналітика</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '5px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 11, color: D1.textDim }}>Предмет: ДО ▾</div>
          <div style={{ padding: '5px 10px', border: `1px solid ${D1.border}`, borderRadius: 6, fontSize: 11, color: D1.textDim }}>Період: 30 днів ▾</div>
        </div>

        <div style={{ padding: '18px 28px 24px', overflow: 'hidden' }}>
          {/* Top stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { l: 'Активних студентів', v: '142', s: '+12 за 30д', up: true },
              { l: 'Сесій', v: '1,847', s: '+18%' },
              { l: 'Точність (медіана)', v: '64%', s: '+2пп' },
              { l: 'Найскладніше питання', v: '#311', s: '12% правильних', warn: true },
            ].map((s, i) => (
              <div key={i} style={{ padding: 14, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface }}>
                <div style={{ fontSize: 10, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontFamily: D1.mono, fontSize: 22, marginTop: 4, color: s.warn ? D1.amber : D1.text }}>{s.v}</div>
                <div style={{ fontSize: 11, color: s.up ? D1.green : D1.textMute, marginTop: 2 }}>{s.s}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Topic heatmap */}
            <div style={{ padding: 16, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface }}>
              <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Точність по темах · усі студенти</div>
              {D1topics.slice(0, 9).map((t, i) => {
                const acc = [72, 58, 38, 44, 67, 55, 80, 49, 51][i];
                const attempts = [482, 612, 320, 410, 380, 220, 230, 180, 110][i];
                return (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 60px 60px', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: i < 8 ? `1px solid ${D1.border}` : 'none' }}>
                    <span style={{ width: 7, height: 7, borderRadius: 99, background: t.color }} />
                    <div>
                      <div style={{ fontSize: 12 }}>{t.name}</div>
                      <div style={{ height: 4, background: D1.surface2, borderRadius: 99, marginTop: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${acc}%`, height: '100%', background: acc < 50 ? D1.amber : acc < 65 ? D1.accent : D1.green }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: D1.mono, fontSize: 11, color: acc < 50 ? D1.amber : D1.textDim, textAlign: 'right' }}>{acc}%</span>
                    <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute, textAlign: 'right' }}>{attempts}</span>
                  </div>
                );
              })}
            </div>

            {/* Hardest questions + sparkline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 16, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Найскладніші питання</div>
                  <div style={{ fontSize: 11, color: D1.textDim }}>сортувати: точн. ↑</div>
                </div>
                {[
                  { n: 311, t: 'Двоїста задача максимізації, що відомо про знаки змінних...', acc: 12 },
                  { n: 244, t: 'У методі гілок і меж нижня оцінка для задачі мін...', acc: 24, weak: true },
                  { n: 142, t: 'Метод Фогеля для розв\'язання транспортної задачі...', acc: 31 },
                  { n: 199, t: 'Теорема Каруша-Куна-Такера застосовується для...', acc: 38 },
                ].map((q, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: i < 3 ? `1px solid ${D1.border}` : 'none', display: 'grid', gridTemplateColumns: '40px 1fr 50px', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.textMute }}>#{q.n}</span>
                    <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.t}</span>
                    <span style={{ fontFamily: D1.mono, fontSize: 11, color: D1.amber, textAlign: 'right' }}>{q.acc}%</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: 16, border: `1px solid ${D1.border}`, borderRadius: 8, background: D1.surface }}>
                <div style={{ fontSize: 11, color: D1.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Сесій / день · 30д</div>
                <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <polyline fill="none" stroke={D1.accent} strokeWidth="1.5" points={Array.from({ length: 30 }).map((_, i) => `${i * 10},${60 - 40 * (Math.sin(i / 2) * 0.4 + 0.5)}`).join(' ')} />
                  <polyline fill="rgba(94,182,255,0.12)" stroke="none" points={Array.from({ length: 30 }).map((_, i) => `${i * 10},${60 - 40 * (Math.sin(i / 2) * 0.4 + 0.5)}`).join(' ') + ' 290,80 0,80'} />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: D1.mono, fontSize: 10, color: D1.textMute, marginTop: 4 }}>
                  <span>26 квіт</span><span>11 трав</span><span>26 трав</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.D1AdminScreens = { D1AdminSubjects, D1AdminTopics, D1AdminImport, D1AdminMod, D1AdminUsers, D1AdminAnalytics };

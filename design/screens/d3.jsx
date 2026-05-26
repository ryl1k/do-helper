// Direction 3 · Консоль — Mono / Terminal mastery
// Jet black + lime accent, mono everywhere, sharp grid lines, systematic

const D3 = {
  bg: '#0a0a0a',
  surface: '#111111',
  surface2: '#161616',
  border: '#1f1f1f',
  borderStrong: '#2a2a2a',
  text: '#fafafa',
  textDim: '#a3a3a3',
  textMute: '#525252',
  lime: '#a3e635',
  limeDim: 'rgba(163,230,53,0.12)',
  red: '#ef4444',
  amber: '#facc15',
  cyan: '#38bdf8',
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
  display: '"Space Grotesk", "Inter", ui-sans-serif, sans-serif',
};

const D3topics = [
  { id: 'gen', name: 'general', uk: 'Загальні', count: 48 },
  { id: 'lp', name: 'lp.simplex', uk: 'ЛП · симплекс', count: 86 },
  { id: 'dual', name: 'duality', uk: 'Двоїстість', count: 54 },
  { id: 'trans', name: 'transport', uk: 'Транспортна', count: 71 },
  { id: 'disc', name: 'discrete', uk: 'Дискретне ЛП', count: 62 },
  { id: 'nonlin', name: 'nonlinear', uk: 'Нелінійне', count: 49 },
  { id: 'uni', name: 'unidim', uk: 'Одновимірна', count: 38 },
  { id: 'multi', name: 'multidim', uk: 'Багатовимірна', count: 44 },
  { id: 'game', name: 'gametheory', uk: 'Ігрові методи', count: 33 },
  { id: 'other', name: 'misc', uk: 'Інше', count: 35 },
];

const D3Bar = ({ path = '~' }) => (
  <div style={{ height: 36, borderBottom: `1px solid ${D3.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: D3.mono, fontSize: 11, color: D3.textDim, gap: 16, background: D3.bg }}>
    <div style={{ display: 'flex', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: D3.red }} />
      <span style={{ width: 8, height: 8, borderRadius: 99, background: D3.amber }} />
      <span style={{ width: 8, height: 8, borderRadius: 99, background: D3.lime }} />
    </div>
    <span style={{ color: D3.textMute }}>oistudy</span>
    <span style={{ color: D3.textMute }}>—</span>
    <span style={{ color: D3.text }}>{path}</span>
    <div style={{ flex: 1 }} />
    <span>roman@lpnu</span>
    <span style={{ color: D3.textMute }}>·</span>
    <span style={{ color: D3.lime }}>● online</span>
  </div>
);

const D3Nav = () => (
  <div style={{ height: 40, borderBottom: `1px solid ${D3.border}`, padding: '0 16px', display: 'flex', alignItems: 'stretch', fontFamily: D3.mono, fontSize: 11, background: D3.bg }}>
    {[
      { l: 'home', k: 'g h', a: false },
      { l: 'subjects', k: 'g s', a: true },
      { l: 'test', k: 't', a: false },
      { l: 'catalog', k: 'c', a: false },
      { l: 'qa', k: '?', a: false },
      { l: 'admin', k: 'g a', a: false },
    ].map((it, i) => (
      <div key={i} style={{
        padding: '0 14px', display: 'flex', alignItems: 'center', gap: 6,
        color: it.a ? D3.lime : D3.textDim,
        background: it.a ? D3.limeDim : 'transparent',
        borderRight: `1px solid ${D3.border}`,
      }}>
        <span style={{ color: it.a ? D3.lime : D3.textMute }}>$</span>
        <span style={{ textTransform: 'lowercase' }}>{it.l}</span>
        <span style={{ color: D3.textMute, fontSize: 10 }}>[{it.k}]</span>
      </div>
    ))}
    <div style={{ flex: 1 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 4, color: D3.textMute }}>
      <span>find</span><span style={{ color: D3.text }}>/</span>
    </div>
  </div>
);

// 1. HOME
const D3Home = () => (
  <div style={{ width: '100%', height: '100%', background: D3.bg, color: D3.text, fontFamily: D3.mono, display: 'flex', flexDirection: 'column' }}>
    <D3Bar path="~/oistudy" />
    <D3Nav />
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', overflow: 'hidden' }}>
      {/* Left main */}
      <div style={{ padding: '36px 40px', borderRight: `1px solid ${D3.border}`, overflow: 'hidden' }}>
        <div style={{ fontSize: 11, color: D3.lime, letterSpacing: '0.12em' }}>{'>'} session start · 26.05.2026 14:22</div>
        <div style={{ fontFamily: D3.display, fontSize: 48, letterSpacing: '-0.04em', fontWeight: 500, marginTop: 18, lineHeight: 1 }}>
          <span style={{ color: D3.textMute }}>oi</span>study<span style={{ color: D3.lime }}>_</span>
        </div>
        <div style={{ fontFamily: D3.mono, fontSize: 13, color: D3.textDim, marginTop: 12, maxWidth: 480, lineHeight: 1.5 }}>
          // exam prep // LPNU OIS only<br />
          // 1 subject loaded · 520 questions · 9 topics
        </div>

        {/* Status grid */}
        <div style={{ marginTop: 32, border: `1px solid ${D3.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { l: 'PROGRESS', v: '322/520', p: '62%', s: D3.lime },
              { l: 'ACCURACY', v: '62%', p: '+4 wk', s: D3.lime },
              { l: 'STREAK', v: '07d', p: 'best 12d', s: D3.text },
              { l: 'WEAK_TOPICS', v: '3', p: 'see below', s: D3.amber },
            ].map((s, i) => (
              <div key={i} style={{ padding: '14px 16px', borderRight: i < 3 ? `1px solid ${D3.border}` : 'none' }}>
                <div style={{ fontSize: 10, color: D3.textMute, letterSpacing: '0.1em' }}>{s.l}</div>
                <div style={{ fontFamily: D3.display, fontSize: 28, color: s.s, letterSpacing: '-0.02em', marginTop: 6 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: D3.textMute, marginTop: 2 }}>{s.p}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginBottom: 8 }}>SUBJECTS [3]</div>
          <div style={{ border: `1px solid ${D3.border}` }}>
            {[
              { tag: 'do', name: 'Дослідження операцій', qs: 520, acc: 62, status: 'active' },
              { tag: 'db', name: 'Бази даних', qs: 410, acc: null, status: 'idle' },
              { tag: 'sa', name: 'Системний аналіз', qs: 287, acc: null, status: 'idle' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 70px', gap: 14, alignItems: 'center', padding: '12px 16px', borderBottom: i < 2 ? `1px solid ${D3.border}` : 'none' }}>
                <span style={{ fontSize: 11, color: D3.lime }}>[{s.tag}]</span>
                <span style={{ fontFamily: D3.sans, fontSize: 14, fontWeight: 500 }}>{s.name}</span>
                <span style={{ fontSize: 11, color: D3.textDim }}>{s.qs} q</span>
                <span style={{ fontSize: 11, color: s.acc ? D3.lime : D3.textMute }}>{s.acc ? s.acc + '%' : '—'}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', border: `1px solid ${s.status === 'active' ? D3.lime : D3.border}`, color: s.status === 'active' ? D3.lime : D3.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', width: 'fit-content' }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{ padding: '36px 40px', overflow: 'hidden' }}>
        <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginBottom: 12 }}>ACTIVITY · LAST_84d</div>
        {/* heatmap of 12x7 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, border: `1px solid ${D3.border}`, padding: 8 }}>
          {Array.from({ length: 12 * 7 }).map((_, i) => {
            const seed = (Math.sin(i * 7.7) + 1) / 2;
            const v = seed > 0.85 ? 4 : seed > 0.65 ? 3 : seed > 0.4 ? 2 : seed > 0.2 ? 1 : 0;
            const c = ['#1a1a1a', 'rgba(163,230,53,0.2)', 'rgba(163,230,53,0.4)', 'rgba(163,230,53,0.7)', '#a3e635'][v];
            return <div key={i} style={{ aspectRatio: '1', background: c }} />;
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: D3.textMute, marginTop: 6 }}>
          <span>54 sessions</span><span>1,247 questions</span><span>32h total</span>
        </div>

        <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginTop: 28, marginBottom: 12 }}>WEAK_TOPICS [3]</div>
        {[
          { name: 'duality', uk: 'Двоїстість', acc: 38 },
          { name: 'transport', uk: 'Транспортна', acc: 44 },
          { name: 'gametheory', uk: 'Ігрові методи', acc: 51 },
        ].map((t, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${D3.border}`, display: 'grid', gridTemplateColumns: '14px 1fr 60px', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: D3.amber }}>▲</span>
            <div>
              <div style={{ fontFamily: D3.sans, fontSize: 13, fontWeight: 500 }}>{t.uk}</div>
              <div style={{ fontSize: 10, color: D3.textMute }}>{t.name}.set</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, color: D3.amber }}>{t.acc}%</span>
              </div>
              <div style={{ height: 2, background: D3.surface, marginTop: 4 }}>
                <div style={{ width: `${t.acc}%`, height: '100%', background: D3.amber }} />
              </div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 18, padding: '12px 14px', border: `1px solid ${D3.lime}`, background: D3.limeDim, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: D3.lime }}>$ ./test --weak</span>
          <span style={{ fontSize: 10, color: D3.lime, padding: '1px 6px', border: `1px solid ${D3.lime}` }}>F</span>
        </div>
      </div>
    </div>
  </div>
);

// 2. SUBJECT OVERVIEW
const D3Subject = () => (
  <div style={{ width: '100%', height: '100%', background: D3.bg, color: D3.text, fontFamily: D3.mono, display: 'flex', flexDirection: 'column' }}>
    <D3Bar path="~/oistudy/do" />
    <D3Nav />
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '32px 40px', borderBottom: `1px solid ${D3.border}` }}>
        <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em' }}>SUBJECT · do</div>
        <div style={{ fontFamily: D3.display, fontSize: 40, letterSpacing: '-0.03em', fontWeight: 500, marginTop: 6, lineHeight: 1 }}>
          Дослідження операцій<span style={{ color: D3.lime }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 14, fontSize: 12, color: D3.textDim }}>
          <span>questions <span style={{ color: D3.text }}>520</span></span>
          <span>topics <span style={{ color: D3.text }}>9</span></span>
          <span>accuracy <span style={{ color: D3.lime }}>62%</span></span>
          <span>covered <span style={{ color: D3.text }}>322</span></span>
          <span>exam_in <span style={{ color: D3.amber }}>12d</span></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', flex: 1, minHeight: 0 }}>
        <div style={{ padding: '24px 40px 24px', borderRight: `1px solid ${D3.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em' }}>TOPICS [9]</span>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: D3.textDim }}>
              <span>sort:</span>
              <span style={{ color: D3.lime }}>weak first</span>
              <span>·</span>
              <span>alpha</span>
              <span>·</span>
              <span>count</span>
            </div>
          </div>
          <div style={{ border: `1px solid ${D3.border}` }}>
            {D3topics.slice(0, 9).map((t, i) => {
              const acc = [72, 58, 38, 44, 67, 55, 80, 49, 51][i];
              const done = [42, 71, 22, 31, 49, 28, 30, 18, 14][i];
              const weak = acc < 50;
              return (
                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '24px 1.4fr 1fr 80px 90px 100px 70px', gap: 12, alignItems: 'center', padding: '12px 14px', borderBottom: i < 8 ? `1px solid ${D3.border}` : 'none' }}>
                  <span style={{ fontSize: 11, color: weak ? D3.amber : D3.textMute }}>{weak ? '▲' : '·'}</span>
                  <span style={{ fontFamily: D3.sans, fontSize: 13, fontWeight: 500 }}>{t.uk}</span>
                  <span style={{ fontSize: 11, color: D3.textMute }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: D3.textDim }}>{done}/{t.count}</span>
                  <div style={{ height: 4, background: D3.surface }}>
                    <div style={{ width: `${(done / t.count) * 100}%`, height: '100%', background: weak ? D3.amber : D3.lime }} />
                  </div>
                  <span style={{ fontSize: 11, color: weak ? D3.amber : D3.lime, textAlign: 'right' }}>acc {acc}%</span>
                  <span style={{ fontSize: 11, color: D3.lime, textAlign: 'right' }}>open ↗</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '24px 28px', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginBottom: 10 }}>RUN</div>
          {[
            { cmd: './test --quick', d: '15 random q · ~8 min', k: 'T' },
            { cmd: './catalog --filter', d: '520 questions · search', k: 'C' },
            { cmd: './test --weak', d: '3 topics · accuracy < 50%', k: 'F', hot: true },
            { cmd: './qa', d: 'community questions', k: '?' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '12px 12px', border: `1px solid ${c.hot ? D3.lime : D3.border}`, background: c.hot ? D3.limeDim : 'transparent', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: c.hot ? D3.lime : D3.text }}><span style={{ color: D3.textMute }}>$</span> {c.cmd}</div>
                <div style={{ fontSize: 10, color: D3.textMute, marginTop: 2 }}>// {c.d}</div>
              </div>
              <span style={{ fontSize: 10, color: c.hot ? D3.lime : D3.textDim, padding: '1px 6px', border: `1px solid ${c.hot ? D3.lime : D3.border}` }}>{c.k}</span>
            </div>
          ))}

          <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginTop: 20, marginBottom: 10 }}>RECENT_SESSIONS</div>
          {[
            { t: '14:22 today', q: 25, acc: 76 },
            { t: '19:08 yest.', q: 50, acc: 64 },
            { t: '24.05 10:31', q: 15, acc: 53 },
          ].map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', gap: 10, padding: '7px 0', borderBottom: `1px solid ${D3.border}`, fontSize: 11 }}>
              <span style={{ color: D3.textMute }}>{s.t}</span>
              <span style={{ color: D3.textDim }}>{s.q}q</span>
              <span style={{ color: s.acc < 60 ? D3.amber : D3.lime, textAlign: 'right' }}>{s.acc}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 3. TEST BUILDER
const D3Builder = () => {
  const sel = [true, true, false, true, true, false, true, true, true, true];
  return (
    <div style={{ width: '100%', height: '100%', background: D3.bg, color: D3.text, fontFamily: D3.mono, display: 'flex', flexDirection: 'column' }}>
      <D3Bar path="~/oistudy/do/test --build" />
      <D3Nav />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', flex: 1, minHeight: 0 }}>
        <div style={{ padding: '32px 40px', borderRight: `1px solid ${D3.border}`, overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: D3.lime, letterSpacing: '0.1em' }}>$ ./test --build</div>
          <div style={{ fontFamily: D3.display, fontSize: 32, letterSpacing: '-0.03em', fontWeight: 500, marginTop: 6 }}>configure_test()</div>
          <div style={{ fontSize: 11, color: D3.textMute, marginTop: 4 }}>// pick topics, set count, optionally toggle flags</div>

          <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em' }}>--topics [{sel.filter(Boolean).length}/10]</span>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: D3.textDim }}>
              <span>--all</span>
              <span>--none</span>
              <span style={{ color: D3.lime }}>--weak</span>
            </div>
          </div>
          <div style={{ border: `1px solid ${D3.border}` }}>
            {D3topics.map((t, i) => {
              const acc = [72, 58, 38, 44, 67, 55, 80, 49, 51, 60][i];
              return (
                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 70px 70px', gap: 10, alignItems: 'center', padding: '10px 14px', borderBottom: i < 9 ? `1px solid ${D3.border}` : 'none' }}>
                  <span style={{ fontFamily: D3.mono, fontSize: 12, color: sel[i] ? D3.lime : D3.textMute }}>{sel[i] ? '[x]' : '[ ]'}</span>
                  <span style={{ fontFamily: D3.sans, fontSize: 13, fontWeight: 500 }}>{t.uk}</span>
                  <span style={{ fontSize: 11, color: D3.textMute }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: acc < 50 ? D3.amber : D3.textDim, textAlign: 'right' }}>{acc}%</span>
                  <span style={{ fontSize: 11, color: D3.textMute, textAlign: 'right' }}>n={t.count}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em' }}>--count</span>
            <span style={{ fontSize: 11, color: D3.textMute }}>// max 78</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr 1fr', gap: 6 }}>
            <div style={{ padding: '10px 14px', border: `1px solid ${D3.lime}`, background: D3.limeDim, color: D3.lime, fontSize: 18, textAlign: 'center', fontWeight: 500 }}>25</div>
            {[10, 25, 50, 78].map((n, i) => (
              <div key={i} style={{ padding: '10px', border: `1px solid ${n === 25 ? D3.lime : D3.border}`, color: n === 25 ? D3.lime : D3.textDim, fontSize: 13, textAlign: 'center' }}>{n}</div>
            ))}
          </div>

          <div style={{ marginTop: 24, fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginBottom: 8 }}>--flags</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              { l: '--explain-immediately', on: true },
              { l: '--shuffle-options', on: true },
              { l: '--timer 60s', on: false },
              { l: '--weak-only', on: false },
            ].map((f, i) => (
              <div key={i} style={{ padding: '10px 12px', border: `1px solid ${f.on ? D3.lime : D3.border}`, background: f.on ? D3.limeDim : 'transparent', color: f.on ? D3.lime : D3.textDim, fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{f.on ? '[x]' : '[ ]'}</span>{f.l}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em' }}>PREVIEW</div>
          <div style={{ fontFamily: D3.display, fontSize: 84, letterSpacing: '-0.05em', fontWeight: 500, marginTop: 10, lineHeight: 1, color: D3.lime }}>25</div>
          <div style={{ fontSize: 12, color: D3.textDim }}>questions from <span style={{ color: D3.text }}>7 topics</span></div>
          <div style={{ fontSize: 11, color: D3.textMute, marginTop: 4 }}>// ~12 min · 78 available</div>

          <div style={{ marginTop: 26, fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginBottom: 8 }}>DISTRIBUTION</div>
          <div style={{ border: `1px solid ${D3.border}`, padding: 12 }}>
            {D3topics.filter((_, i) => sel[i]).slice(0, 7).map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 30px', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: i < 6 ? `1px solid ${D3.border}` : 'none', fontSize: 11 }}>
                <span style={{ color: D3.textDim }}>{t.name}</span>
                <div style={{ height: 4, background: D3.surface }}>
                  <div style={{ width: `${50 + i * 8}%`, height: '100%', background: D3.lime, opacity: 0.6 }} />
                </div>
                <span style={{ color: D3.textMute, textAlign: 'right' }}>{Math.round((50 + i * 8) / 5)}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />
          <button style={{ padding: '14px', background: D3.lime, color: D3.bg, border: 'none', fontFamily: D3.mono, fontWeight: 600, fontSize: 14, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span>$</span><span>./run --start</span>
            <span style={{ marginLeft: 'auto', padding: '2px 6px', background: 'rgba(0,0,0,0.2)', fontSize: 10 }}>⌘↵</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. TEST-TAKING (mobile)
const D3Take = () => (
  <div style={{ width: '100%', height: '100%', background: D3.bg, color: D3.text, fontFamily: D3.mono, display: 'flex', flexDirection: 'column' }}>
    <StatusBar dark />
    <div style={{ height: 32, borderBottom: `1px solid ${D3.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 10, color: D3.textDim, gap: 8 }}>
      <span style={{ color: D3.lime }}>●</span>
      <span>session.run()</span>
      <span style={{ color: D3.textMute }}>—</span>
      <span style={{ color: D3.text }}>q=7/25</span>
      <div style={{ flex: 1 }} />
      <span>00:42</span>
    </div>

    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${D3.border}` }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, background: i < 6 ? (i === 1 || i === 4 ? D3.red : D3.lime) : i === 6 ? D3.text : '#1a1a1a' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: D3.textMute, marginTop: 6 }}>
        <span>● 4 correct</span>
        <span>● 2 wrong</span>
        <span>● 19 left</span>
      </div>
    </div>

    <div style={{ flex: 1, padding: '20px 20px 12px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10, color: D3.lime, padding: '1px 6px', border: `1px solid ${D3.lime}`, letterSpacing: '0.06em' }}>TRANSPORT</span>
        <span style={{ fontSize: 10, color: D3.textMute }}>question/142</span>
      </div>
      <div style={{ fontFamily: D3.sans, fontSize: 19, lineHeight: 1.35, fontWeight: 500, letterSpacing: '-0.01em' }}>
        Метод Фогеля для розв'язання транспортної задачі базується на:
      </div>

      <div style={{ marginTop: 18 }}>
        {[
          { l: 'a', t: 'Градієнтах функції', state: 'normal' },
          { l: 'b', t: 'Потенціалах рядків та стовпців', state: 'correct' },
          { l: 'c', t: 'Похідних обмежень', state: 'wrong' },
          { l: 'd', t: 'Штрафних вартостях', state: 'normal' },
        ].map((o, i) => (
          <div key={i} style={{
            padding: '12px 14px', marginBottom: 6,
            border: `1px solid ${o.state === 'correct' ? D3.lime : o.state === 'wrong' ? D3.red : D3.border}`,
            background: o.state === 'correct' ? D3.limeDim : o.state === 'wrong' ? 'rgba(239,68,68,0.06)' : 'transparent',
            display: 'flex', alignItems: 'center', gap: 12, fontFamily: D3.sans, fontSize: 14,
          }}>
            <span style={{ fontFamily: D3.mono, fontSize: 11, color: o.state === 'correct' ? D3.lime : o.state === 'wrong' ? D3.red : D3.textMute, padding: '2px 6px', border: `1px solid ${o.state === 'correct' ? D3.lime : o.state === 'wrong' ? D3.red : D3.border}`, minWidth: 18, textAlign: 'center' }}>{o.l}</span>
            <span style={{ flex: 1, color: o.state === 'correct' ? D3.text : o.state === 'wrong' ? '#888' : D3.textDim, textDecoration: o.state === 'wrong' ? 'line-through' : 'none' }}>{o.t}</span>
            {o.state === 'correct' && <span style={{ fontFamily: D3.mono, fontSize: 11, color: D3.lime }}>{'->'} ok</span>}
          </div>
        ))}
      </div>
    </div>

    <div style={{ borderTop: `1px solid ${D3.border}`, padding: '12px 20px', background: D3.surface }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: D3.lime, letterSpacing: '0.1em' }}>$ explain</span>
        <span style={{ fontSize: 10, color: D3.textMute }}>// transport · acc 44%</span>
      </div>
      <div style={{ fontFamily: D3.sans, fontSize: 13, color: D3.textDim, lineHeight: 1.5 }}>
        Метод Фогеля будує початковий допустимий розв'язок через <span style={{ color: D3.lime }}>штрафні різниці</span> між двома найменшими тарифами в кожному рядку та стовпці.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: D3.textMute, padding: '4px 8px', border: `1px solid ${D3.border}` }}>[B] bookmark</span>
        <div style={{ flex: 1 }} />
        <button style={{ padding: '10px 18px', background: D3.lime, color: D3.bg, border: 'none', fontFamily: D3.mono, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          next() <span style={{ padding: '1px 5px', background: 'rgba(0,0,0,0.2)', fontSize: 10 }}>↵</span>
        </button>
      </div>
    </div>
    <HomeIndicator />
  </div>
);

// 5. RESULTS
const D3Results = () => (
  <div style={{ width: '100%', height: '100%', background: D3.bg, color: D3.text, fontFamily: D3.mono, display: 'flex', flexDirection: 'column' }}>
    <D3Bar path="~/oistudy/do/test --result" />
    <D3Nav />
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, borderBottom: `1px solid ${D3.border}` }}>
        <div>
          <div style={{ fontSize: 11, color: D3.lime, letterSpacing: '0.1em' }}>{'>'} session.complete · 11:22 elapsed</div>
          <div style={{ fontFamily: D3.display, fontSize: 100, letterSpacing: '-0.06em', fontWeight: 500, marginTop: 16, lineHeight: 0.85, color: D3.lime }}>
            76<span style={{ fontSize: 60, color: D3.textMute }}>%</span>
          </div>
          <div style={{ fontFamily: D3.sans, fontSize: 16, color: D3.textDim, marginTop: 16 }}>
            <span style={{ color: D3.text, fontWeight: 600 }}>19</span> correct · <span style={{ color: D3.red }}>6</span> wrong · <span style={{ color: D3.lime }}>+14%</span> vs avg
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 24 }}>
            {[
              { l: 'time/q', v: '27s' },
              { l: 'fastest', v: '4s' },
              { l: 'slowest', v: '1m22' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '12px 14px', border: `1px solid ${D3.border}` }}>
                <div style={{ fontSize: 10, color: D3.textMute, letterSpacing: '0.1em' }}>{s.l}</div>
                <div style={{ fontFamily: D3.display, fontSize: 22, marginTop: 4, letterSpacing: '-0.02em' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginBottom: 12 }}>BY_TOPIC</div>
          {[
            { name: 'transport', got: 7, total: 8 },
            { name: 'lp.simplex', got: 5, total: 6 },
            { name: 'duality', got: 2, total: 5, weak: true },
            { name: 'gametheory', got: 5, total: 6 },
          ].map((t, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${D3.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr 60px', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: D3.textDim }}>{t.name}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: t.total }).map((_, j) => (
                  <span key={j} style={{ flex: 1, height: 14, background: j < t.got ? (t.weak ? D3.amber : D3.lime) : '#1a1a1a' }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: t.weak ? D3.amber : D3.lime, textAlign: 'right' }}>{t.got}/{t.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em' }}>WRONG [6]</span>
          <span style={{ fontSize: 11, color: D3.lime }}>$ ./review --wrong</span>
        </div>
        <div style={{ border: `1px solid ${D3.border}` }}>
          {[
            { n: 4, t: 'Якщо пряма задача — максимізація, двоїста є:', topic: 'duality', user: 'необмежена', right: 'мінімізації' },
            { n: 11, t: 'Метод штучного базису потребує:', topic: 'lp.simplex', user: 'M-методу', right: 'двофазового методу' },
            { n: 17, t: 'Ефективний цикл проходить через:', topic: 'transport', user: 'мінімум', right: 'базисні клітинки' },
          ].map((e, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px', gap: 12, padding: '12px 14px', borderBottom: i < 2 ? `1px solid ${D3.border}` : 'none' }}>
              <span style={{ fontSize: 11, color: D3.red }}>#{e.n}</span>
              <div>
                <div style={{ fontFamily: D3.sans, fontSize: 13 }}>{e.t}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: D3.textMute }}>
                  // <span style={{ color: D3.red, textDecoration: 'line-through' }}>{e.user}</span>
                  <span style={{ margin: '0 6px' }}>→</span>
                  <span style={{ color: D3.lime }}>{e.right}</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: D3.textDim, textAlign: 'right' }}>{e.topic}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button style={{ padding: '11px 18px', background: D3.lime, color: D3.bg, border: 'none', fontFamily: D3.mono, fontWeight: 600, fontSize: 13 }}>$ ./retry --wrong</button>
          <button style={{ padding: '11px 18px', background: 'transparent', border: `1px solid ${D3.borderStrong}`, color: D3.text, fontFamily: D3.mono, fontSize: 13 }}>$ ./test --new</button>
          <button style={{ padding: '11px 18px', background: 'transparent', border: `1px solid ${D3.border}`, color: D3.textDim, fontFamily: D3.mono, fontSize: 13 }}>$ ./export --pdf</button>
        </div>
      </div>
    </div>
  </div>
);

// 6. CATALOG
const D3Catalog = () => (
  <div style={{ width: '100%', height: '100%', background: D3.bg, color: D3.text, fontFamily: D3.mono, display: 'flex', flexDirection: 'column' }}>
    <D3Bar path="~/oistudy/do/catalog" />
    <D3Nav />
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 32px 12px', borderBottom: `1px solid ${D3.border}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: D3.display, fontSize: 28, letterSpacing: '-0.03em', fontWeight: 500 }}>catalog<span style={{ color: D3.lime }}>.</span>find()</span>
          <span style={{ fontSize: 11, color: D3.textDim }}>// 520 records · displaying 30</span>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, height: 32, border: `1px solid ${D3.border}`, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: D3.textDim }}>
            <span style={{ color: D3.lime }}>{'>'}</span>
            <span>Шукати у 520 питаннях...</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, padding: '1px 5px', border: `1px solid ${D3.border}` }}>/</span>
          </div>
          <button style={{ padding: '0 14px', height: 32, border: `1px solid ${D3.border}`, background: 'transparent', color: D3.textDim, fontFamily: D3.mono, fontSize: 11 }}>--filter</button>
          <button style={{ padding: '0 14px', height: 32, border: `1px solid ${D3.lime}`, background: D3.limeDim, color: D3.lime, fontFamily: D3.mono, fontSize: 11 }}>--show-answers</button>
        </div>

        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <span style={{ padding: '3px 8px', fontSize: 10, background: D3.limeDim, color: D3.lime, border: `1px solid ${D3.lime}` }}>all · 520</span>
          {D3topics.map(t => (
            <span key={t.id} style={{ padding: '3px 8px', fontSize: 10, color: D3.textDim, border: `1px solid ${D3.border}` }}>{t.name} <span style={{ color: D3.textMute }}>{t.count}</span></span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {[
          { n: 1, t: 'Метод Фогеля для розв\'язання транспортної задачі використовує:', topic: 'transport', opts: ['Градієнти', 'Потенціали', 'Похідні', 'Штрафні вартості'], r: 3, acc: 44 },
          { n: 2, t: 'Ефективність методу Ньютона значною мірою залежить від:', topic: 'unidim+multidim', opts: ['Випадкового вибору точки', 'Симплекса', 'Умов збіжності', 'Матриці Гессе'], r: 3, acc: 67 },
          { n: 3, t: 'Якщо пряма задача максимізації, то двоїста задача є:', topic: 'duality', opts: ['Максимізації', 'Мінімізації', 'Необмежена', 'Несумісна'], r: 1, acc: 38 },
        ].map((q, i) => (
          <div key={i} style={{ padding: '16px 32px', borderBottom: `1px solid ${D3.border}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: D3.textMute }}>q[{q.n}]</span>
              <span style={{ fontSize: 10, padding: '1px 6px', border: `1px solid ${D3.border}`, color: D3.lime }}>{q.topic}</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10, color: q.acc < 50 ? D3.amber : D3.textMute }}>acc {q.acc}%</span>
            </div>
            <div style={{ fontFamily: D3.sans, fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{q.t}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {q.opts.map((o, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '5px 10px', border: `1px solid ${j === q.r ? D3.lime : D3.border}`, background: j === q.r ? D3.limeDim : 'transparent', fontFamily: D3.sans, fontSize: 12, color: j === q.r ? D3.text : D3.textDim }}>
                  <span style={{ fontFamily: D3.mono, fontSize: 10, color: j === q.r ? D3.lime : D3.textMute }}>[{['a','b','c','d'][j]}]</span>
                  <span style={{ flex: 1 }}>{o}</span>
                  {j === q.r && <span style={{ fontFamily: D3.mono, fontSize: 10, color: D3.lime }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 7. ADMIN
const D3Admin = () => (
  <div style={{ width: '100%', height: '100%', background: D3.bg, color: D3.text, fontFamily: D3.mono, display: 'flex', flexDirection: 'column' }}>
    <D3Bar path="~/oistudy/admin --questions" />
    <D3Nav />
    <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '180px 1fr 380px' }}>
      <div style={{ padding: '24px 16px', borderRight: `1px solid ${D3.border}` }}>
        <div style={{ fontSize: 11, color: D3.textMute, letterSpacing: '0.1em', marginBottom: 10 }}>ADMIN</div>
        {[
          { l: 'questions', n: 520, a: true },
          { l: 'topics', n: 9 },
          { l: 'subjects', n: 3 },
          { l: 'import', n: null },
          { l: 'qa.queue', n: 4 },
          { l: 'users', n: 142 },
          { l: 'analytics', n: null },
        ].map((it, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', fontSize: 12, color: it.a ? D3.lime : D3.textDim, background: it.a ? D3.limeDim : 'transparent', border: `1px solid ${it.a ? D3.lime : 'transparent'}`, marginBottom: 1 }}>
            <span><span style={{ color: D3.textMute }}>$</span> {it.l}</span>
            {it.n !== null && <span style={{ color: D3.textMute, fontSize: 11 }}>{it.n}</span>}
          </div>
        ))}
      </div>

      <div style={{ padding: '24px 28px', borderRight: `1px solid ${D3.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: D3.display, fontSize: 26, letterSpacing: '-0.03em', fontWeight: 500 }}>questions.json</span>
          <span style={{ fontSize: 11, color: D3.textDim }}>// 520 items · 4 drafts · 1 review</span>
          <div style={{ flex: 1 }} />
          <button style={{ padding: '6px 12px', background: D3.lime, color: D3.bg, border: 'none', fontFamily: D3.mono, fontSize: 11, fontWeight: 600 }}>+ new [N]</button>
        </div>

        <div style={{ border: `1px solid ${D3.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 80px 1fr 70px 80px', gap: 10, padding: '8px 12px', borderBottom: `1px solid ${D3.border}`, background: D3.surface, fontSize: 10, color: D3.textMute, letterSpacing: '0.08em' }}>
            <span>ID</span><span>TOPIC</span><span>TEXT</span><span>ACC</span><span>STATUS</span>
          </div>
          {[
            { n: 142, topic: 'transport', t: 'Метод Фогеля для розв\'язання...', acc: 44, s: 'published' },
            { n: 143, topic: 'duality', t: 'Двоїста задача мінімізації...', acc: 51, s: 'published' },
            { n: 144, topic: 'multidim', t: 'У методі Ньютона матриця Гессе...', acc: null, s: 'draft', d: true },
            { n: 145, topic: 'discrete', t: 'Алгоритм Дейкстри застосовується для...', acc: 78, s: 'published' },
            { n: 146, topic: 'gametheory', t: 'У теорії ігор сідлова точка існує коли...', acc: null, s: 'review', r: true },
            { n: 147, topic: 'lp.simplex', t: 'Виродженість базисного розв\'язку...', acc: 62, s: 'published' },
          ].map((q, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 80px 1fr 70px 80px', gap: 10, padding: '10px 12px', borderBottom: i < 5 ? `1px solid ${D3.border}` : 'none', alignItems: 'center', fontSize: 12, background: q.d ? 'rgba(250,204,21,0.04)' : 'transparent' }}>
              <span style={{ color: D3.textMute }}>#{q.n}</span>
              <span style={{ color: D3.lime, fontSize: 11 }}>{q.topic}</span>
              <span style={{ fontFamily: D3.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.t}</span>
              <span style={{ color: q.acc === null ? D3.textMute : q.acc < 50 ? D3.amber : D3.textDim }}>{q.acc === null ? '—' : q.acc + '%'}</span>
              <span style={{ fontSize: 10, padding: '2px 6px', border: `1px solid ${q.d ? D3.amber : q.r ? D3.cyan : D3.border}`, color: q.d ? D3.amber : q.r ? D3.cyan : D3.textDim, letterSpacing: '0.06em', width: 'fit-content' }}>{q.s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 24px', background: D3.surface, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: D3.lime, letterSpacing: '0.1em' }}>EDIT · #144</span>
          <span style={{ fontSize: 10, color: D3.amber }}>● unsaved</span>
        </div>

        <div style={{ fontSize: 10, color: D3.textMute, marginBottom: 4, letterSpacing: '0.08em' }}>QUESTION</div>
        <div style={{ padding: 12, background: D3.bg, border: `1px solid ${D3.border}`, fontFamily: D3.sans, fontSize: 13, lineHeight: 1.4 }}>
          У методі Ньютона матриця Гессе повинна бути:<span style={{ color: D3.lime }}>|</span>
        </div>

        <div style={{ fontSize: 10, color: D3.textMute, marginTop: 16, marginBottom: 4, letterSpacing: '0.08em' }}>OPTIONS · CORRECT_MARKED</div>
        {[
          { o: 'Додатньо визначеною', c: true },
          { o: 'Симетричною', c: false },
          { o: 'Невиродженою', c: false },
          { o: 'Виродженою', c: false },
        ].map((opt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: D3.bg, border: `1px solid ${opt.c ? D3.lime : D3.border}`, marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: opt.c ? D3.lime : D3.textMute, padding: '1px 5px', border: `1px solid ${opt.c ? D3.lime : D3.border}` }}>{['a','b','c','d'][i]}</span>
            <span style={{ fontFamily: D3.sans, fontSize: 12, flex: 1 }}>{opt.o}</span>
            {opt.c && <span style={{ fontSize: 10, color: D3.lime }}>{'=>'} true</span>}
          </div>
        ))}

        <div style={{ fontSize: 10, color: D3.textMute, marginTop: 16, marginBottom: 4, letterSpacing: '0.08em' }}>TOPIC · EXPLAIN.md</div>
        <div style={{ padding: '6px 10px', background: D3.bg, border: `1px solid ${D3.border}`, fontSize: 11, color: D3.lime, marginBottom: 6 }}>multidim</div>
        <div style={{ padding: 12, background: D3.bg, border: `1px solid ${D3.border}`, fontFamily: D3.mono, fontSize: 11, color: D3.textDim, lineHeight: 1.55 }}>
          Метод Ньютона збігається до локального мінімуму лише коли матриця Гессе **додатньо визначена** в околі точки...
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
          <button style={{ flex: 1, padding: '10px', background: D3.lime, color: D3.bg, border: 'none', fontFamily: D3.mono, fontWeight: 600, fontSize: 12 }}>$ publish [⌘↵]</button>
          <button style={{ padding: '10px 14px', background: 'transparent', border: `1px solid ${D3.border}`, color: D3.textDim, fontFamily: D3.mono, fontSize: 11 }}>save</button>
        </div>
      </div>
    </div>
  </div>
);

window.D3Screens = { D3Home, D3Subject, D3Builder, D3Take, D3Results, D3Catalog, D3Admin };

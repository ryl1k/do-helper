// Main canvas — Метод direction (selected) with full coverage, alternatives archived

const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;

const DESKTOP_W = 1180;
const DESKTOP_H = 740;
const MOBILE_W = 380;
const MOBILE_H = 780;
const TALL = 820;

const App = () => {
  const d1 = window.D1Screens;
  const d2 = window.D2Screens;
  const d3 = window.D3Screens;
  const flow = window.D1Flow;
  const adm = window.D1AdminScreens;
  const st = window.D1States;
  const mob = window.D1Mobile;

  return (
    <DesignCanvas title="oistudy · редизайн · Метод" subtitle="Обраний напрям — Метод (navy + cyan). Повне покриття: флоу, адмін, стани, мобільні, edge cases. Альтернативні напрямки в архіві внизу.">
      <DCPostIt x={40} y={40} width={300}>
        Метод обрано! Сюди вкладено весь спек з 25 пунктів.{'\n\n'}
        Розділено на секції: основний флоу → адмін → стани → мобільні → edge.{'\n\n'}
        Клацай по будь-якому артборду — він розгорнеться. Стрілки ←/→ перемикають артборди в межах секції.
      </DCPostIt>

      {/* ── Original 7 — the core flow ── */}
      <DCSection id="metod-core" title="Метод · основний флоу" subtitle="Базовий пайплайн з першої ітерації. Все на десктопі крім test-taking (мобільний).">
        <DCArtboard id="m-home" label="01 · Home / hub" width={DESKTOP_W} height={DESKTOP_H}><d1.D1Home /></DCArtboard>
        <DCArtboard id="m-subject" label="02 · Subject overview" width={DESKTOP_W} height={DESKTOP_H}><d1.D1Subject /></DCArtboard>
        <DCArtboard id="m-builder" label="03 · Test builder" width={DESKTOP_W} height={DESKTOP_H}><d1.D1Builder /></DCArtboard>
        <DCArtboard id="m-take-m" label="04 · Test · mobile" width={MOBILE_W} height={MOBILE_H}><d1.D1Take /></DCArtboard>
        <DCArtboard id="m-results" label="05 · Results" width={DESKTOP_W} height={DESKTOP_H}><d1.D1Results /></DCArtboard>
        <DCArtboard id="m-catalog" label="06 · Catalog" width={DESKTOP_W} height={DESKTOP_H}><d1.D1Catalog /></DCArtboard>
        <DCArtboard id="m-admin-q" label="07 · Admin · Questions" width={DESKTOP_W} height={DESKTOP_H}><d1.D1Admin /></DCArtboard>
      </DCSection>

      {/* ── A · Core flow expansion ── */}
      <DCSection id="metod-A" title="A · Розширення основного флоу" subtitle="6 екранів які бракували: повний test-таун на десктопі, multi-correct, no-answer варіант, профіль, логін, Q/A.">
        <DCArtboard id="A1-take-desktop" label="A1 · Test playing · desktop" width={DESKTOP_W} height={DESKTOP_H}><flow.D1TakeDesktop /></DCArtboard>
        <DCArtboard id="A2-take-multi" label="A2 · Multi-correct · mobile" width={MOBILE_W} height={MOBILE_H}><flow.D1TakeMulti /></DCArtboard>
        <DCArtboard id="A3-take-noans" label="A3 · No-answer · mobile" width={MOBILE_W} height={MOBILE_H}><flow.D1TakeNoAnswer /></DCArtboard>
        <DCArtboard id="A4-profile" label="A4 · Profile / account" width={DESKTOP_W} height={DESKTOP_H}><flow.D1Profile /></DCArtboard>
        <DCArtboard id="A5-login" label="A5 · Login" width={680} height={DESKTOP_H}><flow.D1Login /></DCArtboard>
        <DCArtboard id="A6-qa" label="A6 · Q/A · FAQ" width={DESKTOP_W} height={DESKTOP_H}><flow.D1QA /></DCArtboard>
      </DCSection>

      {/* ── B · Admin extras ── */}
      <DCSection id="metod-B" title="B · Адмінка (фаза 2)" subtitle="Окрім редактору питань (#07) — предмети, теми (drag-to-reorder), AI-імпорт з токенами та вартістю, модерація Q/A, студенти, аналітика.">
        <DCArtboard id="B1-subjects" label="B1 · Subjects" width={DESKTOP_W} height={DESKTOP_H}><adm.D1AdminSubjects /></DCArtboard>
        <DCArtboard id="B2-topics" label="B2 · Topics (per subject)" width={DESKTOP_W} height={DESKTOP_H}><adm.D1AdminTopics /></DCArtboard>
        <DCArtboard id="B3-import" label="B3 · AI Import" width={DESKTOP_W} height={DESKTOP_H}><adm.D1AdminImport /></DCArtboard>
        <DCArtboard id="B4-mod" label="B4 · Q/A moderation" width={DESKTOP_W} height={DESKTOP_H}><adm.D1AdminMod /></DCArtboard>
        <DCArtboard id="B5-users" label="B5 · Students" width={DESKTOP_W} height={DESKTOP_H}><adm.D1AdminUsers /></DCArtboard>
        <DCArtboard id="B6-analytics" label="B6 · Analytics" width={DESKTOP_W} height={DESKTOP_H}><adm.D1AdminAnalytics /></DCArtboard>
      </DCSection>

      {/* ── C · States / patterns ── */}
      <DCSection id="metod-C" title="C · Стани та патерни" subtitle="Завантаження, порожні стани, помилки, модалки, тости — це шаблони які треба застосовувати скрізь.">
        <DCArtboard id="C1-skel" label="C1 · Skeleton loading" width={DESKTOP_W} height={DESKTOP_H}><st.D1Skeleton /></DCArtboard>
        <DCArtboard id="C2-empty" label="C2 · Empty states (6)" width={1280} height={TALL}><st.D1Empty /></DCArtboard>
        <DCArtboard id="C3-error" label="C3 · 404 / error" width={DESKTOP_W} height={DESKTOP_H}><st.D1Error /></DCArtboard>
        <DCArtboard id="C4-modals" label="C4 · Modals · 3 dialogs" width={1280} height={DESKTOP_H}><st.D1Modals /></DCArtboard>
        <DCArtboard id="C5-toasts" label="C5 · Toasts · save indicators" width={DESKTOP_W} height={DESKTOP_H}><st.D1Toasts /></DCArtboard>
      </DCSection>

      {/* ── D · Mobile ── */}
      <DCSection id="metod-D" title="D · Мобільні варіанти" subtitle="Home, Subject, Catalog, Results на телефоні; адмінка показує «потрібен великий екран».">
        <DCArtboard id="D1-home-m" label="D1 · Home" width={MOBILE_W} height={MOBILE_H}><mob.D1HomeMobile /></DCArtboard>
        <DCArtboard id="D2-subject-m" label="D2 · Subject" width={MOBILE_W} height={MOBILE_H}><mob.D1SubjectMobile /></DCArtboard>
        <DCArtboard id="D3-catalog-m" label="D3 · Catalog" width={MOBILE_W} height={MOBILE_H}><mob.D1CatalogMobile /></DCArtboard>
        <DCArtboard id="D4-results-m" label="D4 · Results" width={MOBILE_W} height={MOBILE_H}><mob.D1ResultsMobile /></DCArtboard>
        <DCArtboard id="D5-admin-m" label="D5 · Admin (no go)" width={MOBILE_W} height={MOBILE_H}><mob.D1AdminMobile /></DCArtboard>
      </DCSection>

      {/* ── E · Edge cases ── */}
      <DCSection id="metod-E" title="E · Edge cases" subtitle="Перший візит без імені, гість без входу (банер + CTA), тест з 0 доступних питань (disabled старт).">
        <DCArtboard id="E1-noname" label="E1 · First visit · no name" width={DESKTOP_W} height={DESKTOP_H}><st.D1EdgeNoName /></DCArtboard>
        <DCArtboard id="E2-signedout" label="E2 · Signed-out · save CTA" width={DESKTOP_W} height={DESKTOP_H}><st.D1EdgeSignedOut /></DCArtboard>
        <DCArtboard id="E3-zero" label="E3 · 0 eligible questions" width={DESKTOP_W} height={DESKTOP_H}><st.D1EdgeZeroQuestions /></DCArtboard>
      </DCSection>

      <DCSection id="next" title="Що далі" subtitle="">
        <DCPostIt x={0} y={0} width={320}>
          ✓ Усі 25 пунктів зі списку покрито{'\n\n'}
          Я не малював:{'\n'}
          • student detail panel (B5 deep-dive) — додамо коли візьмемось будувати{'\n'}
          • toast queue patterns (3 одночасно достатньо){'\n\n'}
          Запропоную: спершу збудуй A1 (test desktop), A4 (профіль), і всі C — це шаблони які з тобою житимуть скрізь.
        </DCPostIt>
      </DCSection>

      {/* ── Archive ── */}
      <DCSection id="archive" title="Архів · альтернативні напрямки" subtitle="На випадок якщо передумаєш. Я б не вертався — Метод відчувається правильним для exam-prep.">
        <DCArtboard id="alt-konsp-home" label="Конспект (editorial) · home" width={DESKTOP_W} height={DESKTOP_H}><d2.D2Home /></DCArtboard>
        <DCArtboard id="alt-konsp-take" label="Конспект · take" width={MOBILE_W} height={MOBILE_H}><d2.D2Take /></DCArtboard>
        <DCArtboard id="alt-konsol-home" label="Консоль (mono) · home" width={DESKTOP_W} height={DESKTOP_H}><d3.D3Home /></DCArtboard>
        <DCArtboard id="alt-konsol-take" label="Консоль · take" width={MOBILE_W} height={MOBILE_H}><d3.D3Take /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

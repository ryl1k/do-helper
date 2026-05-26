-- Multi-subject migration. Additive and idempotent — safe to re-run.
-- Run this BEFORE deploying the multi-subject app code.
--
-- After running:
--   * "Дослідження операцій" exists as subject slug 'do'
--   * Its 9 topics are populated (with the same hints + color tokens we had in code)
--   * Every existing question row gets subject_id = 'do'
--   * questions.categories[] still exists; we keep it in sync with subject_topics for now.

-- ---------- subjects -------------------------------------------------------
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,         -- short url-safe: 'do', 'webapps'
  name_uk     text not null,
  name_en     text not null,
  description text,
  accent_color text not null default 'blue', -- 'blue'|'rose'|'emerald'|'amber'|'violet'|'cyan'|'orange'
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Safe re-run after the initial schema: add accent_color if the column wasn't there.
alter table public.subjects add column if not exists accent_color text not null default 'blue';

create index if not exists idx_subjects_slug on public.subjects (slug);

-- ---------- subject_topics -------------------------------------------------
create table if not exists public.subject_topics (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references public.subjects(id) on delete cascade,
  slug         text not null,               -- stable id within the subject
  name         text not null,               -- displayed long form
  short_name   text,                        -- pill / tight label
  hint         text,                        -- English hint sent to the LLM
  color_token  text not null default 'slate', -- 'slate' | 'blue' | 'indigo' | …
  sort_order   int  not null default 0,
  created_at   timestamptz not null default now(),
  unique (subject_id, slug)
);

create index if not exists idx_subject_topics_subject on public.subject_topics(subject_id);

-- ---------- questions.subject_id ------------------------------------------
alter table public.questions add column if not exists subject_id uuid references public.subjects(id) on delete cascade;
create index if not exists idx_questions_subject on public.questions(subject_id);

-- The original schema had a global unique on (number). After multi-subject the
-- same number can exist across subjects, so swap to a composite unique.
do $$
declare
  cname text;
begin
  -- Drop any single-column unique on questions.number (name varies by Supabase
  -- project; we look it up rather than guessing).
  select c.conname into cname
  from pg_constraint c
  join pg_class r on r.oid = c.conrelid
  join pg_namespace ns on ns.oid = r.relnamespace
  where ns.nspname = 'public'
    and r.relname  = 'questions'
    and c.contype  = 'u'
    and (select array_agg(attname order by attnum)
         from pg_attribute a where a.attrelid = c.conrelid and a.attnum = any(c.conkey)) = array['number']::name[];
  if cname is not null then
    execute format('alter table public.questions drop constraint %I', cname);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'questions_subject_id_number_key'
      and conrelid = 'public.questions'::regclass
  ) then
    alter table public.questions
      add constraint questions_subject_id_number_key unique (subject_id, number);
  end if;
end $$;

-- ---------- seed the 'do' subject + its 9 topics ---------------------------
insert into public.subjects (slug, name_uk, name_en, description, accent_color, sort_order)
values
  ('do', 'Дослідження операцій', 'Operations Research',
   'Підготовка до іспиту з ДО: 520 питань, 9 тем, з пояснення на кожен варіант.',
   'blue', 0)
on conflict (slug) do nothing;

-- Idempotent topic insert: use the natural key (subject_id, slug).
with s as (select id from public.subjects where slug = 'do')
insert into public.subject_topics (subject_id, slug, name, short_name, hint, color_token, sort_order)
select
  s.id, t.slug, t.name, t.short_name, t.hint, t.color_token, t.sort_order
from s,
(values
  ('general',       'Загальні питання ДО',                                                                 'Загальні питання', 'general operations-research questions: problem formulation, classifications, modelling, solution stages, criteria, terminology', 'slate',   1),
  ('lp_simplex',    'Лінійне програмування і симплекс-метод',                                              'ЛП · симплекс',    'linear programming, canonical/standard form, simplex method, basic feasible solutions, pivoting', 'blue',    2),
  ('lp_duality',    'Двоїстість у ЛП',                                                                     'Двоїстість',       'LP duality, primal-dual relationships, complementary slackness, dual variables, dual problem construction', 'indigo',  3),
  ('transport',     'Транспортна задача',                                                                  'Транспортна',      'transportation problem, north-west corner, minimum cost, Vogel approximation, potentials (MODI) method, Hungarian/assignment, balanced/unbalanced supply-demand', 'emerald', 4),
  ('discrete_lp',   'Дискретне ЛП',                                                                        'Дискретне ЛП',     'integer/discrete linear programming, branch and bound, cutting planes, Gomory, knapsack, 0/1 variables', 'teal',    5),
  ('nonlinear',     'Нелінійне програмування (методи, теореми, умови)',                                    'Нелінійне',        'nonlinear programming, Kuhn-Tucker, Lagrange, convexity, concavity, optimality conditions for NLP, penalty methods', 'amber',   6),
  ('unidim_opt',    'Одновимірна оптимізація (три групи методів)',                                          'Одновимірна',      'single-variable optimization: golden section, dichotomy, Fibonacci, Newton, Newton-Raphson, Sven, Powell, parabolic interpolation, mid-point, interval-elimination methods', 'violet',  7),
  ('multidim_opt',  'Багатовимірна оптимізація (методи прямого пошуку, градієнтні, квазіньютонівські)',     'Багатовимірна',    'multivariable optimization: Hooke-Jeeves, Nelder-Mead (simplex), steepest descent, conjugate gradients, BFGS, DFP, quasi-Newton', 'fuchsia', 8),
  ('games',         'Ігрові методи у ДО (класифікація ігор, стратегії, критерії)',                          'Ігрові методи',    'game theory: matrix games, pure/mixed strategies, saddle point, minimax, maximin, Wald/Hurwicz/Savage criteria, payoff matrix, dominance', 'rose',    9)
) as t(slug, name, short_name, hint, color_token, sort_order)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  hint = excluded.hint,
  color_token = excluded.color_token,
  sort_order = excluded.sort_order;

-- ---------- backfill existing questions ------------------------------------
update public.questions
set subject_id = (select id from public.subjects where slug = 'do')
where subject_id is null;

-- Final guard: every question now belongs to a subject.
alter table public.questions
  alter column subject_id set not null;

-- ---------- remap categories[] from long names -> slugs (idempotent) ------
-- After this, questions.categories[] holds topic slugs (per-subject).
update public.questions q
set categories = array(
  select coalesce(
    -- if already a slug for this subject, keep it
    (select c where exists (
      select 1 from public.subject_topics t
       where t.subject_id = q.subject_id and t.slug = c
    )),
    -- otherwise map by full name
    (select t.slug from public.subject_topics t
       where t.subject_id = q.subject_id and t.name = c
       limit 1),
    -- fallback: keep original (don't lose any pre-existing label)
    c
  )
  from unnest(q.categories) as c
)
where q.subject_id is not null
  and coalesce(array_length(q.categories, 1), 0) > 0;

-- ---------- admin flag on profiles ----------------------------------------
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- ---------- views update --------------------------------------------------
-- Drop-and-recreate (not "or replace") because we're reshaping the column list
-- to include subject_id — Postgres won't let "or replace" change column order/names.
drop view if exists public.question_stats;
create view public.question_stats as
select
  q.subject_id,
  a.question_id,
  count(*)::int as total,
  sum(case when a.correct then 1 else 0 end)::int as correct
from public.attempts a
join public.questions q on q.id = a.question_id
group by q.subject_id, a.question_id;

drop view if exists public.user_leaderboard;
create view public.user_leaderboard as
select
  q.subject_id,
  p.id,
  coalesce(nullif(p.display_name, ''), 'Anon') as display_name,
  count(a.*)::int as total,
  sum(case when a.correct then 1 else 0 end)::int as correct
from public.profiles p
join public.attempts a on a.user_id = p.id
join public.questions q on q.id = a.question_id
group by q.subject_id, p.id, p.display_name;

grant select on public.question_stats to anon, authenticated;
grant select on public.user_leaderboard to anon, authenticated;

-- ---------- RLS on subjects + subject_topics ------------------------------
-- Reads: open to anyone (anon + authenticated). The /api routes use the
--   service role key which bypasses RLS anyway, but enabling SELECT lets the
--   future admin panel read directly from the browser too.
-- Writes: only profiles.is_admin = true. Service-role server code still
--   bypasses this; only browser-side calls from logged-in users are checked.

alter table public.subjects enable row level security;
drop policy if exists "subjects readable"   on public.subjects;
drop policy if exists "subjects admin write" on public.subjects;
create policy "subjects readable"   on public.subjects for select using (true);
create policy "subjects admin write" on public.subjects for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

alter table public.subject_topics enable row level security;
drop policy if exists "subject_topics readable"   on public.subject_topics;
drop policy if exists "subject_topics admin write" on public.subject_topics;
create policy "subject_topics readable"   on public.subject_topics for select using (true);
create policy "subject_topics admin write" on public.subject_topics for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Questions table also needs RLS so admins can edit/insert/delete questions
-- from the browser in Phase 2. Reads remain open.
alter table public.questions enable row level security;
drop policy if exists "questions readable"    on public.questions;
drop policy if exists "questions admin write" on public.questions;
create policy "questions readable"    on public.questions for select using (true);
create policy "questions admin write" on public.questions for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

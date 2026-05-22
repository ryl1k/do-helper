-- do-helper schema (quiz-tool shape).
-- Source of truth = the parsed test bank (examples/parsed_tests.txt, 520 questions
-- with correct answers already marked). Questions are seeded via scripts/seed.mjs.
--
-- WARNING: re-running drops the old upload/voting tables and any data they held.

drop table if exists public.answer_votes cascade;
drop table if exists public.images cascade;
drop table if exists public.usage_daily cascade;
drop function if exists public.add_usage(int, int, numeric);
drop table if exists public.questions cascade;

create extension if not exists pgcrypto;

create table public.questions (
  id              uuid primary key default gen_random_uuid(),
  number          int unique not null,           -- "Питання N" from source
  text            text not null,
  options         jsonb not null,                -- array of plain strings
  correct_indices int[] not null,                -- 0-based; multiple for multi-correct Qs
  categories      text[] not null default '{}',  -- 0+ of the 9 topic labels
  language        text not null default 'uk',
  created_at      timestamptz not null default now()
);

create index idx_questions_number on public.questions (number);
create index idx_questions_categories on public.questions using gin (categories);

-- =========================================================================
-- Profiles, attempts, and aggregate views (auth + stats collection).
-- Additive: re-runnable, does NOT touch the questions table data.
-- =========================================================================

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale       text not null default 'uk',
  created_at   timestamptz not null default now()
);

create table if not exists public.attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  anon_id      text,                                                 -- for unauthenticated users
  question_id  uuid not null references public.questions(id) on delete cascade,
  chosen       int[] not null,
  correct      boolean not null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_attempts_user on public.attempts(user_id);
create index if not exists idx_attempts_question on public.attempts(question_id);
create index if not exists idx_attempts_anon on public.attempts(anon_id);

-- Aggregate views, safe to expose publicly (no per-row PII).
create or replace view public.question_stats as
select
  question_id,
  count(*)::int as total,
  sum(case when correct then 1 else 0 end)::int as correct
from public.attempts
group by question_id;

create or replace view public.user_leaderboard as
select
  p.id,
  coalesce(nullif(p.display_name, ''), 'Anon') as display_name,
  count(a.*)::int as total,
  sum(case when a.correct then 1 else 0 end)::int as correct
from public.profiles p
join public.attempts a on a.user_id = p.id
group by p.id, p.display_name;

-- Row-level security
alter table public.profiles enable row level security;
drop policy if exists "profiles readable" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);

alter table public.attempts enable row level security;
drop policy if exists "anyone insert attempts" on public.attempts;
drop policy if exists "users read own attempts" on public.attempts;
create policy "anyone insert attempts" on public.attempts for insert with check (true);
create policy "users read own attempts" on public.attempts for select using (auth.uid() = user_id);

-- Allow aggregated views to be read without auth.
grant select on public.question_stats to anon, authenticated;
grant select on public.user_leaderboard to anon, authenticated;

-- Auto-create a profile row whenever a new auth.user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(coalesce(new.email, 'user'), '@', 1))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

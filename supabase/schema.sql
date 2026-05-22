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

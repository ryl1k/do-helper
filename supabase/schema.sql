-- do-helper schema. Run this once in your Supabase SQL editor.
-- Also create a Storage bucket named "questions" (private).

create extension if not exists pgcrypto;

-- Questions = canonical, deduped extracted content.
create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  text          text not null,
  options       jsonb not null,          -- ["...","...","...","..."]
  language      text default 'uk',
  text_hash     text not null unique,    -- sha256 of normalized text+options
  first_image_id uuid,
  created_at    timestamptz default now()
);

-- Images = every uploaded file. Linked to a question if extraction succeeded.
create table if not exists public.images (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null,           -- path in the "questions" bucket
  byte_sha256   text not null,           -- exact-dup detector
  dhash         text not null,           -- 16-hex-char perceptual hash, near-dup
  status        text not null default 'pending', -- pending | extracted | duplicate | failed | not_question
  question_id   uuid references public.questions(id) on delete set null,
  error         text,
  uploaded_by   text,                    -- api key label (e.g. "key_alice")
  tokens_in     int,
  tokens_out    int,
  cost_usd      numeric(10,6),
  created_at    timestamptz default now()
);

create index if not exists idx_images_sha on public.images(byte_sha256);
create index if not exists idx_images_dhash on public.images(dhash);
create index if not exists idx_images_status on public.images(status);
create index if not exists idx_questions_text_hash on public.questions(text_hash);

-- Daily usage tracking for budget cap.
create table if not exists public.usage_daily (
  day           date primary key,
  tokens_in     bigint not null default 0,
  tokens_out    bigint not null default 0,
  cost_usd      numeric(10,6) not null default 0,
  calls         int not null default 0
);

-- Helper: atomically add usage and return new total cost.
create or replace function public.add_usage(p_in int, p_out int, p_cost numeric)
returns numeric language plpgsql as $$
declare new_cost numeric;
begin
  insert into public.usage_daily(day, tokens_in, tokens_out, cost_usd, calls)
  values (current_date, p_in, p_out, p_cost, 1)
  on conflict (day) do update set
    tokens_in = public.usage_daily.tokens_in + excluded.tokens_in,
    tokens_out = public.usage_daily.tokens_out + excluded.tokens_out,
    cost_usd  = public.usage_daily.cost_usd  + excluded.cost_usd,
    calls     = public.usage_daily.calls     + 1
  returning cost_usd into new_cost;
  return new_cost;
end $$;

-- One vote per (question, api-key label). Voters can change their pick (upsert on primary key).
create table if not exists public.answer_votes (
  question_id   uuid not null references public.questions(id) on delete cascade,
  voter         text not null,
  chosen_index  int not null check (chosen_index >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (question_id, voter)
);

create index if not exists idx_votes_question on public.answer_votes(question_id);

-- Topic category, set by the extraction LLM. One of: Постановка / Ігрові задачі /
-- Одновимірна оптимізація / Транспортна / Інше (or null on legacy rows).
alter table public.questions add column if not exists category text;
create index if not exists idx_questions_category on public.questions(category);

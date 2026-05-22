# do-helper

Study & quiz tool for the **Дослідження операцій** (Operations Research) exam — 520 questions across 9 topics, with the correct answers marked.

Live data is seeded from a community-sourced bank (Crowdly + VNS); see [`/faq`](app/faq/page.tsx) inside the app for the full disclaimer.

## Features

- **Quiz mode** — pick any subset of the 9 topics, choose how many questions (or type any custom count), answer at your own pace. Multi-correct questions are supported. End screen shows your score, weakest topics, and a wrong-answer review.
- **Catalog / Search** — full searchable list with infinite scroll, topic filters, per-card show/hide-answer toggle.
- **Profile** — local quiz history with per-topic accuracy bars and expandable per-quiz review (Show all / Wrong only) including the correct answer and the user's pick.
- **Auth** — optional. Magic-link email + Google OAuth via Supabase. Stats stay on-device when signed out; when signed in, attempts are written to a server table that feeds a hidden leaderboard.
- **i18n** — Ukrainian (default) + English, toggle in navbar. Persists across sessions.
- **Light/dark themes** — blue accent in both. Toggle in navbar. Auto-detects system preference on first visit.

## Stack

- **Next.js 16** (App Router, Turbopack) · **TypeScript** · **Tailwind v3** (class-based dark mode)
- **Supabase** — Postgres for `questions`/`profiles`/`attempts`, RLS, magic-link + Google OAuth
- **Groq** — `llama-3.3-70b-versatile` used **once** at seed time to classify each question into one of 9 topics
- Inter font (Cyrillic subset), inline SVG icons (no icon library)

## Setup

### 1. Supabase

- Create a project at https://supabase.com (free tier is fine)
- Open **SQL Editor**, paste `supabase/schema.sql`, run it. Re-runnable; everything is `if not exists` or `drop ... cascade` so re-applying is safe
- **Authentication → Providers → Email**: keep on (powers magic links)
- **Authentication → Providers → Google**: enable and paste a Google OAuth client ID/secret (see [Google OAuth](#google-oauth-optional) below)
- **Authentication → URL Configuration**: add `http://localhost:3000` and your prod URL to **Redirect URLs**

### 2. Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                # anon public key — safe in the browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...                    # server-only, used by seed script
GROQ_API_KEY=gsk_...                                # only needed for seeding (one-time)
GROQ_MODEL=llama-3.3-70b-versatile
SEED_BATCH=10
```

### 3. Seed the question bank (one-time)

```bash
npm install
npm run parse                   # parses examples/parsed_tests.txt -> examples/parsed_tests.json
npm run seed                    # upserts questions to Supabase + categorizes via Groq
```

`npm run seed` is resumable — it skips questions that already have categories. Use `npm run seed:upsert` to skip Groq if you only want to refresh the question text/options.

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

```bash
vercel deploy
```

Set the same env vars in **Project Settings → Environment Variables**. After the first deploy, add your production URL to Supabase **Auth → URL Configuration → Redirect URLs**.

## Google OAuth (optional)

1. Google Cloud Console → APIs & Services → Credentials → **Create OAuth client ID** → *Web application*
2. **Authorized redirect URI**: copy from Supabase Google provider settings (looks like `https://YOUR_PROJECT.supabase.co/auth/v1/callback`)
3. Paste the client ID + secret back into Supabase **Auth → Providers → Google** and save

That's it — the existing login page picks it up automatically.

## Routes

| Path | What it does |
|---|---|
| `/` | Landing — topic counts, two big CTAs (Quiz / Catalog), sign-in nudge for guests |
| `/quiz` | Setup → playing → done. Custom question count. Writes attempts on completion. |
| `/search` | Full catalog with infinite scroll, search, topic filters, per-card answer reveal |
| `/profile` | Local stats + expandable history with full per-question review |
| `/login` | Magic-link form + Google OAuth |
| `/faq` | Where the data comes from, how to contribute, how to report issues |
| `/leaderboard` | Hidden (not linked from navbar). Reads `user_leaderboard` view. |

## Architecture notes

- `lib/categories.ts` — single source of truth for the 9 topics + colors. Tailwind scans `lib/**/*.{ts,tsx}` so dynamic class strings here are picked up.
- `lib/i18n.tsx` — React Context provider; locale toggle re-renders all consumers instantly.
- `lib/auth.ts` + `lib/supabase-client.ts` — browser-side Supabase client with anon key. RLS does authorization. Service-role key is only used by the seed script.
- `lib/stats.ts` — localStorage-backed quiz history. Independent from the server `attempts` table.
- `scripts/parse-tests.mjs` — parses `examples/parsed_tests.txt`. Handles 4–7 option questions, multi-correct (multiple `100%`), and weighted-percentage questions (picks the max-percentage option(s) as correct).
- `scripts/seed.mjs` — bulk upsert + Groq categorization with retry/back-off on 429.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

No license file yet — treat as "all rights reserved" until one is added.

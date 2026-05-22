# Contributing

Thanks for wanting to help. This is a small student project; PRs are welcome.

## Quick links

- Bugs / feature requests: https://github.com/ryl1k/do-helper/issues
- Telegram: @ryl1k

## Dev setup

Same as [README.md → Setup](README.md#setup). The short version:

```bash
git clone https://github.com/ryl1k/do-helper.git
cd do-helper
npm install
cp .env.example .env.local       # fill in your Supabase + Groq keys
npm run dev
```

You don't need to seed the database to work on UI — point your `.env.local` at any Supabase project that already has the schema and some seeded questions. If you want a fresh seed:

```bash
npm run parse                    # txt -> json
npm run seed                     # upsert + categorize via Groq
```

Before pushing a PR:

```bash
npm run typecheck
npm run build
```

Both must pass.

## Branching & commits

- Branch off `master` (or `main` if renamed): `feat/short-name`, `fix/short-name`, `chore/short-name`
- Keep commit messages tight and present-tense: "add Google OAuth button on login"
- One logical change per commit when reasonable; squash before merge is fine

## Code conventions

- TypeScript strict mode. No `any` unless commented with why.
- React function components only. Hooks for state.
- Tailwind utility classes — no separate CSS files except `app/globals.css`.
- Pages live in `app/<route>/page.tsx`. Shared building blocks in `components/`. Pure logic in `lib/`.
- **Don't construct Tailwind class names dynamically** (e.g. `` `bg-${color}-500` ``). The JIT can't see them and they'll silently disappear. Use full literal class strings or a static map (see `lib/categories.ts`).

## Where to add things

| Goal | Where |
|---|---|
| New UI string | Add a key under both `uk` and `en` in `lib/i18n.tsx`, then `useT()` it |
| New topic / category | Add to `CATEGORIES`, `CATEGORY_HINTS`, `CATEGORY_SHORT`, and `STYLES` in `lib/categories.ts`. Re-seed (`npm run seed --recategorize`) to relabel existing questions |
| New page | New folder under `app/`, add a `page.tsx`. Add it to the navbar (`components/Navbar.tsx`) if it should be linked |
| New API route | New folder under `app/api/`, add `route.ts`. Use `lib/supabase.ts` for server-side service-role queries, never expose the service-role key to the client |
| Schema change | Append to `supabase/schema.sql`, keep it idempotent (`if not exists`, `or replace`). Document RLS implications |

## Tests

There aren't formal tests yet. The bar before merge is:
- `npm run typecheck` passes
- `npm run build` passes
- You manually tried the affected pages in both light and dark themes, in both UK and EN, on mobile width (~375px) and desktop

## Reporting question errors

If a *specific question* has a wrong correct answer or a typo:

1. Open an issue with the question number (visible as `#N` on every card)
2. Quote the question text and what's wrong
3. The fix usually means editing `examples/parsed_tests.txt` and re-running `npm run seed:upsert`

## Security

- Never commit `.env.local` or any file containing real keys. `.gitignore` already covers `.env.local`; the `.env.example` template has placeholders only.
- If you accidentally commit a real Supabase / Groq / Google key, **rotate the key immediately** in the respective dashboard, then force-push a cleanup. Don't rely on commit deletion alone.
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. It's only used by `scripts/seed.mjs` and `lib/supabase.ts` (server contexts). Never import `lib/supabase.ts` from a client component.

## Adding a new auth provider

1. Enable it in Supabase **Authentication → Providers**
2. Add a button to `app/login/page.tsx`
3. Add a helper in `lib/auth.ts` (mirror `signInWithGoogle`)

## i18n

- Default locale is Ukrainian. Add new strings to both `uk` and `en` blocks
- Keep keys descriptive: `quiz.start`, `profile.byTopic`. Avoid generic `label1`
- Use `{n}`, `{c}`, `{total}` placeholders for variables; pass via `t("key", { n: 5 })`
- Categories are exam-source labels — keep them in Ukrainian in both locales

## Releases / deploy

Push to `master` and Vercel will redeploy. No release process beyond that.

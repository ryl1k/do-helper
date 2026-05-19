# do-helper

Upload exam-question screenshots → OpenAI extracts text → dedupes → stores in Postgres.
Quizzes come later.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind · Supabase (Postgres + Storage) · OpenAI gpt-4o-mini · `sharp` for image hashing.

## Pipeline (one upload)
1. API key check (`x-api-key` header).
2. Normalize image to PNG (strips EXIF, deterministic bytes).
3. SHA-256 → exact-duplicate short-circuit.
4. dHash (perceptual) → near-duplicate short-circuit against prior uploads.
5. Daily USD cap check.
6. OpenAI vision call (gpt-4o-mini, JSON mode).
7. Normalize extracted text → SHA-256 of normalized text → content-duplicate short-circuit.
8. Insert `questions` (if new) + `images` row, link to storage.

Cost target: ~$0.0005 per OpenAI call. Most uploads short-circuit before step 6.

## Setup

### 1. Supabase
- Create a project at https://supabase.com (free tier is fine).
- Run `supabase/schema.sql` in the SQL editor.
- Storage → New bucket → name it `questions`, **Private**.
- Copy `Project URL` and `service_role` key into `.env.local`.

### 2. OpenAI
- Get an API key at https://platform.openai.com/api-keys.
- Funded with ≥$5 (project key is fine).

### 3. App
```bash
npm install
cp .env.example .env.local
# fill in values
npm run dev
```
Visit http://localhost:3000.

### 4. API keys for users
Set `APP_API_KEYS` in `.env.local`:
```
APP_API_KEYS=xxxxx, xxxxx
```
Hand each person their key. They paste it into the upload page (it's stored in browser localStorage).

The label (`xxxxx`) goes into `images.uploaded_by` for attribution.

To rotate a key: change the env var, redeploy.

## Deploying to Vercel
```bash
vercel deploy
```
Set the same env vars in Project Settings → Environment Variables. Deploy.

Vercel serverless functions get 60s max on Hobby — enough for one image at a time.

## Endpoints
- `POST /api/upload` — `multipart/form-data` with field `file`. Returns the extracted question or duplicate info.
- `GET /api/questions?limit=200` — returns deduped question list + stats.

Both require `x-api-key`.

## Budget controls
- `DAILY_USD_CAP` in env (default `1.50`): requests get `402` once today's tokens-billed exceeds it.
- Dedup before OpenAI is the main cost saver. With expected ~85% dup rate on 4k uploads, you'll only pay for ~600 calls (~$0.30).

## What's NOT here (intentional)
- No login/registration (API keys only).
- No answers / quiz mode (Phase 2).
- No moderation queue.
- No background jobs (uploads are processed inline; one image per request).

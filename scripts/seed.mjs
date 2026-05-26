// Seed Supabase with parsed questions for a SPECIFIC subject, then categorize via Groq.
//
// Usage (Windows PowerShell):
//   node --env-file=.env.local scripts/seed.mjs --subject do                          # full run: upsert all + categorize
//   node --env-file=.env.local scripts/seed.mjs --subject do --only-upsert            # just upsert, skip Groq
//   node --env-file=.env.local scripts/seed.mjs --subject do --only-categorize        # categorize Qs that have no category
//   node --env-file=.env.local scripts/seed.mjs --subject do --recategorize           # redo every question
//   node --env-file=.env.local scripts/seed.mjs --subject do --src examples/foo.json  # custom source file
//
// The subject MUST already exist in public.subjects (with its topics in subject_topics).
// Resumable: by default skips questions that already have non-empty categories[].

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const args = process.argv.slice(2);
function flag(name) { return args.includes(`--${name}`); }
function opt(name, def) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
}

const SUBJECT = opt("subject");
if (!SUBJECT) {
  console.error("Required: --subject <slug>  (e.g. --subject do)");
  process.exit(2);
}
const ONLY_UPSERT = flag("only-upsert");
const ONLY_CATEGORIZE = flag("only-categorize");
const RECATEGORIZE = flag("recategorize");
const SRC = path.resolve(opt("src", `examples/parsed_tests.json`));

const BATCH_SIZE = Number(process.env.SEED_BATCH ?? 10);
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function need(name) {
  if (!process.env[name]) {
    console.error(`Missing env var: ${name}. Did you run with --env-file=.env.local ?`);
    process.exit(1);
  }
}
need("NEXT_PUBLIC_SUPABASE_URL");
need("SUPABASE_SERVICE_ROLE_KEY");
if (!ONLY_UPSERT) need("GROQ_API_KEY");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const groq = ONLY_UPSERT ? null : new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function resolveSubject() {
  const { data, error } = await supabase
    .from("subjects").select("id, name_uk").eq("slug", SUBJECT).maybeSingle();
  if (error) throw error;
  if (!data) {
    console.error(`Subject "${SUBJECT}" not found. Create it first in public.subjects.`);
    process.exit(1);
  }
  return data;
}

async function loadTopics(subjectId) {
  const { data, error } = await supabase
    .from("subject_topics")
    .select("slug, name, hint, sort_order")
    .eq("subject_id", subjectId)
    .order("sort_order");
  if (error) throw error;
  if (!data?.length) {
    console.error(`Subject "${SUBJECT}" has no topics in public.subject_topics. Add at least one.`);
    process.exit(1);
  }
  return data;
}

function buildSystem(topics) {
  const lines = topics
    .map((t, i) => `${i + 1}. "${t.slug}" — "${t.name}"\n   — ${t.hint ?? ""}`)
    .join("\n");
  return `You classify exam questions into one or more topics.

Topics (return the SLUG, not the human name):
${lines}

Rules:
- A question may fit MULTIPLE topics. Include every topic that applies.
- Always return at least one topic. Best guess if uncertain.
- Use only the slugs from the list above. Copy them exactly.
- Return STRICT JSON: {"results": [{"number": N, "categories": ["slug1", "slug2"]}, ...]}
- Output ONLY the JSON object. No prose.`;
}

async function categorizeBatch(batch, system, allowedSlugs) {
  const userMsg = batch
    .map((q) => {
      const opts = q.options.map((o, i) => `   ${String.fromCharCode(97 + i)}. ${o}`).join("\n");
      return `${q.number}. ${q.text}\n${opts}`;
    })
    .join("\n\n");

  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const resp = await groq.chat.completions.create({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
        temperature: 0,
      });
      const raw = resp.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw);
      const results = Array.isArray(parsed.results) ? parsed.results : [];
      const out = [];
      for (const r of results) {
        const number = Number(r.number);
        if (!Number.isFinite(number)) continue;
        const cats = (Array.isArray(r.categories) ? r.categories : [])
          .map((c) => String(c).trim())
          .filter((c) => allowedSlugs.has(c));
        if (cats.length > 0) out.push({ number, categories: cats });
      }
      return out;
    } catch (e) {
      const status = e?.status ?? e?.response?.status;
      if (status === 429 || (status >= 500 && status < 600)) {
        const wait = Math.min(5 * 60_000, 2000 * Math.pow(2, attempt));
        console.warn(`  groq ${status}, retrying in ${Math.round(wait / 1000)}s…`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw new Error("categorizeBatch: exhausted retries");
}

async function loadParsed() {
  const raw = await fs.readFile(SRC, "utf8");
  return JSON.parse(raw);
}

async function upsertQuestions(parsed, subjectId) {
  console.log(`Upserting ${parsed.length} questions for subject "${SUBJECT}"…`);
  const rows = parsed.map((q) => ({
    subject_id: subjectId,
    number: q.number,
    text: q.text,
    options: q.options,
    correct_indices: q.correct_indices,
    language: q.language ?? "uk",
  }));
  const CHUNK = 200;
  let done = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("questions")
      .upsert(chunk, { onConflict: "subject_id,number" });
    if (error) throw error;
    done += chunk.length;
    process.stdout.write(`\r  upserted ${done}/${rows.length}`);
  }
  console.log("");
}

async function categorizeAll(subjectId, topics) {
  const allowed = new Set(topics.map((t) => t.slug));
  const system = buildSystem(topics);

  const { data, error } = await supabase
    .from("questions")
    .select("number, text, options, categories")
    .eq("subject_id", subjectId)
    .order("number");
  if (error) throw error;
  const todo = data.filter((q) => RECATEGORIZE || !q.categories || q.categories.length === 0);
  if (todo.length === 0) {
    console.log("All questions already have categories. (Use --recategorize to redo.)");
    return;
  }
  console.log(`Categorizing ${todo.length} questions via Groq (${MODEL}), batch size ${BATCH_SIZE}…`);

  let updated = 0;
  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE);
    const t0 = Date.now();
    const results = await categorizeBatch(batch, system, allowed);
    const byNumber = new Map(results.map((r) => [r.number, r.categories]));
    for (const q of batch) {
      const cats = byNumber.get(q.number);
      if (!cats || cats.length === 0) {
        console.warn(`  #${q.number}: no categories returned, skipping`);
        continue;
      }
      const { error: upErr } = await supabase
        .from("questions")
        .update({ categories: cats })
        .eq("subject_id", subjectId)
        .eq("number", q.number);
      if (upErr) console.warn(`  #${q.number}: db update failed: ${upErr.message}`);
      else updated += 1;
    }
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`  batch ${i / BATCH_SIZE + 1}/${Math.ceil(todo.length / BATCH_SIZE)} done in ${dt}s (running total: ${updated})`);
  }
  console.log(`Done. Updated categories on ${updated}/${todo.length} questions.`);
}

(async () => {
  const subj = await resolveSubject();
  console.log(`Subject: "${subj.name_uk}" (${SUBJECT})`);
  const topics = await loadTopics(subj.id);
  console.log(`Topics: ${topics.length} (${topics.map((t) => t.slug).join(", ")})`);

  if (!ONLY_CATEGORIZE) {
    const parsed = await loadParsed();
    await upsertQuestions(parsed, subj.id);
  }
  if (!ONLY_UPSERT) {
    await categorizeAll(subj.id, topics);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

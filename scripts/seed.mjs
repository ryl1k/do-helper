// Seed Supabase with parsed questions, categorized via Groq.
//
// Usage (Windows PowerShell):
//   node --env-file=.env.local scripts/seed.mjs            # full run: upsert all + categorize new
//   node --env-file=.env.local scripts/seed.mjs --only-upsert    # just upsert questions, skip Groq
//   node --env-file=.env.local scripts/seed.mjs --only-categorize  # categorize already-upserted Qs that have no category
//   node --env-file=.env.local scripts/seed.mjs --recategorize    # re-categorize everything from scratch
//
// Resumable: by default skips questions that already have a non-empty categories[].

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const CATEGORIES = [
  "Загальні питання ДО",
  "Лінійне програмування і симплекс-метод",
  "Двоїстість у ЛП",
  "Транспортна задача",
  "Дискретне ЛП",
  "Нелінійне програмування (методи, теореми, умови)",
  "Одновимірна оптимізація (три групи методів)",
  "Багатовимірна оптимізація (методи прямого пошуку, градієнтні, квазіньютонівські)",
  "Ігрові методи у ДО (класифікація ігор, стратегії, критерії)",
];
const CATEGORY_HINTS = {
  "Загальні питання ДО":
    "general operations-research questions: problem formulation, classifications, modelling, solution stages, criteria, terminology",
  "Лінійне програмування і симплекс-метод":
    "linear programming, canonical/standard form, simplex method, basic feasible solutions, pivoting",
  "Двоїстість у ЛП":
    "LP duality, primal-dual relationships, complementary slackness, dual variables, dual problem construction",
  "Транспортна задача":
    "transportation problem, north-west corner, minimum cost, Vogel approximation, potentials (MODI) method, Hungarian/assignment, balanced/unbalanced supply-demand",
  "Дискретне ЛП":
    "integer/discrete linear programming, branch and bound, cutting planes, Gomory, knapsack, 0/1 variables",
  "Нелінійне програмування (методи, теореми, умови)":
    "nonlinear programming, Kuhn-Tucker, Lagrange, convexity, concavity, optimality conditions for NLP, penalty methods",
  "Одновимірна оптимізація (три групи методів)":
    "single-variable optimization: golden section, dichotomy, Fibonacci, Newton, Newton-Raphson, Sven, Powell, parabolic interpolation, mid-point, interval-elimination methods",
  "Багатовимірна оптимізація (методи прямого пошуку, градієнтні, квазіньютонівські)":
    "multivariable optimization: Hooke-Jeeves, Nelder-Mead (simplex), steepest descent, conjugate gradients, BFGS, DFP, quasi-Newton",
  "Ігрові методи у ДО (класифікація ігор, стратегії, критерії)":
    "game theory: matrix games, pure/mixed strategies, saddle point, minimax, maximin, Wald/Hurwicz/Savage criteria, payoff matrix, dominance",
};
const ALLOWED = new Set(CATEGORIES);

const args = new Set(process.argv.slice(2));
const ONLY_UPSERT = args.has("--only-upsert");
const ONLY_CATEGORIZE = args.has("--only-categorize");
const RECATEGORIZE = args.has("--recategorize");

const BATCH_SIZE = Number(process.env.SEED_BATCH ?? 10);
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SRC = path.resolve("examples/parsed_tests.json");

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

const SYSTEM = `You classify Ukrainian "дослідження операцій" (operations research) exam questions into one or more topics.

Topics (use these EXACT Ukrainian labels — copy verbatim):
${CATEGORIES.map((c, i) => `${i + 1}. "${c}"\n   — ${CATEGORY_HINTS[c]}`).join("\n")}

Rules:
- A question may fit MULTIPLE topics. Include every topic that applies.
- Always return at least one topic. Best guess if uncertain.
- Only use labels from the list above. Copy them exactly.
- Return STRICT JSON: {"results": [{"number": N, "categories": ["...", "..."]}, ...]}
- Output ONLY the JSON object. No prose.`;

async function categorizeBatch(batch) {
  const userMsg = batch
    .map((q) => {
      const opts = q.options.map((o, i) => `   ${String.fromCharCode(97 + i)}. ${o}`).join("\n");
      return `${q.number}. ${q.text}\n${opts}`;
    })
    .join("\n\n");

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const resp = await groq.chat.completions.create({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
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
          .filter((c) => ALLOWED.has(c));
        if (cats.length > 0) out.push({ number, categories: cats });
      }
      return out;
    } catch (e) {
      const status = e?.status ?? e?.response?.status;
      if (status === 429 || (status >= 500 && status < 600)) {
        const wait = Math.min(60_000, 2000 * Math.pow(2, attempt));
        console.warn(`  groq ${status}, retrying in ${wait / 1000}s…`);
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

async function upsertQuestions(parsed) {
  console.log(`Upserting ${parsed.length} questions to Supabase…`);
  const rows = parsed.map((q) => ({
    number: q.number,
    text: q.text,
    options: q.options,
    correct_indices: q.correct_indices,
    language: q.language ?? "uk",
  }));
  // Upsert in chunks to keep payloads sane
  const CHUNK = 200;
  let done = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase.from("questions").upsert(chunk, { onConflict: "number" });
    if (error) throw error;
    done += chunk.length;
    process.stdout.write(`\r  upserted ${done}/${rows.length}`);
  }
  console.log("");
}

async function categorizeAll() {
  // Fetch questions from DB that need categorizing
  let query = supabase.from("questions").select("number, text, options, categories").order("number");
  const { data, error } = await query;
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
    const results = await categorizeBatch(batch);

    // Map back to question id and update one-by-one (small N, easy to read)
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
  if (!ONLY_CATEGORIZE) {
    const parsed = await loadParsed();
    await upsertQuestions(parsed);
  }
  if (!ONLY_UPSERT) {
    await categorizeAll();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

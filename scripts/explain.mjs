// Generate per-option Ukrainian explanations for every question of a SUBJECT via Groq.
//
// Usage (PowerShell):
//   node --env-file=.env.local scripts/explain.mjs --subject do                 # only Qs missing explanations
//   node --env-file=.env.local scripts/explain.mjs --subject do --redo          # regenerate everything
//   node --env-file=.env.local scripts/explain.mjs --subject do --limit 50      # cap to N questions
//   node --env-file=.env.local scripts/explain.mjs --subject do --from 181      # only Qs with number >= 181
//
// Resumable: by default skips questions whose explanations[] is already populated.
// On Groq 429 the script honors Retry-After (if sent) and otherwise backs off up to 5 min.

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const args = process.argv.slice(2);
function flag(name) { return args.includes(`--${name}`); }
function opt(name, def) {
  // lastIndexOf so user-supplied flag wins over npm script default.
  const i = args.lastIndexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
}

const SUBJECT = opt("subject");
if (!SUBJECT) {
  console.error("Required: --subject <slug>  (e.g. --subject do)");
  process.exit(2);
}
const REDO = flag("redo");
const LIMIT = Number(opt("limit", Infinity));
const FROM = Number(opt("from", 0));

const BATCH_SIZE = Number(process.env.EXPLAIN_BATCH ?? 5);
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function need(name) {
  if (!process.env[name]) {
    console.error(`Missing env var: ${name}. Run with --env-file=.env.local`);
    process.exit(1);
  }
}
need("NEXT_PUBLIC_SUPABASE_URL");
need("SUPABASE_SERVICE_ROLE_KEY");
need("GROQ_API_KEY");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const LETTERS = ["а", "б", "в", "г", "д", "е", "ж"]; // Ukrainian a/б/в/г

const SYSTEM = `Ти — досвідчений викладач. Для кожного питання тобі дають:
- текст питання,
- варіанти відповідей (а, б, в, …),
- індекси ПРАВИЛЬНИХ варіантів (0-based).

Твоя задача: написати ЗМІСТОВНЕ пояснення (1–2 речення українською) до КОЖНОГО варіанту.

ЗАБОРОНЕНО (типові помилки):
- Тавтологія: "Цей варіант неправильний, оскільки метод не використовує X".
- Тавтологія для правильного: "Цей варіант правильний, оскільки метод використовує X".
- Розпливчасті відмазки: "не є основним інструментом", "не належить до цього методу", "не відповідає суті".
- Перефразування варіанту, заголовки чи markdown.
- Починати пояснення з назви/тексту варіанту.

ВИМОГИ:
- Для НЕПРАВИЛЬНОГО варіанту: поясни, ЩО САМЕ означає цей термін / метод / поняття та ДЕ він реально застосовується (інший метод, інша задача, інша умова). Або вкажи конкретну плутанину — з чим студент часто плутає це поняття.
- Для ПРАВИЛЬНОГО варіанту: поясни МЕХАНІЗМ — як саме воно працює (крок алгоритму, формула, властивість), а не лише назву.
- 1–2 короткі речення на варіант. Жодних емодзі, заголовків, маркерів списку.

Формат відповіді — СТРОГО JSON:
{
  "results": [
    { "number": N, "explanations": ["...а...", "...б...", "...в...", "...г..."] },
    ...
  ]
}
Довжина масиву explanations має точно дорівнювати кількості варіантів цього питання.
Не пиши нічого поза JSON.`;

function formatQuestion(q) {
  const opts = q.options.map((o, i) => `   ${LETTERS[i] ?? i + 1}. ${o}`).join("\n");
  return `${q.number}. ${q.text}\n${opts}\n   ПРАВИЛЬНІ: [${q.correct_indices.join(", ")}]`;
}

async function explainBatch(batch) {
  const userMsg = batch.map(formatQuestion).join("\n\n");

  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const resp = await groq.chat.completions.create({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userMsg },
        ],
        temperature: 0.35,
      });
      const raw = resp.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw);
      const results = Array.isArray(parsed.results) ? parsed.results : [];
      const out = [];
      for (const r of results) {
        const number = Number(r.number);
        if (!Number.isFinite(number)) continue;
        const expl = Array.isArray(r.explanations) ? r.explanations.map((s) => String(s ?? "").trim()) : [];
        if (expl.length === 0) continue;
        out.push({ number, explanations: expl });
      }
      return out;
    } catch (e) {
      const status = e?.status ?? e?.response?.status;
      if (status === 429 || (status >= 500 && status < 600)) {
        const retryAfterHeader =
          e?.headers?.get?.("retry-after") ??
          e?.response?.headers?.get?.("retry-after") ??
          null;
        let wait;
        if (retryAfterHeader) {
          const asNum = Number(retryAfterHeader);
          wait = Number.isFinite(asNum) ? asNum * 1000 : Math.max(0, new Date(retryAfterHeader).getTime() - Date.now());
        }
        if (!wait || !Number.isFinite(wait) || wait <= 0) {
          wait = Math.min(5 * 60_000, 2000 * Math.pow(2, attempt));
        }
        console.warn(`  groq ${status}, retrying in ${Math.round(wait / 1000)}s…`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw new Error("explainBatch: exhausted retries");
}

async function resolveSubject() {
  const { data, error } = await supabase
    .from("subjects").select("id, name_uk").eq("slug", SUBJECT).maybeSingle();
  if (error) throw error;
  if (!data) {
    console.error(`Subject "${SUBJECT}" not found.`);
    process.exit(1);
  }
  return data;
}

(async () => {
  const subj = await resolveSubject();
  console.log(`Subject: "${subj.name_uk}" (${SUBJECT})`);

  const { data, error } = await supabase
    .from("questions")
    .select("number, text, options, correct_indices, explanations")
    .eq("subject_id", subj.id)
    .order("number");
  if (error) throw error;

  const todo = data
    .filter((q) => {
      if (FROM && q.number < FROM) return false;
      if (REDO) return true;
      const expl = q.explanations ?? [];
      return expl.length !== q.options.length || expl.some((e) => !e || !e.trim());
    })
    .slice(0, LIMIT);

  if (todo.length === 0) {
    console.log("Nothing to do. (Use --redo to regenerate.)");
    return;
  }
  console.log(`Generating explanations for ${todo.length} questions via Groq (${MODEL}), batch size ${BATCH_SIZE}…`);

  let updated = 0;
  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE);
    const t0 = Date.now();
    const results = await explainBatch(batch);
    const byNumber = new Map(results.map((r) => [r.number, r.explanations]));

    for (const q of batch) {
      const expl = byNumber.get(q.number);
      if (!expl) {
        console.warn(`  #${q.number}: no explanations returned, skipping`);
        continue;
      }
      const fixed = q.options.map((_, j) => (expl[j] ?? "").trim());
      const { error: upErr } = await supabase
        .from("questions")
        .update({ explanations: fixed })
        .eq("subject_id", subj.id)
        .eq("number", q.number);
      if (upErr) console.warn(`  #${q.number}: db update failed: ${upErr.message}`);
      else updated += 1;
    }
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`  batch ${i / BATCH_SIZE + 1}/${Math.ceil(todo.length / BATCH_SIZE)} done in ${dt}s (running total: ${updated})`);
  }
  console.log(`Done. Updated explanations on ${updated}/${todo.length} questions.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

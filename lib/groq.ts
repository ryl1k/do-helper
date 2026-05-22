import OpenAI from "openai";
import { CATEGORIES, CATEGORY_HINTS, type Category } from "./categories";

const ALLOWED = new Set<string>(CATEGORIES);

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (_client) return _client;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY missing");
  _client = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
  return _client;
}

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SYSTEM = `You classify Ukrainian "дослідження операцій" (operations research) exam questions into one or more topics.

Topics (use these EXACT Ukrainian labels — copy verbatim):
${CATEGORIES.map((c, i) => `${i + 1}. "${c}"\n   — ${CATEGORY_HINTS[c]}`).join("\n")}

Rules:
- A question may fit MULTIPLE topics. Include every topic that applies.
- Always return at least one topic.
- Only use labels from the list above. Copy them exactly, including punctuation and parentheses.
- Return STRICT JSON: {"results": [{"number": N, "categories": ["...", "..."]}, ...]}
- Output ONLY the JSON object. No prose.`;

export interface QuestionForCategorize {
  number: number;
  text: string;
  options: string[];
}

export interface CategorizeResult {
  number: number;
  categories: Category[];
}

export async function categorizeBatch(batch: QuestionForCategorize[]): Promise<CategorizeResult[]> {
  const userMsg = batch
    .map((q) => {
      const opts = q.options.map((o, i) => `   ${String.fromCharCode(97 + i)}. ${o}`).join("\n");
      return `${q.number}. ${q.text}\n${opts}`;
    })
    .join("\n\n");

  const resp = await client().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: userMsg },
    ],
    temperature: 0,
  });

  const raw = resp.choices[0]?.message?.content ?? "{}";
  let parsed: any;
  try { parsed = JSON.parse(raw); } catch { parsed = {}; }
  const results = Array.isArray(parsed.results) ? parsed.results : [];

  const out: CategorizeResult[] = [];
  for (const r of results) {
    const number = Number(r.number);
    if (!Number.isFinite(number)) continue;
    const cats: Category[] = [];
    for (const c of Array.isArray(r.categories) ? r.categories : []) {
      const s = String(c).trim();
      if (ALLOWED.has(s)) cats.push(s as Category);
    }
    if (cats.length === 0) continue;
    out.push({ number, categories: cats });
  }
  return out;
}

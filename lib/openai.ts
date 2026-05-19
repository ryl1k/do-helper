import OpenAI from "openai";
import { z } from "zod";
import { CATEGORIES, CATEGORY_DESCRIPTIONS, OTHER, type Category } from "./categories";

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (_client) return _client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  _client = new OpenAI({ apiKey });
  return _client;
}
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// gpt-4o-mini pricing (USD per 1M tokens) as of late 2024.
// Override via env if you switch models.
const PRICE_IN_PER_M = Number(process.env.OPENAI_PRICE_IN ?? 0.15);
const PRICE_OUT_PER_M = Number(process.env.OPENAI_PRICE_OUT ?? 0.6);

const ALLOWED_CATEGORIES = [...CATEGORIES, OTHER] as readonly string[];

const ExtractedSchema = z.object({
  is_exam_question: z.boolean(),
  question: z.string().default(""),
  options: z.array(z.string()).default([]),
  language: z.string().default("uk"),
  category: z
    .string()
    .default(OTHER)
    .transform((c) => (ALLOWED_CATEGORIES.includes(c) ? (c as Category) : OTHER)),
});

export type Extracted = z.infer<typeof ExtractedSchema>;

export interface ExtractResult {
  data: Extracted;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
}

const CATEGORY_GUIDE = CATEGORIES.map((c) => `  - "${c}": ${CATEGORY_DESCRIPTIONS[c]}`).join("\n");

const SYSTEM = `You extract a single multiple-choice exam question from a screenshot and classify its topic.
Return STRICT JSON with this shape:
{
  "is_exam_question": boolean,
  "question": "the full question text, preserving the original language",
  "options": ["option a text", "option b text", ...],   // 2-6 items, plain text without leading letters/numbers
  "language": "ISO 639-1 code, e.g. uk, en, ru",
  "category": one of: ${CATEGORIES.map((c) => `"${c}"`).join(", ")}, or "${OTHER}" if it doesn't fit any.
}
Rules:
- Preserve the original language exactly. Do NOT translate.
- Strip leading bullets/letters/numbers from options ("a.", "1)", "•", etc.).
- If the image is not a single MCQ exam question, set is_exam_question=false and leave other fields empty.
- Do not add any text outside the JSON object.

Category guide (the labels stay in Ukrainian — pick the most specific match):
${CATEGORY_GUIDE}
  - "${OTHER}": use this only when the question clearly does not fit any of the four above.`;

export async function extractQuestion(imageDataUrl: string): Promise<ExtractResult> {
  const resp = await client().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the exam question from this image." },
          { type: "image_url", image_url: { url: imageDataUrl, detail: "high" } },
        ],
      },
    ],
    temperature: 0,
    max_tokens: 600,
  });

  const raw = resp.choices[0]?.message?.content ?? "{}";
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { is_exam_question: false };
  }
  const data = ExtractedSchema.parse(parsed);

  const tokens_in = resp.usage?.prompt_tokens ?? 0;
  const tokens_out = resp.usage?.completion_tokens ?? 0;
  const cost_usd =
    (tokens_in * PRICE_IN_PER_M) / 1_000_000 + (tokens_out * PRICE_OUT_PER_M) / 1_000_000;

  return { data, tokens_in, tokens_out, cost_usd };
}

// Text-only classifier for backfilling questions that don't have a category yet.
// Way cheaper than the vision call (~$0.00005 per question).
export interface ClassifyResult {
  category: Category;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
}

const CLASSIFY_SYSTEM = `You classify a single exam question into one topic.
Return STRICT JSON: { "category": "..." } where the value is one of:
${CATEGORIES.map((c) => `- "${c}"`).join("\n")}
- "${OTHER}" (only when none of the above clearly fits)

Category guide:
${CATEGORIES.map((c) => `- "${c}": ${CATEGORY_DESCRIPTIONS[c]}`).join("\n")}

Do not output anything outside the JSON object.`;

export async function classifyText(question: string, options: string[]): Promise<ClassifyResult> {
  const resp = await client().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: CLASSIFY_SYSTEM },
      { role: "user", content: `${question}\n\n${options.map((o, i) => `${i + 1}. ${o}`).join("\n")}` },
    ],
    temperature: 0,
    max_tokens: 40,
  });
  const raw = resp.choices[0]?.message?.content ?? "{}";
  let category: Category = OTHER;
  try {
    const parsed = JSON.parse(raw);
    const c = String(parsed.category ?? "");
    category = ALLOWED_CATEGORIES.includes(c) ? (c as Category) : OTHER;
  } catch { /* keep OTHER */ }

  const tokens_in = resp.usage?.prompt_tokens ?? 0;
  const tokens_out = resp.usage?.completion_tokens ?? 0;
  const cost_usd =
    (tokens_in * PRICE_IN_PER_M) / 1_000_000 + (tokens_out * PRICE_OUT_PER_M) / 1_000_000;
  return { category, tokens_in, tokens_out, cost_usd };
}

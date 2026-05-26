import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Verify caller is an admin (their Supabase session JWT in Authorization).
async function checkAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return false;
  const { data: p } = await supabaseAdmin
    .from("profiles").select("is_admin").eq("id", data.user.id).maybeSingle();
  return !!p?.is_admin;
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const text: string = body?.text ?? "";
  if (!text.trim()) return NextResponse.json({ error: "empty text" }, { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GROQ_API_KEY missing on server" }, { status: 500 });

  const client = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
  const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const SYSTEM = `Ти — парсер тестових питань. На вході — сирий текст з кількома питаннями
(Moodle export, нумерований список, довільний формат). Витягни усі MCQ-питання.

Для кожного питання поверни:
- text: текст питання
- options: масив рядків (варіанти, без літер/номерів)
- correct_indices: масив 0-based індексів правильних відповідей. Якщо у вхідному
  тексті відповідь явно не позначена (зірочкою *, галочкою ✓, виділенням, тегом
  "правильна:", тощо) — постав пустий масив [].

Формат відповіді — СТРОГО JSON: {"questions": [{"text":"...","options":["...","..."],"correct_indices":[0]}]}

Правила:
- Не вигадуй питання яких нема в тексті.
- Не вигадуй правильні відповіді — якщо їх нема в тексті, correct_indices: [].
- Не змінюй мову — повертай як є (українська/англійська/тощо).
- Не пиши нічого поза JSON.`;

  try {
    const resp = await client.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: text.slice(0, 30000) },
      ],
      temperature: 0,
    });
    const raw = resp.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    const out = Array.isArray(parsed.questions) ? parsed.questions : [];
    const clean = out
      .filter((q: any) => typeof q?.text === "string" && Array.isArray(q?.options))
      .map((q: any) => ({
        text: String(q.text).trim(),
        options: q.options.map((o: any) => String(o).trim()).filter(Boolean),
        correct_indices: Array.isArray(q.correct_indices) ? q.correct_indices.filter((i: any) => Number.isInteger(i)) : [],
      }))
      .filter((q: any) => q.options.length >= 2);
    return NextResponse.json({ questions: clean, count: clean.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "parse failed" }, { status: 502 });
  }
}

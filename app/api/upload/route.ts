import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { checkApiKey } from "@/lib/auth";
import { BUCKET, supabaseAdmin } from "@/lib/supabase";
import { dHash, hamming, sha256Hex, textHash } from "@/lib/hash";
import { extractQuestion } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const DHASH_NEAR_THRESHOLD = 6; // hamming distance <=6 = near-duplicate

export async function POST(req: NextRequest) {
  const id = checkApiKey(req.headers.get("x-api-key"));
  if (!id) return NextResponse.json({ error: "invalid api key" }, { status: 401 });

  // Budget cap pre-check.
  const cap = Number(process.env.DAILY_USD_CAP ?? "0");
  if (cap > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: u } = await supabaseAdmin
      .from("usage_daily")
      .select("cost_usd")
      .eq("day", today)
      .maybeSingle();
    if (u && Number(u.cost_usd) >= cap) {
      return NextResponse.json(
        { error: "daily budget cap reached", spent_today: Number(u.cost_usd), cap },
        { status: 402 },
      );
    }
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "file too large (8MB max)" }, { status: 400 });
  }

  let buf: Buffer = Buffer.from(await file.arrayBuffer());

  // Normalize to a reasonable PNG (strips EXIF, deterministic hash).
  try {
    buf = await sharp(buf).rotate().png({ compressionLevel: 6 }).toBuffer();
  } catch {
    return NextResponse.json({ error: "could not decode image" }, { status: 400 });
  }

  const byte_sha256 = sha256Hex(buf);
  const dh = await dHash(buf);

  // 1) Exact duplicate by bytes -> link to existing.
  const { data: exact } = await supabaseAdmin
    .from("images")
    .select("id, question_id, status")
    .eq("byte_sha256", byte_sha256)
    .limit(1)
    .maybeSingle();

  if (exact) {
    const dupId = await insertDuplicate({
      byte_sha256, dhash: dh, uploaded_by: id.label, questionId: exact.question_id,
    });
    const q = exact.question_id ? await loadQuestion(exact.question_id) : null;
    return NextResponse.json({
      status: "duplicate", dedup_kind: "exact_bytes",
      image_id: dupId, question_id: exact.question_id,
      question: q?.text, options: q?.options,
    });
  }

  // 2) Near-duplicate by dHash -> link to existing question.
  const { data: candidates } = await supabaseAdmin
    .from("images")
    .select("id, dhash, question_id")
    .not("question_id", "is", null)
    .limit(2000); // cheap for our scale; switch to bk-tree later if needed
  const near = (candidates ?? []).find((c) => hamming(c.dhash, dh) <= DHASH_NEAR_THRESHOLD);
  if (near?.question_id) {
    const path = await uploadToStorage(buf, byte_sha256);
    const dupId = await insertDuplicate({
      byte_sha256, dhash: dh, uploaded_by: id.label,
      questionId: near.question_id, storage_path: path,
    });
    const q = await loadQuestion(near.question_id);
    return NextResponse.json({
      status: "duplicate", dedup_kind: "near_image",
      image_id: dupId, question_id: near.question_id,
      question: q?.text, options: q?.options,
    });
  }

  // 3) Upload to storage and call OpenAI.
  const storage_path = await uploadToStorage(buf, byte_sha256);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

  let extracted;
  try {
    extracted = await extractQuestion(dataUrl);
  } catch (e: any) {
    const { data: row } = await supabaseAdmin
      .from("images")
      .insert({
        storage_path, byte_sha256, dhash: dh, status: "failed",
        error: String(e?.message ?? e), uploaded_by: id.label,
      })
      .select("id")
      .single();
    return NextResponse.json({ error: "openai_failed", image_id: row?.id }, { status: 502 });
  }

  // Record usage.
  await supabaseAdmin.rpc("add_usage", {
    p_in: extracted.tokens_in,
    p_out: extracted.tokens_out,
    p_cost: extracted.cost_usd,
  });

  if (!extracted.data.is_exam_question || extracted.data.options.length < 2) {
    const { data: row } = await supabaseAdmin
      .from("images")
      .insert({
        storage_path, byte_sha256, dhash: dh, status: "not_question",
        uploaded_by: id.label, tokens_in: extracted.tokens_in,
        tokens_out: extracted.tokens_out, cost_usd: extracted.cost_usd,
      })
      .select("id")
      .single();
    return NextResponse.json({ status: "not_question", image_id: row?.id });
  }

  // 4) Content-level dedup on extracted text.
  const th = textHash(extracted.data.question, extracted.data.options);
  const { data: existingQ } = await supabaseAdmin
    .from("questions")
    .select("id")
    .eq("text_hash", th)
    .maybeSingle();

  let questionId = existingQ?.id;
  let dedupKind: string | null = null;

  if (!questionId) {
    const { data: q, error: qErr } = await supabaseAdmin
      .from("questions")
      .insert({
        text: extracted.data.question,
        options: extracted.data.options,
        language: extracted.data.language,
        category: extracted.data.category,
        text_hash: th,
      })
      .select("id")
      .single();
    if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
    questionId = q.id;
  } else {
    dedupKind = "text_match";
  }

  const { data: img, error: iErr } = await supabaseAdmin
    .from("images")
    .insert({
      storage_path, byte_sha256, dhash: dh,
      status: dedupKind ? "duplicate" : "extracted",
      question_id: questionId,
      uploaded_by: id.label,
      tokens_in: extracted.tokens_in,
      tokens_out: extracted.tokens_out,
      cost_usd: extracted.cost_usd,
    })
    .select("id")
    .single();
  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 });

  // Backfill first_image_id on newly created questions.
  if (!dedupKind) {
    await supabaseAdmin
      .from("questions")
      .update({ first_image_id: img.id })
      .eq("id", questionId)
      .is("first_image_id", null);
  }

  return NextResponse.json({
    status: dedupKind ? "duplicate" : "extracted",
    dedup_kind: dedupKind,
    image_id: img.id,
    question_id: questionId,
    question: extracted.data.question,
    options: extracted.data.options,
    cost_usd: extracted.cost_usd,
  });
}

async function loadQuestion(qid: string): Promise<{ text: string; options: string[] } | null> {
  const { data } = await supabaseAdmin
    .from("questions")
    .select("text, options")
    .eq("id", qid)
    .maybeSingle();
  return data ? { text: data.text, options: data.options as string[] } : null;
}

async function uploadToStorage(buf: Buffer, sha: string): Promise<string> {
  const path = `${sha.slice(0, 2)}/${sha}.png`;
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: "image/png", upsert: true });
  if (error && !error.message.includes("exists")) throw error;
  return path;
}

async function insertDuplicate(args: {
  byte_sha256: string;
  dhash: string;
  uploaded_by: string;
  questionId: string | null;
  storage_path?: string;
}): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("images")
    .insert({
      storage_path: args.storage_path ?? "",
      byte_sha256: args.byte_sha256,
      dhash: args.dhash,
      status: "duplicate",
      question_id: args.questionId,
      uploaded_by: args.uploaded_by,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

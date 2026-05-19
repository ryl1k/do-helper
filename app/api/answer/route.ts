import { NextRequest, NextResponse } from "next/server";
import { checkApiKey } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const id = checkApiKey(req.headers.get("x-api-key"));
  if (!id) return NextResponse.json({ error: "invalid api key" }, { status: 401 });

  let body: { question_id?: string; chosen_index?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const { question_id, chosen_index } = body;
  if (!question_id || typeof chosen_index !== "number" || chosen_index < 0) {
    return NextResponse.json({ error: "missing question_id or chosen_index" }, { status: 400 });
  }

  // Validate the index is in range.
  const { data: q, error: qErr } = await supabaseAdmin
    .from("questions")
    .select("options")
    .eq("id", question_id)
    .maybeSingle();
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  if (!q) return NextResponse.json({ error: "question not found" }, { status: 404 });
  if (chosen_index >= (q.options as unknown[]).length) {
    return NextResponse.json({ error: "chosen_index out of range" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("answer_votes").upsert(
    {
      question_id,
      voter: id.label,
      chosen_index,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "question_id,voter" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return fresh counts for this question.
  const { data: votes } = await supabaseAdmin
    .from("answer_votes")
    .select("chosen_index")
    .eq("question_id", question_id);
  const tally: Record<number, number> = {};
  for (const v of votes ?? []) tally[v.chosen_index] = (tally[v.chosen_index] ?? 0) + 1;

  return NextResponse.json({ ok: true, my_vote: chosen_index, tally });
}

export async function DELETE(req: NextRequest) {
  const id = checkApiKey(req.headers.get("x-api-key"));
  if (!id) return NextResponse.json({ error: "invalid api key" }, { status: 401 });

  const url = new URL(req.url);
  const question_id = url.searchParams.get("question_id");
  if (!question_id) return NextResponse.json({ error: "missing question_id" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("answer_votes")
    .delete()
    .eq("question_id", question_id)
    .eq("voter", id.label);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

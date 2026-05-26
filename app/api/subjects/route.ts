import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("subjects")
    .select("id, slug, name_uk, name_en, description, accent_color, sort_order")
    .order("sort_order")
    .order("name_uk");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (data ?? []).map((s) => s.id);

  // Question counts per subject (one round-trip, group client-side).
  const questionCounts = new Map<string, number>();
  if (ids.length) {
    const { data: rows } = await supabaseAdmin.from("questions").select("subject_id");
    for (const r of rows ?? []) questionCounts.set(r.subject_id, (questionCounts.get(r.subject_id) ?? 0) + 1);
  }

  // Topic counts per subject.
  const topicCounts = new Map<string, number>();
  if (ids.length) {
    const { data: rows } = await supabaseAdmin.from("subject_topics").select("subject_id");
    for (const r of rows ?? []) topicCounts.set(r.subject_id, (topicCounts.get(r.subject_id) ?? 0) + 1);
  }

  return NextResponse.json({
    subjects: (data ?? []).map((s) => ({
      ...s,
      question_count: questionCounts.get(s.id) ?? 0,
      topic_count: topicCounts.get(s.id) ?? 0,
    })),
  });
}

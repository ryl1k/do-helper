import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
// revalidate = 300 was not refreshing reliably in prod (Supabase fetch inside the
// handler gets pulled into Next's full-route cache). Force dynamic until we wire
// in proper revalidateTag invalidation from admin write routes (Phase 2).
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("subject");
  if (!slug) return NextResponse.json({ error: "subject query param required" }, { status: 400 });

  const { data: subj, error: sErr } = await supabaseAdmin
    .from("subjects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 });
  if (!subj) return NextResponse.json({ error: "subject not found" }, { status: 404 });

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("id, number, text, options, correct_indices, categories, language, explanations")
    .eq("subject_id", subj.id)
    .order("number");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ subject_slug: slug, questions: data ?? [], count: data?.length ?? 0 });
}

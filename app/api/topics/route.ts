import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
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
    .from("subject_topics")
    .select("slug, name, short_name, hint, color_token, sort_order")
    .eq("subject_id", subj.id)
    .order("sort_order")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ subject_slug: slug, topics: data ?? [] });
}

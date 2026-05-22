import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
// Cache for 5 minutes — the question bank is static after seeding.
export const revalidate = 300;

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("id, number, text, options, correct_indices, categories, language")
    .order("number");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ questions: data, count: data?.length ?? 0 });
}

import { NextRequest, NextResponse } from "next/server";
import { checkApiKey } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { classifyText } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const BATCH = 25; // cap per request to keep us inside Vercel's 60s function limit

export async function POST(req: NextRequest) {
  const id = checkApiKey(req.headers.get("x-api-key"));
  if (!id) return NextResponse.json({ error: "invalid api key" }, { status: 401 });

  const { data: rows, error } = await supabaseAdmin
    .from("questions")
    .select("id, text, options")
    .is("category", null)
    .limit(BATCH);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let updated = 0;
  let cost = 0;
  for (const q of rows ?? []) {
    try {
      const r = await classifyText(q.text, q.options as string[]);
      await supabaseAdmin.from("questions").update({ category: r.category }).eq("id", q.id);
      await supabaseAdmin.rpc("add_usage", { p_in: r.tokens_in, p_out: r.tokens_out, p_cost: r.cost_usd });
      updated += 1;
      cost += r.cost_usd;
    } catch (e) {
      // skip and continue; the row stays category=null and will be picked up on the next run
    }
  }

  // Tell the caller whether more rows remain.
  const { count: remaining } = await supabaseAdmin
    .from("questions")
    .select("*", { count: "exact", head: true })
    .is("category", null);

  return NextResponse.json({ updated, cost_usd: cost, remaining: remaining ?? 0 });
}

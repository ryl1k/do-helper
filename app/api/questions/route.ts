import { NextRequest, NextResponse } from "next/server";
import { checkApiKey } from "@/lib/auth";
import { BUCKET, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const id = checkApiKey(req.headers.get("x-api-key"));
  if (!id) return NextResponse.json({ error: "invalid api key" }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);

  const { data: questions, error } = await supabaseAdmin
    .from("questions")
    .select("id, text, options, language, category, created_at, first_image_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (questions ?? []).map((q) => q.id);

  // image dup count
  const { data: counts } = await supabaseAdmin
    .from("images")
    .select("question_id")
    .in("question_id", ids);
  const countMap = new Map<string, number>();
  for (const r of counts ?? []) {
    if (!r.question_id) continue;
    countMap.set(r.question_id, (countMap.get(r.question_id) ?? 0) + 1);
  }

  // all votes for these questions
  const { data: votes } = await supabaseAdmin
    .from("answer_votes")
    .select("question_id, voter, chosen_index")
    .in("question_id", ids);
  const tallyMap = new Map<string, Record<number, number>>();
  const myVoteMap = new Map<string, number>();
  for (const v of votes ?? []) {
    const t = tallyMap.get(v.question_id) ?? {};
    t[v.chosen_index] = (t[v.chosen_index] ?? 0) + 1;
    tallyMap.set(v.question_id, t);
    if (v.voter === id.label) myVoteMap.set(v.question_id, v.chosen_index);
  }

  // signed URLs for image links
  const out = await Promise.all(
    (questions ?? []).map(async (q) => {
      let image_url: string | null = null;
      if (q.first_image_id) {
        const { data: img } = await supabaseAdmin
          .from("images")
          .select("storage_path")
          .eq("id", q.first_image_id)
          .maybeSingle();
        if (img?.storage_path) {
          const { data: signed } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(img.storage_path, 3600);
          image_url = signed?.signedUrl ?? null;
        }
      }
      const tally = tallyMap.get(q.id) ?? {};
      const consensus = consensusIndex(tally);
      return {
        ...q,
        image_count: countMap.get(q.id) ?? 0,
        image_url,
        tally,
        my_vote: myVoteMap.get(q.id) ?? null,
        consensus,
      };
    }),
  );

  const { count: totalImages } = await supabaseAdmin
    .from("images")
    .select("*", { count: "exact", head: true });
  const { count: totalDupes } = await supabaseAdmin
    .from("images")
    .select("*", { count: "exact", head: true })
    .eq("status", "duplicate");

  return NextResponse.json({
    questions: out,
    stats: {
      total_questions: questions?.length ?? 0,
      total_images: totalImages ?? 0,
      total_duplicates: totalDupes ?? 0,
    },
  });
}

function consensusIndex(tally: Record<number, number>): number | null {
  let best: number | null = null;
  let max = 0;
  let tie = false;
  for (const [k, v] of Object.entries(tally)) {
    if (v > max) { best = Number(k); max = v; tie = false; }
    else if (v === max) tie = true;
  }
  return tie || best === null ? null : best;
}

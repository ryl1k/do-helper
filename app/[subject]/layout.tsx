import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 60;

// Subject layout's only job is to 404 unknown slugs. Visual subject styling
// lives in the page bodies via lib/topics (per-topic colors) — the global
// shell + accent palette are now constant across subjects in the Метод design.
export default async function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const { data } = await supabaseAdmin
    .from("subjects")
    .select("id")
    .eq("slug", subject)
    .maybeSingle();
  if (!data) notFound();
  return <>{children}</>;
}

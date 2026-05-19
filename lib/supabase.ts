import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function client(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

// Proxy so callers can keep writing `supabaseAdmin.from(...)` etc.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (client() as any)[prop];
  },
});

export const BUCKET = process.env.SUPABASE_BUCKET || "questions";

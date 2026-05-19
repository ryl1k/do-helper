// API key auth via x-api-key header. Keys are comma-separated in APP_API_KEYS.
// Format suggestion: "xxxxxx,yyyyyy" — the label before the last
// underscore segment is used as `uploaded_by` for attribution.

export interface ApiKeyIdentity {
  key: string;
  label: string; // e.g. "xxxxx"
}

function parseKeys(): Map<string, ApiKeyIdentity> {
  const raw = process.env.APP_API_KEYS || "";
  const out = new Map<string, ApiKeyIdentity>();
  for (const k of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    const label = k.split("_").slice(0, -1).join("_") || k;
    out.set(k, { key: k, label });
  }
  return out;
}

export function checkApiKey(headerValue: string | null): ApiKeyIdentity | null {
  if (!headerValue) return null;
  const keys = parseKeys();
  return keys.get(headerValue.trim()) ?? null;
}

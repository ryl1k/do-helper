import crypto from "node:crypto";
import sharp from "sharp";

export function sha256Hex(buf: Buffer): string {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

// dHash: resize to 9x8 grayscale, compare adjacent pixels => 64-bit hash.
// Returns 16-char hex. Hamming distance < ~10 ≈ visually similar.
export async function dHash(buf: Buffer): Promise<string> {
  const { data } = await sharp(buf)
    .grayscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bits: number[] = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = data[y * 9 + x];
      const right = data[y * 9 + x + 1];
      bits.push(left < right ? 1 : 0);
    }
  }
  let hex = "";
  for (let i = 0; i < 64; i += 4) {
    const nibble = (bits[i] << 3) | (bits[i + 1] << 2) | (bits[i + 2] << 1) | bits[i + 3];
    hex += nibble.toString(16);
  }
  return hex;
}

export function hamming(a: string, b: string): number {
  if (a.length !== b.length) return 64;
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    const x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    d += (x & 1) + ((x >> 1) & 1) + ((x >> 2) & 1) + ((x >> 3) & 1);
  }
  return d;
}

// Normalize text for content-level dedup.
export function normalizeForHash(question: string, options: string[]): string {
  const norm = (s: string) =>
    s.toLowerCase().replace(/\s+/g, " ").replace(/[^\p{L}\p{N} ]/gu, "").trim();
  return [norm(question), ...options.map(norm).sort()].join("|");
}

export function textHash(question: string, options: string[]): string {
  return sha256Hex(Buffer.from(normalizeForHash(question, options), "utf8"));
}

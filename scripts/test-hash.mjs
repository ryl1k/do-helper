// Quick sanity check that dHash distinguishes the 5 examples and matches identical copies.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import crypto from "node:crypto";

async function dHash(buf) {
  const { data } = await sharp(buf)
    .grayscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bits = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits.push(data[y * 9 + x] < data[y * 9 + x + 1] ? 1 : 0);
    }
  }
  let hex = "";
  for (let i = 0; i < 64; i += 4) {
    const n = (bits[i] << 3) | (bits[i + 1] << 2) | (bits[i + 2] << 1) | bits[i + 3];
    hex += n.toString(16);
  }
  return hex;
}

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    const x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    d += (x & 1) + ((x >> 1) & 1) + ((x >> 2) & 1) + ((x >> 3) & 1);
  }
  return d;
}

const dir = path.resolve("examples");
const files = (await fs.readdir(dir)).filter((f) => /\.(png|jpg)$/i.test(f));
const hashes = {};
for (const f of files) {
  const buf = await sharp(path.join(dir, f)).png().toBuffer();
  hashes[f] = { dhash: await dHash(buf), sha: crypto.createHash("sha256").update(buf).digest("hex").slice(0, 12) };
}
console.table(hashes);

console.log("\nPairwise hamming distance (lower = more similar):");
const names = Object.keys(hashes);
for (let i = 0; i < names.length; i++) {
  for (let j = i + 1; j < names.length; j++) {
    console.log(`  ${names[i]} vs ${names[j]}: ${hamming(hashes[names[i]].dhash, hashes[names[j]].dhash)}`);
  }
}

// Identical-copy test
const a = await sharp(path.join(dir, files[0])).png().toBuffer();
const b = await sharp(path.join(dir, files[0])).png().toBuffer();
console.log(`\nSame image, two reads: hamming = ${hamming(await dHash(a), await dHash(b))} (expect 0)`);

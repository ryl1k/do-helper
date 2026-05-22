// Parses examples/parsed_tests.txt -> examples/parsed_tests.json.
// Tolerates source-file quirks: variable option counts (2-7), some malformed rows.
import fs from "node:fs/promises";

const SRC = "examples/parsed_tests.txt";
const OUT = "examples/parsed_tests.json";

const txt = await fs.readFile(SRC, "utf8");
const lines = txt.split(/\r?\n/);

const RX_Q = /^Питання\s+(\d+):\s*(.*)$/;
const RX_OPT = /^\s*-\s*(.+?)\s*[—–-]\s*(\d+)\s*%\s*$/;
const RX_SEP = /^-{5,}\s*$/;

const questions = [];
let cur = null;
let pcts = []; // parallel array of percentages for the current question

function flush() {
  if (cur && cur.options.length > 0) {
    // The "correct" option(s) are the one(s) with the highest percentage.
    // Source file is exam stats: usually one option at 100%, sometimes weighted
    // (89/11), sometimes multi-correct (multiple at 100%).
    const max = Math.max(...pcts);
    if (max > 0) {
      cur.correct_indices = pcts
        .map((p, i) => (p === max ? i : -1))
        .filter((i) => i >= 0);
    }
    questions.push(cur);
  }
  cur = null;
  pcts = [];
}

for (const line of lines) {
  const qm = line.match(RX_Q);
  if (qm) {
    flush();
    cur = {
      number: Number(qm[1]),
      text: qm[2].trim(),
      options: [],
      correct_indices: [],
      language: "uk",
    };
    continue;
  }
  if (!cur) continue;
  if (/^\s*Варіанти/.test(line)) continue;
  if (RX_SEP.test(line)) { flush(); continue; }
  const om = line.match(RX_OPT);
  if (om) {
    const text = om[1].trim();
    const pct = Number(om[2]);
    cur.options.push(text);
    pcts.push(pct);
  }
}
flush();

await fs.writeFile(OUT, JSON.stringify(questions, null, 2));

// Diagnostics
const noCorrect = questions.filter((q) => q.correct_indices.length === 0);
const multiCorrect = questions.filter((q) => q.correct_indices.length > 1);
const fewOpts = questions.filter((q) => q.options.length < 3);

console.log(`Parsed ${questions.length} questions -> ${OUT}`);
console.log(`  multi-correct: ${multiCorrect.length}`);
console.log(`  without correct answer: ${noCorrect.length}` + (noCorrect.length ? ` (e.g. #${noCorrect[0].number})` : ""));
console.log(`  with <3 options: ${fewOpts.length}` + (fewOpts.length ? ` (e.g. #${fewOpts[0].number})` : ""));

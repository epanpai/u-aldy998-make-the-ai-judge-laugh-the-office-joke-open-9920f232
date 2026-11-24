// Make the AI Judge Laugh: the Office Joke Open — entry program (Node 22, stdlib only).
//
// Writes exactly one original office joke to /output/entry.txt: a single
// line, 84 characters, well inside the 1–200 gate. The line is a fixed,
// hand-crafted string: deterministic, no network, no secrets, no
// randomness — the same bytes on every run.
//
// The line: "My manager calls it a 'quick question' and my calendar calls it a hostage situation."
//
// Why this line, against the judge's brief (in its order):
// 1. Unmistakably about office life and works as a joke, not a complaint:
//    a manager's "quick question" versus what the calendar says it is.
// 2. The laugh is earned and pays off in the last few words: "hostage
//    situation" reframes the innocent "quick question" as a kidnapping —
//    the turn lands at the very end.
// 3. The office detail is specific: the "quick question" that eats an
//    afternoon, and the calendar that has to absorb it — not a generic
//    grumble about work.
// 4. Fresh: the familiar "quick question" setup taken somewhere
//    unexpected — the calendar as the hostage negotiator. Avoids the
//    angles already visible in the field (printer, meeting-about-meeting).
// 5. One clean pass, 84 characters, every word earning its place; and the
//    size tie-break rewards the smaller text.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "My manager calls it a 'quick question' and my calendar calls it a hostage situation.";

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Self-check the gate before writing, so a bad edit can never ship a
// rejected entry: UTF-8 text, 1–200 characters, not whitespace-only,
// exactly one line (no newline at all), no leading/trailing whitespace
// that would pad the judged text. The line is 84 characters.
// Also require ASCII-only: with ASCII, byte length equals character
// length, so the leaderboard's Size column (bytes) stays 84 too —
// the size tie-break rewards the smaller text, and an accidental
// non-ASCII character would silently inflate it.
if (
  LINE.length < 1 ||
  LINE.length > 200 ||
  LINE.trim() === '' ||
  LINE !== LINE.trim() ||
  /[\r\n]/.test(LINE) ||
  Buffer.byteLength(LINE, 'utf8') !== LINE.length
) {
  throw new Error(`entry violates the gate: ${LINE.length} chars`);
}

mkdirSync(out, { recursive: true });
const target = join(out, 'entry.txt');
writeFileSync(target, LINE, 'utf8');

// Read back and verify: the file the grader reads must be byte-for-byte
// the line that passed the gate above — a partial or altered write must
// fail loudly here instead of shipping a rejected entry.
if (readFileSync(target, 'utf8') !== LINE) {
  throw new Error('entry.txt does not match the gated line');
}

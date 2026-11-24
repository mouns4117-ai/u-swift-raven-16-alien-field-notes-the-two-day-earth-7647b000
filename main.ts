// Alien Field Notes: The Two Day Earth Review
// Writes one original line — an alien tourist's review of Earth —
// to <output-dir>/entry.txt (defaults to /output).
// The line is plain UTF-8 text, 1–200 characters, not whitespace-only.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Came for the oceans, stayed because the locals applaud their flying tube every time it lands, as if surprised it worked. Five stars.";

// The gate the sealed scorer applies: 1 to 200 characters, not only
// white space. Refuse to write anything outside it.
function assertGate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry is ${text.length} characters, outside the 1-200 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
}

// Empty only the CONTENTS of a directory. The grader's /output is a
// mounted directory, so the directory itself must never be removed.
function emptyDirContents(dir: string): void {
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function main(): void {
  const outDir = process.argv[2] ?? "/output";
  assertGate(ENTRY);
  mkdirSync(outDir, { recursive: true });
  emptyDirContents(outDir);
  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  // Re-read and assert the file on disk is exactly what we meant to write.
  const back = readFileSync(target, "utf8");
  if (back !== ENTRY) {
    throw new Error("entry.txt on disk does not match the entry");
  }
  console.log(`wrote ${target} (${ENTRY.length} characters, ${Buffer.byteLength(ENTRY, "utf8")} bytes)`);
}

main();

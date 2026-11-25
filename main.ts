import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS: number = 280;

const ENTRY_LINE: string =
  "My dad didn't believe in therapy, so he spent 30 years silently reloading the dishwasher until everyone apologized.";

function validateEntry(text: string): void {
  const charCount: number = [...text].length;
  if (text.trim().length === 0 || charCount > MAX_CHARS || /[\r\n]/.test(text)) {
    throw new Error(`Invalid entry text (chars=${charCount})`);
  }
}

function main(): void {
  validateEntry(ENTRY_LINE);

  const envDir: string | undefined = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  const outputDir: string = envDir && envDir.length > 0 ? envDir : "/output";
  const outputPath: string = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  chmodSync(outputDir, 0o755);
  writeFileSync(outputPath, ENTRY_LINE, { encoding: "utf8", mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

try {
  main();
} catch (error: unknown) {
  const message: string = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

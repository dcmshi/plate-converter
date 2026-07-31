import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Guards the hand-annotated Project Structure block in README.md. The per-file
 * descriptions can't be derived from the code, so the list stays hand-written
 * and drift shows up here instead of rotting silently.
 */

// Normalised so the per-line matching below survives CRLF checkouts
const readme = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8').replace(/\r\n/g, '\n');

const structureBlock = (() => {
  const match = /## Project Structure\s*```([\s\S]*?)```/.exec(readme);
  if (match === null) throw new Error('README.md has no fenced Project Structure block');
  return match[1];
})();

/** Filenames listed in the block, ignoring the trailing `# comment` on each line. */
const listed = new Set(
  structureBlock.split('\n').flatMap((line) => {
    const match = /^\s*([A-Za-z0-9_.-]+\.(?:tsx?|css))\b/.exec(line);
    return match === null ? [] : [match[1]];
  }),
);

const onDisk = (dir: string) =>
  readdirSync(resolve(process.cwd(), dir)).filter((f) => /\.(ts|tsx|css)$/.test(f));

describe('README project structure', () => {
  it.each(['src', 'src/utils', 'src/components', 'src/test'])('lists every file in %s', (dir) => {
    const missing = onDisk(dir).filter((f) => !listed.has(f));
    expect(missing, `add these to the README Project Structure block: ${missing.join(', ')}`)
      .toEqual([]);
  });

  it('lists no file that has been deleted or renamed', () => {
    const real = new Set([
      ...onDisk('src'),
      ...onDisk('src/utils'),
      ...onDisk('src/components'),
      ...onDisk('src/test'),
    ]);
    const stale = [...listed].filter((f) => !real.has(f));
    expect(stale, `remove these from the README Project Structure block: ${stale.join(', ')}`)
      .toEqual([]);
  });
});

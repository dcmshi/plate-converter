import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

const PAGE_BG = '#09090b';

describe('document chrome', () => {
  it('paints the page background before React mounts', () => {
    const css = read('src/index.css');
    expect(css).toMatch(/html,\s*body\s*{[^}]*background-color:\s*#09090b/);
  });

  it('declares a matching theme-color for mobile browser chrome', () => {
    const html = read('index.html');
    expect(html).toContain(`<meta name="theme-color" content="${PAGE_BG}" />`);
  });
});

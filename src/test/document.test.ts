import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

const PAGE_BG = '#09090b';
const SITE_URL = 'https://plate-converter.onrender.com';

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

describe('link previews', () => {
  it('points og:image at an absolute URL backed by a file in public/', () => {
    const html = read('index.html');
    const src = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
    expect(src).toBe(`${SITE_URL}/screenshot.png`);
    const path = src!.slice(SITE_URL.length).replace(/^\//, '');
    expect(existsSync(resolve(process.cwd(), 'public', path))).toBe(true);
  });

  it('gives the same image to Twitter with a large-summary card', () => {
    const html = read('index.html');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain(`<meta name="twitter:image" content="${SITE_URL}/screenshot.png" />`);
  });
});

describe('search indexing', () => {
  it('invites crawlers to index the page', () => {
    expect(read('index.html')).toContain('<meta name="robots" content="index, follow" />');
    expect(read('public/robots.txt')).toMatch(/User-agent:\s*\*\s*\nAllow:\s*\//);
  });

  it('agrees on one absolute site URL across canonical, og:url and JSON-LD', () => {
    const html = read('index.html');
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/" />`);
    expect(html).toContain(`<meta property="og:url" content="${SITE_URL}/" />`);

    const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1];
    expect(JSON.parse(ld!).url).toBe(`${SITE_URL}/`);
  });

  it('lists the canonical URL in a sitemap that robots.txt advertises', () => {
    expect(read('public/sitemap.xml')).toContain(`<loc>${SITE_URL}/</loc>`);
    expect(read('public/robots.txt')).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  it('keeps a descriptive title and description for result snippets', () => {
    const html = read('index.html');
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
    expect(title).toMatch(/^PlateConverter\b.+/);
    expect(title!.length).toBeLessThanOrEqual(70);

    const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1];
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.length).toBeLessThanOrEqual(160);
  });
});

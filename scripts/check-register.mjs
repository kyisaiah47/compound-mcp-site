#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const ROOT = resolve(new URL('..', import.meta.url).pathname);
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');
const files = ['src/app/globals.css', 'src/app/page.tsx', 'src/app/layout.tsx', 'src/lib/product.ts', 'src/lib/surface.ts', 'src/components/SmoothScroll.tsx', 'scripts/deploy.sh'];
const fail = (name, detail) => { console.error(`FAIL ${name}: ${detail}`); process.exitCode = 1; };
const ok = (name, detail) => console.log(`ok   ${name}: ${detail}`);
for (const f of files) if (!existsSync(resolve(ROOT, f))) fail('tree', `${f} is missing`);
const css = read('src/app/globals.css');
const page = read('src/app/page.tsx');
const product = read('src/lib/product.ts');
const surface = read('src/lib/surface.ts');
const layout = read('src/app/layout.tsx');
const smooth = read('src/components/SmoothScroll.tsx');
const deploy = read('scripts/deploy.sh');
for (const f of files.filter((f) => f !== 'src/lib/surface.ts')) if (/[\u2014\u2013\u2012\u2212]/.test(read(f))) fail('dash rule', `${f} contains a wide dash`);
css.includes('#AEBA5C') && css.includes('#C1CE6F') ? ok('accent', 'declared accent and hover') : fail('accent', 'accent register missing');
css.includes('minmax(560px,1fr)') || css.includes('minmax(560px, 1fr)') ? ok('shell', 'product shell declared') : fail('shell', 'shell sum missing');
surface.includes('TOOL_COUNT = 11') && (surface.match(/"name":/g) || []).length >= 11 ? ok('tool surface', '11 captured tool rows') : fail('tool surface', 'tool count is not 11');
product.includes('SOURCES') && page.includes('SOURCES.map') ? ok('sources', 'every page source row is rendered') : fail('sources', 'source ledger is not rendered');
// Since 2026-10-02 the credit is the anchor text "Built by Compound Labs", no mark, and the footer
// carries no "A Compound Labs product" sentence (compound-ops/standards/STUDIO-CREDIT-SEAL.md).
page.includes('href="https://thecompound.tech/?utm_source=compound-mcp-site&utm_medium=studio_credit">Built by Compound Labs</a>') && !/studio-credit-mark|a compound labs product/i.test(page + read('src/components/site-view/SimpleChrome.tsx') + css) && page.includes('hello@thecompound.tech') && layout.includes('thecompound.tech/#organization') ? ok('studio credit', 'publisher, the text credit with no mark and no product sentence, and contact') : fail('studio credit', 'credit layer missing, or a mark or "A Compound Labs product" came back');
smooth.includes('allowNestedScroll: true') && smooth.includes('prefers-reduced-motion') && smooth.includes('lerp: 0.35') ? ok('lenis', 'nested scroll and reduced motion guard') : fail('lenis', 'Lenis settings missing');
page.includes('TOOL_COUNT') || page.includes('{TOOLS.length}') ? ok('figures', 'tool count comes from the captured surface') : fail('figures', 'typed figure found');
deploy.indexOf('npm run check') < deploy.indexOf('npx opennextjs-cloudflare build') ? ok('deploy order', 'check runs before build') : fail('deploy order', 'gate does not run before build');
deploy.includes('scripts/verify-cf.mjs') ? ok('deploy verify', 'worker verification is terminal') : fail('deploy verify', 'verify gate missing');
existsSync(resolve(ROOT, 'src/app/robots.ts')) && existsSync(resolve(ROOT, 'src/app/sitemap.ts')) && existsSync(resolve(ROOT, 'src/app/llms.txt/route.ts')) ? ok('crawl surface', 'robots, sitemap, and llms route') : fail('crawl surface', 'crawl route missing');
if (process.exitCode) process.exit(1);

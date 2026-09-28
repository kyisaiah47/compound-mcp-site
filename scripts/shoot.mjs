/* SHOOT EVERY VIEW AT 1440 INTO review/.
 *
 *   node scripts/shoot.mjs [baseUrl]
 *
 * ⛔ A VIEW IS A STATE AS WELL AS A ROUTE. The gate is this console's one control, and a gate
 * nobody presses is a grid nobody has looked at. Every gate is pressed and shot, plus the app
 * strip, which is a state of the masthead and is invisible until the switch is pressed.
 *
 * ⛔ DESKTOP ONLY, AND THIS SCRIPT HAS NO PHONE MODE AT ALL. No capture of this product or of
 * any site is taken at a phone viewport. The phone SHAPE is a measurement rather than a
 * picture, and the estate already owns the tool that takes it, so this file does not
 * re-implement one:
 *
 *   node ~/CompoundLabs/compound-ops/tools/gates/mobile-shape.mjs <url>
 *   node ~/CompoundLabs/compound-ops/tools/gates/lenis-nested-scroll.mjs <url>
 *
 * ⛔ TILED, NEVER fullPage. A fullPage capture paints white past about 8192 CSS px, so a long
 * page comes back half blank and the blank half reads as a rendering bug that is not there.
 * This scrolls a viewport at a time and writes one tile per screen, which is also the only
 * form a reader can actually look at.
 *
 * Nothing is selected in a capture. Selection is disabled on the page before the shot, and no
 * recorder in this tree ever drag selects text.
 */
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { launchSafe } from '/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs';

const require = createRequire('/Users/admin/CompoundLabs/compound-ops/package.json');
const puppeteer = require('puppeteer-core');

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'review');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const BASE = process.argv.slice(2).find((a) => a.startsWith('http')) ?? 'http://localhost:3312';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const press = (sel, n = 0) => async (page) => {
  await page.evaluate((s, i) => { const b = document.querySelectorAll(s); if (b[i]) b[i].click(); }, sel, n);
};

const VIEWS = [
  { id: 'console-check', url: '/', act: null },
  { id: 'console-promote', url: '/', act: press('.chip', 1) },
  { id: 'console-render', url: '/', act: press('.chip', 2) },
  { id: 'console-deploy-gate', url: '/', act: press('.chip', 3) },
  { id: 'console-app-strip', url: '/', act: press('.app-switch', 0) },
  { id: 'kinds', url: '/kinds', act: null },
  { id: 'method', url: '/method', act: null },
  { id: 'not-found', url: '/nothing-here', act: null },
];

const browser = await launchSafe(puppeteer, { headless: true });
const ledger = [];
let bad = 0;

for (const v of VIEWS) {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    const s = document.createElement('style');
    s.textContent = '*{user-select:none!important} ::selection{background:transparent!important}';
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(s));
  });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  const res = await page.goto(BASE + v.url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await wait(400);
  if (v.act) { await v.act(page); await wait(600); }

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const tiles = Math.ceil(total / 900);
  for (let i = 0; i < tiles; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 900);
    await wait(260);
    await page.screenshot({ path: resolve(OUT, `${v.id}-${String(i + 1).padStart(2, '0')}.png`) });
  }

  /* The sideways scroll check belongs with the capture because it is free here and it is the
     one defect a tile cannot show: a document 12px wider than its viewport looks identical in a
     screenshot and is broken in a browser. */
  const box = await page.evaluate(() => {
    const d = document.documentElement;
    return { clientWidth: d.clientWidth, scrollWidth: d.scrollWidth };
  });
  const sideways = box.scrollWidth > box.clientWidth + 1;
  if (sideways) bad++;
  ledger.push({ id: v.id, url: v.url, status: res ? res.status() : null, height: total, tiles, ...box, sideways });
  process.stdout.write(
    `  ${v.id.padEnd(22)} ${String(res ? res.status() : 'ERR').padEnd(4)} ${tiles} tile(s)  ${total}px tall  ` +
      `document ${box.scrollWidth} in ${box.clientWidth}${sideways ? '  SCROLLS SIDEWAYS' : ''}\n`,
  );
  await page.close();
}

writeFileSync(resolve(OUT, 'ledger.json'), JSON.stringify({ at: new Date().toISOString(), vw: 1440, views: ledger }, null, 1) + '\n');
await browser.close();
process.stdout.write(`\n${VIEWS.length} views at 1440 into review/\n`);
if (bad) {
  process.stderr.write(`${bad} view(s) scroll sideways at 1440\n`);
  process.exit(1);
}

/* Simple view verification. Bundled Chromium (Playwright) against the local dev server.
 *
 *   node scripts/verify-simple.mjs <base> <product> [outDir]
 *
 * Every request off localhost is aborted except Google Fonts, so nothing leaves the machine.
 * Every page carries the estate's click guard (guardPlaywrightPage), so a mailto anchor can never
 * reach another app. Nothing here submits a form that writes. */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { guardPlaywrightPage } from '/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs';

const require = createRequire('/Users/admin/CompoundLabs/compound-ops/');
const { chromium } = require('playwright');

const BASE = process.argv[2];
const PRODUCT = process.argv[3];
const OUT = process.argv[4] || '/Users/admin/CompoundLabs/compound-ops/standards/simple-view-ref/review';
const ROUTES = JSON.parse(readFileSync(new URL('./simple-routes.json', import.meta.url), 'utf8'));
mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
const browser = await chromium.launch({ args: ['--mute-audio'] });
async function open(width = 1440, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await ctx.route('**/*', (route) => {
    const h = new URL(route.request().url()).hostname;
    return ['localhost', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(h) ? route.continue() : route.abort();
  });
  const page = await ctx.newPage();
  await guardPlaywrightPage(page);
  return { ctx, page };
}
const settle = (page) => page.waitForTimeout(800);
const view = (page) => page.locator('.site-surface').getAttribute('data-view');

try {
  {
    const { ctx, page } = await open();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await settle(page);
    const dlg = page.locator('dialog.sv-welcome');
    check('welcome opens on / for a fresh visitor', await dlg.evaluate((d) => d.open));
    check('fresh visitor defaults to Console', (await view(page)) === 'console');
    check('welcome mark is the product svg', (await dlg.locator('.sv-mark svg, .sv-mark img').count()) === 1);
    await page.screenshot({ path: `${OUT}/${PRODUCT}-welcome-1440.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    check('Escape closes the welcome', !(await dlg.evaluate((d) => d.open)));
    await page.locator('.sv-view-tools button', { hasText: 'Start here' }).first().click();
    await page.waitForTimeout(400);
    check('footer Start here reopens the welcome', await dlg.evaluate((d) => d.open));
    await page.mouse.click(5, 5);
    await page.waitForTimeout(400);
    check('backdrop click closes the welcome', !(await dlg.evaluate((d) => d.open)));
    await page.locator('.sv-view-tools button', { hasText: 'Start here' }).first().click();
    await page.waitForTimeout(300);
    await dlg.locator('footer input[type=checkbox]').check();
    await dlg.locator('.sv-choices button', { hasText: 'Simple' }).click();
    await page.waitForTimeout(400);
    check('choosing Simple switches the page', (await view(page)) === 'simple');
    await page.reload({ waitUntil: 'networkidle' });
    await settle(page);
    check('suppression persists across reload', !(await dlg.evaluate((d) => d.open)));
    check('Simple persists across reload', (await view(page)) === 'simple');
    await page.goto(`${BASE}/?view=console&utm_source=x`, { waitUntil: 'networkidle' });
    await settle(page);
    check('URL view overrides the saved view', (await view(page)) === 'console');
    await page.locator('.sv-view-tools button', { hasText: 'Simple' }).first().click();
    await page.waitForTimeout(300);
    const url = new URL(page.url());
    check('switching keeps other parameters', url.searchParams.get('view') === 'simple' && url.searchParams.get('utm_source') === 'x', url.search);
    await ctx.close();
  }
  {
    const { ctx, page } = await open(390, 844);
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await settle(page);
    const fits = await page.locator('dialog.sv-welcome').evaluate((d) => {
      const r = d.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight && r.right <= innerWidth && getComputedStyle(d).overflowY === 'auto';
    });
    check('phone welcome fits the viewport and scrolls', fits);
    await ctx.close();
  }
  {
    const { ctx, page } = await open();
    await page.goto(`${BASE}/?view=simple&welcome=0`, { waitUntil: 'networkidle' });
    await settle(page);
    check('one Simple header, main and footer', (await page.locator('header.sv-nav').count()) === 1 && (await page.locator('main').count()) === 1 && (await page.locator('footer.sv-footer').count()) === 1);
    check('no native select on the Simple home', (await page.locator('select').count()) === 0);
    await page.screenshot({ path: `${OUT}/${PRODUCT}-simple-1440.png`, fullPage: true });
    const triggers = page.locator('[role=combobox][aria-haspopup=listbox]');
    if (await triggers.count()) {
      const t = triggers.first();
      await t.click();
      await page.waitForTimeout(300);
      check('listbox opens on click', (await t.getAttribute('aria-expanded')) === 'true');
      const top = await t.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
      await page.screenshot({ path: `${OUT}/${PRODUCT}-simple-select-open-1440.png`, fullPage: true, clip: { x: 0, y: Math.max(0, top - 300), width: 1440, height: 900 } });
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      check('keyboard picks an option and closes', (await t.getAttribute('aria-expanded')) === 'false');
      check('focus returns to the trigger', await t.evaluate((el) => el === document.activeElement));
      await t.click();
      await page.waitForTimeout(200);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      check('Escape closes the listbox', (await t.getAttribute('aria-expanded')) === 'false');
    }
    const ex = page.locator('#example');
    if (await ex.count()) {
      const b = ex.locator('.sv-disclosure > button').first();
      if (await b.count()) {
        check('collapsed body is inert', (await ex.locator('.sv-reveal').first().getAttribute('inert')) !== null);
        for (const x of await ex.locator('.sv-disclosure > button').all()) await x.click();
        await page.waitForTimeout(500);
        check('disclosure opens with aria-expanded', (await b.getAttribute('aria-expanded')) === 'true');
      }
      await ex.screenshot({ path: `${OUT}/${PRODUCT}-simple-example-open-1440.png` });
    }
    await ctx.close();
  }
  {
    const { ctx, page } = await open();
    await page.goto(`${BASE}/?view=console&welcome=0`, { waitUntil: 'networkidle' });
    await settle(page);
    await page.screenshot({ path: `${OUT}/${PRODUCT}-console-1440.png`, fullPage: true });
    await ctx.close();
  }
  for (const width of [1440, 390]) {
    const { ctx, page } = await open(width, width === 390 ? 844 : 900);
    for (const r of ROUTES) {
      await page.goto(`${BASE}${r}${r.includes('?') ? '&' : '?'}view=simple&welcome=0`, { waitUntil: 'networkidle' });
      await settle(page);
      const m = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        headers: document.querySelectorAll('header.sv-nav').length,
        footers: document.querySelectorAll('footer.sv-footer').length,
        selects: document.querySelectorAll('select').length,
      }));
      check(`${width} ${r} Simple chrome, no overflow`, m.overflow <= 0 && m.headers === 1 && m.footers === 1 && m.selects === 0, JSON.stringify(m));
      if (width === 390 && r === '/') await page.screenshot({ path: `${OUT}/${PRODUCT}-simple-qa-390.png`, fullPage: true });
      if (width === 1440 && r !== '/') await page.screenshot({ path: `${OUT}/${PRODUCT}-simple${r.replace(/[/?=&]/g, '-')}-1440.png`, fullPage: true });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);

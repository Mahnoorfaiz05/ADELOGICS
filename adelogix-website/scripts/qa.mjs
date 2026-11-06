#!/usr/bin/env node
// QA: crawls every page of a running build, checks internal links, assets,
// console errors, horizontal overflow and heading structure at three
// viewports, and saves full-page screenshots.
// Usage: node scripts/qa.mjs [baseUrl=http://localhost:4321] [shotsDir=qa-shots]
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const shots = process.argv[3] || 'qa-shots';
const viewports = { desktop: { width: 1440, height: 900 }, tablet: { width: 834, height: 1112 }, mobile: { width: 390, height: 844 } };
const onlyShots = (process.env.SHOTS || '').split(',').filter(Boolean);

await mkdir(shots, { recursive: true });
const browser = await chromium.launch();
const results = [];
const seen = new Set(['/']);
const queue = ['/'];
const brokenLinks = [];

const ctx = await browser.newContext({ viewport: viewports.desktop });
while (queue.length) {
  const path = queue.shift();
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_TUNNEL_CONNECTION_FAILED/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('requestfailed', (r) => { if (r.url().startsWith(base)) failed.push(r.url()); });
  page.on('response', (r) => { if (r.url().startsWith(base) && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  const res = await page.goto(base + path, { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name=description]')?.content || '',
    h1: document.querySelectorAll('h1').length,
    links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
    emptyLinks: [...document.querySelectorAll('a')].filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').length,
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    brokenImgs: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    text: document.body.innerText,
  }));
  for (const href of info.links) {
    if (/^(mailto:|tel:|https?:)/.test(href) && !href.startsWith(base)) continue;
    const url = new URL(href, base + path);
    if (!url.href.startsWith(base)) continue;
    const p = url.pathname;
    if (url.hash && p === new URL(base + path).pathname) {
      const id = url.hash.slice(1);
      if (id && !(await page.$(`[id="${id}"]`))) brokenLinks.push(`${path} -> ${href} (missing anchor)`);
      continue;
    }
    if (/\.(xml|txt|png|jpg|svg|webmanifest)$/.test(p)) continue;
    if (!seen.has(p)) { seen.add(p); queue.push(p); }
  }
  const overflow = {};
  for (const [name, vp] of Object.entries(viewports)) {
    await page.setViewportSize(vp);
    await page.waitForTimeout(150);
    overflow[name] = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || getComputedStyle(el).position === 'fixed') return false;
        let p = el.parentElement;
        while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto') return false; p = p.parentElement; }
        return r.right > w + 1 || r.left < -1;
      }).slice(0, 3).map((el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''));
      return { scroll: document.documentElement.scrollWidth > w, offenders };
    });
    if (!onlyShots.length || onlyShots.includes(path)) {
      await page.evaluate(() => { document.querySelectorAll('[data-reveal]').forEach((e) => { e.style.transition = 'none'; e.classList.add('is-visible'); }); document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }); });
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
      await page.evaluate(() => Promise.all([...document.images].map((i) => (i.decode ? i.decode().catch(() => {}) : null))));
      await page.waitForTimeout(300);
      const flag = await page.$('[data-review-flag]');
      if (flag) await flag.evaluate((e) => (e.hidden = true));
      const fname = (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/[/.]/g, '_')) + `-${name}.png`;
      await page.screenshot({ path: `${shots}/${fname}`, fullPage: true });
    }
  }
  results.push({
    path, status: res.status(), title: info.title, descLen: info.desc.length, h1: info.h1,
    emptyLinks: info.emptyLinks, imgsNoAlt: info.imgsNoAlt, brokenImgs: info.brokenImgs, errors, failed,
    overflow, emDash: (info.text.match(/[—–]/g) || []).length,
  });
  await page.close();
}
// 404 check
const p404 = await ctx.newPage();
const r404 = await p404.goto(base + '/this-does-not-exist/');
results.push({ path: '/this-does-not-exist/ (expect 404)', status: r404.status(), title: await p404.title() });
await browser.close();

const problems = [];
for (const r of results) {
  if (r.path.includes('expect 404')) { if (r.status !== 404) problems.push(`404 handling returned ${r.status}`); continue; }
  if (r.status !== 200 && !r.path.endsWith('404.html')) problems.push(`${r.path}: HTTP ${r.status}`);
  if (r.h1 !== 1) problems.push(`${r.path}: ${r.h1} h1 elements`);
  if (r.descLen < 50 || r.descLen > 170) problems.push(`${r.path}: meta description length ${r.descLen}`);
  if (r.emptyLinks) problems.push(`${r.path}: ${r.emptyLinks} empty/# links`);
  if (r.imgsNoAlt) problems.push(`${r.path}: ${r.imgsNoAlt} images without alt`);
  if (r.brokenImgs.length) problems.push(`${r.path}: broken images ${r.brokenImgs.join(', ')}`);
  if (r.errors.length) problems.push(`${r.path}: console errors ${r.errors.join(' | ')}`);
  if (r.failed.length) problems.push(`${r.path}: failed requests ${r.failed.join(', ')}`);
  if (r.emDash) problems.push(`${r.path}: ${r.emDash} em/en dashes in visible text`);
  for (const [vp, o] of Object.entries(r.overflow)) if (o.scroll || o.offenders.length) problems.push(`${r.path}: horizontal overflow at ${vp} (${o.offenders.join(', ')})`);
}
problems.push(...brokenLinks);
await writeFile(`${shots}/qa-results.json`, JSON.stringify({ base, pages: results, problems }, null, 2));
console.log(`Checked ${results.length - 1} pages at ${Object.keys(viewports).length} viewports.`);
console.log(problems.length ? `\n${problems.length} problem(s):\n - ${problems.join('\n - ')}` : '\nNo problems found.');
process.exitCode = problems.length ? 1 : 0;

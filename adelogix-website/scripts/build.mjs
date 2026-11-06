#!/usr/bin/env node
// Adelogix static site build. Zero dependencies (Node 18+).
//
//   node scripts/build.mjs                  production build -> dist/
//   node scripts/build.mjs --review         review build with placeholders -> dist-review/
//   node scripts/build.mjs --portable       relative links (works from any folder / file://)
//   node scripts/build.mjs --out <dir>      custom output folder

import { mkdir, rm, writeFile, readFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '../site.config.mjs';
import { services, serviceCategories, servicesFaqs } from '../src/content/services.mjs';
import * as company from '../src/content/company.mjs';
import { setUrlContext } from '../src/templates/lib.mjs';
import { layout } from '../src/templates/layout.mjs';
import * as P from '../src/templates/pages.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const review = args.includes('--review');
const portable = args.includes('--portable');
const outArg = args.indexOf('--out');
const out = resolve(root, outArg > -1 ? args[outArg + 1] : review ? 'dist-review' : 'dist');

// Demo content (demo: true) is only published in the review build.
const isDemo = (x) => x && (x.demo || x.placeholder);
const keep = (list) => (review ? list : list.filter((x) => !isDemo(x)));
const keepOne = (x) => (x && (review || !isDemo(x)) ? x : null);

const site = {
  config,
  review,
  portable,
  version: Date.now().toString(36),
  services,
  serviceCategories,
  servicesFaqs,
  technologies: company.technologies,
  process: company.process,
  reasons: company.reasons,
  industries: company.industries,
  principles: company.principles,
  projects: keep(company.projects),
  testimonials: keep(company.testimonials),
  team: keep(company.team),
  // Production shows a logo only when its approved file exists.
  clients: review ? company.clients : company.clients.filter((c) => !isDemo(c) && c.file),
  heroMedia: keepOne(company.heroMedia),
  companyMessage: keepOne(company.companyMessage),
  story: keepOne(company.story),
};

// ------------------------------------------------------------- pages
// Pages are built lazily so URL context is right for each one.
const builders = [
  ['/', () => P.homePage(site)],
  ['/about/', () => P.aboutPage(site)],
  ['/services/', () => P.servicesPage(site)],
  ...services.map((s) => [`/services/${s.slug}/`, () => P.servicePage(site, s)]),
  ['/work/', () => P.workPage(site)],
  ...site.projects.map((p) => [`/work/${p.slug}/`, () => P.projectPage(site, p)]),
  ['/contact/', () => P.contactPage(site)],
  ['/privacy-policy/', () => P.privacyPage(site)],
  ['/terms/', () => P.termsPage(site)],
  ['/404.html', () => P.notFoundPage(site)],
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const written = [];
for (const [path, build] of builders) {
  setUrlContext(path, portable);
  const page = build();
  const file = path.endsWith('.html') ? join(out, path) : join(out, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, layout(site, page));
  written.push(page);
}

// ------------------------------------------------------------ assets
await mkdir(join(out, 'assets'), { recursive: true });
const css = (await Promise.all(['tokens', 'base', 'components', 'sections'].map((n) => readFile(join(root, 'src/styles', `${n}.css`), 'utf8')))).join('\n');
await writeFile(join(out, 'assets/site.css'), minifyCss(css));
await cp(join(root, 'src/scripts/site.js'), join(out, 'assets/site.js'));
await cp(join(root, 'src/assets/brand'), join(out, 'assets/brand'), { recursive: true });
if (review) await cp(join(root, 'src/assets/demo'), join(out, 'assets/demo'), { recursive: true });
for (const dir of ['work', 'clients', 'people']) {
  if (existsSync(join(root, 'src/assets', dir))) await cp(join(root, 'src/assets', dir), join(out, 'assets', dir), { recursive: true });
}
if (existsSync(join(root, 'src/assets/og-image.png'))) await cp(join(root, 'src/assets/og-image.png'), join(out, 'assets/og-image.png'));

// ---------------------------------------------- sitemap, robots, etc.
const base = config.siteUrl.replace(/\/$/, '');
const indexable = written.filter((p) => !p.noindex && p.path !== '/404.html');
await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${base}${p.path}</loc><changefreq>monthly</changefreq><priority>${p.path === '/' ? '1.0' : p.path.split('/').length > 3 ? '0.7' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
await writeFile(join(out, 'robots.txt'), review
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
await writeFile(join(out, 'site.webmanifest'), JSON.stringify({
  name: config.legalName, short_name: config.name, start_url: '/', display: 'standalone',
  background_color: '#F4F2EE', theme_color: '#0E0B18',
  icons: [{ src: '/assets/brand/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/brand/icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2));
// Netlify / Cloudflare Pages style headers and 404 handling
await writeFile(join(out, '_headers'), `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);

// ----------------------------------------------------------- report
const warnings = [];
const need = (cond, msg) => { if (!cond) warnings.push(msg); };
need(config.contact.email, 'contact.email is empty (CONTACT_EMAIL)');
need(config.contact.phone || config.contact.whatsapp, 'No phone or WhatsApp number (CONTACT_PHONE / CONTACT_WHATSAPP)');
need(config.contact.location, 'contact.location is empty (CONTACT_LOCATION)');
need(config.bookingUrl, 'bookingUrl is empty (BOOKING_URL): booking option hidden');
need(config.formEndpoint, 'formEndpoint is empty (FORM_ENDPOINT): the form will not send messages');
need(config.ga4Id, 'ga4Id is empty (GA4_ID): analytics disabled');
need(config.searchConsoleToken, 'searchConsoleToken is empty (GSC_TOKEN)');
need(Object.values(config.social).some(Boolean), 'No social profile links');
need(company.projects.some((p) => !isDemo(p)), 'No real projects: all 6 projects are demo content (hidden in production)');
need(company.testimonials.some((p) => !isDemo(p)), 'No real testimonials: sample feedback hidden in production');
need(company.team.some((p) => !isDemo(p)), 'No real team members: demo profiles hidden in production');
need(company.clients.some((c) => !isDemo(c) && c.file), 'No approved logo files (NextWys logo file needed): logo strip hidden in production');
need(!isDemo(company.heroMedia), 'Hero uses the demo reel: production shows the illustrated diagram until the company film is added');
need(!isDemo(company.story), 'Company story not supplied');
need(Object.values(company.technologies.items).filter((t) => t.confirmed).length > 6, 'Most technologies are unconfirmed: only confirmed ones are published');

console.log(`\n✔ ${review ? 'Review' : 'Production'} build: ${written.length} pages -> ${out}${portable ? ' (portable links)' : ''}`);
if (warnings.length) {
  console.log(`\n${warnings.length} item(s) need real information before launch:`);
  warnings.forEach((w) => console.log('  - ' + w));
}

function minifyCss(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*\n/g, '\n').replace(/^\s+/gm, '').trim() + '\n';
}

#!/usr/bin/env node
// Renders src/assets/og-image.png (1200x630) with Playwright. Run after
// changing the headline or logo: node scripts/og-image.mjs
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const logo = (await readFile(resolve(root, 'src/assets/brand/adelogix-logo-white.png'))).toString('base64');
const html = `<html><body style="margin:0;width:1200px;height:630px;background:#0E0B18;font-family:Inter,sans-serif;position:relative;overflow:hidden;color:#fff">
<div style="position:absolute;width:1100px;height:700px;left:420px;top:240px;background:radial-gradient(closest-side,rgba(123,73,158,.6),rgba(63,50,130,.3) 55%,transparent);filter:blur(40px)"></div>
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:radial-gradient(ellipse 70% 70% at 80% 50%,#000 10%,transparent 70%)"></div>
<div style="position:absolute;left:80px;top:72px"><img src="data:image/png;base64,${logo}" style="height:44px"></div>
<div style="position:absolute;left:80px;bottom:80px;width:900px">
<div style="font-size:76px;line-height:.98;letter-spacing:-.045em;font-weight:500">Software built around how your business really works.</div>
<div style="margin-top:28px;font:500 18px 'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.6)">Web · Mobile · SaaS · Business systems · AI</div>
</div></body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html);
await p.screenshot({ path: resolve(root, 'src/assets/og-image.png') });
await b.close();
console.log('Wrote src/assets/og-image.png');

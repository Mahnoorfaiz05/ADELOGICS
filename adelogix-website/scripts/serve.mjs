#!/usr/bin/env node
// Minimal static server for previewing a build: clean URLs, 404.html fallback.
// Usage: node scripts/serve.mjs [dir=dist] [port=4321]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const dir = resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || process.env.PORT || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(dir, url));
  if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch { /* fall through */ }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }).end(body);
  } catch {
    if (!url.endsWith('/') && !extname(url)) { res.writeHead(301, { Location: url + '/' }).end(); return; }
    const body = await readFile(join(dir, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(body);
  }
}).listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}`));

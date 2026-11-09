#!/usr/bin/env node
// Minimal static server for previewing a build: clean URLs, 404.html fallback.
// Usage: node scripts/serve.mjs [dir=dist] [port=4321]
import { createServer } from 'node:http';
import { readFile, stat, open } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const dir = resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || process.env.PORT || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

// Byte-range streaming so the hero video starts promptly and can be seeked.
async function sendFile(req, res, file) {
  const info = await stat(file);
  const type = types[extname(file)] || 'application/octet-stream';
  const total = info.size;
  const range = req.headers.range;
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (m && (m[1] || m[2])) {
    let start = m[1] ? Number(m[1]) : total - Number(m[2]);
    let end = m[1] && m[2] ? Number(m[2]) : total - 1;
    if (start < 0) start = 0;
    if (end >= total) end = total - 1;
    if (start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${total}` }).end();
      return;
    }
    const fh = await open(file);
    const stream = fh.createReadStream({ start, end });
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    });
    stream.pipe(res);
    stream.on('close', () => fh.close().catch(() => {}));
    return;
  }
  const body = await readFile(file);
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': total,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=3600',
  }).end(body);
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(dir, url));
  if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch { /* fall through */ }
  try {
    await sendFile(req, res, file);
  } catch {
    if (!url.endsWith('/') && !extname(url)) { res.writeHead(301, { Location: url + '/' }).end(); return; }
    const body = await readFile(join(dir, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(body);
  }
}).listen(port, '0.0.0.0', () => console.log(`Serving ${dir} at http://localhost:${port}`));

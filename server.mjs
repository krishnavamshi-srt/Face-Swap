// Tiny local web server (no dependencies). Files never leave your machine.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const MIME = { '.html': 'text/html;charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.wasm': 'application/wasm', '.css': 'text/css', '.task': 'application/octet-stream' };
const root = path.resolve('public');
const lan = process.argv.includes('--lan'); // let a phone on the same Wi-Fi open it
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(f, (e, d) => {
    if (e) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }).end(d);
  });
}).listen(3000, lan ? '0.0.0.0' : '127.0.0.1', () =>
  console.log('Open http://localhost:3000' + (lan ? '  (also reachable on your Wi-Fi)' : '')));

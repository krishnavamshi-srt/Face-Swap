// Saves the app and the face model on the first visit so it also works offline.
const V = 'face-swap-v2';
self.addEventListener('install', e => e.waitUntil(
  caches.open(V).then(c => c.addAll(['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'])).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== V) await caches.delete(k);
  await clients.claim();
})()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const c = await caches.open(V), hit = await c.match(e.request, { ignoreSearch: true });
    const same = new URL(e.request.url).origin === location.origin;
    const net = () => fetch(e.request).then(r => { if (r.ok && r.status === 200) c.put(e.request, r.clone()).catch(() => {}); return r; });
    if (hit) { if (same) e.waitUntil(net().catch(() => {})); return hit; }
    try { return await net(); } catch (err) { return Response.error(); }
  })());
});

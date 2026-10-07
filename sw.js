// Hoja de Ruta: guarda la app para abrirla sin conexión.
const CACHE = "hoja-de-ruta-v1";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "favicon.svg", "favicon-32.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Primero la red, para tener siempre la última versión; sin conexión, lo guardado.
  e.respondWith(fetch(e.request).then(r => {
    if (r && r.ok && new URL(e.request.url).origin === location.origin){ const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});

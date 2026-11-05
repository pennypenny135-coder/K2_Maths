/* 開心數學樂園 Service Worker — 離線開啟已載入的頁面與題目
   Happy Math Playground service worker — open loaded pages & questions offline */
const VERSION = "v1";
const CACHE = `happy-math-${VERSION}`;
const PAGES = ["/", "/k2", "/k3", "/quiz", "/report", "/rewards"];
const STATIC = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon.svg",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(STATIC.map((u) => cache.add(u).catch(() => {})));
      // 預先快取頁面及其 JS/CSS（題庫已打包在 JS 內）
      const assets = new Set();
      await Promise.all(
        PAGES.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "reload" });
            if (!res.ok) return;
            const copy = res.clone();
            await cache.put(url, copy);
            const html = await res.text();
            const re = /\/_next\/static\/[^"'\\\s)]+/g;
            let m;
            while ((m = re.exec(html))) assets.add(m[0]);
          } catch (e) {
            /* ignore */
          }
        }),
      );
      await Promise.all(
        [...assets].map((u) =>
          cache.add(u).catch(() => {
            /* ignore */
          }),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("happy-math-") && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // 頁面：網絡優先，失敗就用快取 / pages: network first, fall back to cache
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put(req, res.clone()).catch(() => {});
          return res;
        } catch (e) {
          const cache = await caches.open(CACHE);
          return (
            (await cache.match(req, { ignoreSearch: true })) ||
            (await cache.match("/")) ||
            new Response("Offline 離線中", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })
          );
        }
      })(),
    );
    return;
  }

  // 靜態資源：快取優先 / static assets: cache first
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch (e) {
        return hit || Response.error();
      }
    })(),
  );
});

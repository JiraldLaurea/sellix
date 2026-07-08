const CACHE_NAME = "sellix-static-v1";
const PRECACHE_URLS = [
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/icons/apple-touch-icon.png",
    "/favicon.ico",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

// Cache-first for static assets only; everything else (pages, API, auth,
// cart) always goes to the network so data stays fresh and correct.
self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    const isStaticAsset =
        url.origin === self.location.origin &&
        (url.pathname.startsWith("/icons/") ||
            url.pathname.startsWith("/_next/static/") ||
            url.pathname === "/favicon.ico");

    if (!isStaticAsset) return;

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                const responseClone = response.clone();
                caches
                    .open(CACHE_NAME)
                    .then((cache) => cache.put(request, responseClone));
                return response;
            });
        }),
    );
});

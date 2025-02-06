const CACHE_NAME = "5WS-Cache-v1";
const urlsToCache = ["/", "/index.html", "/style.css"];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("✅ 5WS Cache Opened");
            return cache.addAll(urlsToCache);
        }).catch(error => console.error("❌ Cache Open Failed: ", error))
    );
});

self.addEventListener("fetch", event => {
    console.log("🔍 Fetching:", event.request.url);
    
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log("✅ Cache Hit:", event.request.url);
                return response;
            }
            console.log("🌍 Network Request:", event.request.url);
            return fetch(event.request)
                .then(networkResponse => {
                    console.log("✅ Network Response Received:", event.request.url);
                    return networkResponse;
                })
                .catch(error => {
                    console.error("❌ Fetch Error:", error);
                    return new Response("Offline Mode: File Not Available", { status: 503 });
                });
        })
    );
});

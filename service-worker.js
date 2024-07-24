const CACHE_NAME = 'RMB_Cost-cache-v1'; // Versioned cache name
const urlsToCache = [
  '/RMB_Cost/',            // Cache the root (index.html)
  '/RMB_Cost/manifest.json',
  '/RMB_Cost/calcIcon.png',
  '/RMB_Cost/calcIcon2.png',
  // Add more URLs as needed (e.g., CSS, JS files)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Activate new service worker immediately
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName); // Delete old caches
        }
      })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
        .then((response) => {
          // Cache the new response if it's a valid request
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
          }
          return response;
        });
    })
  );
});

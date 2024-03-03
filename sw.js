const CACHE_VERSION = 'v2';
const CACHE_NAME = `temperature-converter-${CACHE_VERSION}`;
const GHPATH = '/microsoft-pwa-tutorial'

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      `${GHPATH}/`
      `${GHPATH}/index.html`,
      `${GHPATH}/base.css`,
      `${GHPATH}/converter.js`
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      const fetchResponse = await fetch(event.request);
      // Check if we received a valid response
      if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
        return fetchResponse;
      }

      // Clone the response as it's being used by cache.put()
      const responseToCache = fetchResponse.clone();
      await cache.put(event.request, responseToCache);
      
      return fetchResponse;
    } catch (error) {
      // If fetch fails and there's no cache available, return a fallback response
      console.error('Fetch failed:', error);
      return caches.match('/offline.html');
    }
  })());
});


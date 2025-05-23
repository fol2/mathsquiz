const CACHE_NAME = 'math-genius-v3-20250123';

// Files that should be pre-cached during the install step.  At runtime the
// service worker will also cache any built assets under /assets/ as they are
// requested.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/sounds/awesome.mp3',
  '/sounds/amazing.mp3',
  '/sounds/astonishing.mp3',
  '/sounds/level_up.mp3',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  // Force immediate activation
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_URLS);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete all old caches
        ...cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
        // Claim all clients immediately
        self.clients.claim()
      ]);
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Only handle same-origin requests for app shell or built assets
  if (url.origin === self.location.origin &&
      (url.pathname === '/' ||
       url.pathname === '/index.html' ||
       url.pathname.startsWith('/assets/') ||
       url.pathname.startsWith('/sounds/'))) {
    
    // For HTML files, always try network first
    if (url.pathname === '/' || url.pathname === '/index.html') {
      event.respondWith(
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          return caches.match(event.request);
        })
      );
    } else {
      // For assets, try cache first
      event.respondWith(
        caches.match(event.request).then((cached) => {
          if (cached) {
            return cached;
          }
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          }).catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
        })
      );
    }
  }
}); 
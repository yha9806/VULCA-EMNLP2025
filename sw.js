/**
 * Service Worker for VULCA Exhibition Platform
 * Implements caching strategies for offline support and faster repeat visits
 */

const CACHE_VERSION = 'vulca-v1';
const STATIC_CACHE = CACHE_VERSION + '-static';
const DYNAMIC_CACHE = CACHE_VERSION + '-dynamic';

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.min.css',
  '/styles/design-tokens.min.css',
  '/styles/portfolio-homepage.min.css',
  '/styles/components/unified-navigation.min.css',
  '/styles/components/dialogue-player.min.css',
  '/js/lang-manager.js',
  '/js/navigation-i18n.js',
  '/js/meta-i18n.js',
  '/assets/favicon.svg',
  '/assets/favicon.ico'
];

// Patterns for cache-first strategy (static assets)
const CACHE_FIRST_PATTERNS = [
  /\/styles\/.+\.min\.css/,
  /\/js\/.+\.min\.js/,
  /\/assets\/artworks-optimized\//,
  /\/assets\/.*\.(svg|png|jpg|jpeg|webp|gif|ico)$/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /cdn\.jsdelivr\.net/
];

// Patterns for network-first strategy (dynamic content)
const NETWORK_FIRST_PATTERNS = [
  /\.html$/,
  /\.json$/,
  /\/exhibitions\/.+\/data\//
];

/**
 * Install event - pre-cache static assets
 */
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Pre-cache complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => {
        console.error('[SW] Pre-cache failed:', err);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('vulca-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim(); // Take control immediately
      })
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine caching strategy
  if (shouldCacheFirst(url)) {
    event.respondWith(cacheFirst(request));
  } else if (shouldNetworkFirst(url)) {
    event.respondWith(networkFirst(request));
  } else {
    // Default: stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

/**
 * Check if URL should use cache-first strategy
 */
function shouldCacheFirst(url) {
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.href));
}

/**
 * Check if URL should use network-first strategy
 */
function shouldNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href));
}

/**
 * Cache-first strategy: Try cache, fallback to network
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached response, but update cache in background
    updateCache(request);
    return cachedResponse;
  }

  // Not in cache, fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first fetch failed:', error);
    return offlineFallback();
  }
}

/**
 * Network-first strategy: Try network, fallback to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Both network and cache failed
    if (request.headers.get('Accept')?.includes('text/html')) {
      return offlineFallback();
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Stale-while-revalidate: Return cache immediately, update in background
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        caches.open(DYNAMIC_CACHE)
          .then(cache => cache.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => cachedResponse || offlineFallback());

  return cachedResponse || fetchPromise;
}

/**
 * Update cache in background
 */
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silent fail - background update
  }
}

/**
 * Offline fallback response
 */
function offlineFallback() {
  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>离线 | VULCA</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0a0a0a;
          color: #f5f5f5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }
        .offline-container { max-width: 400px; }
        h1 { font-size: 2rem; margin-bottom: 1rem; color: #b85c3c; }
        p { opacity: 0.8; line-height: 1.6; }
        .retry-btn {
          margin-top: 2rem;
          padding: 0.75rem 2rem;
          background: #b85c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        .retry-btn:hover { background: #a04d32; }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1>您当前处于离线状态</h1>
        <p>无法连接到服务器。请检查您的网络连接后重试。</p>
        <p style="margin-top: 0.5rem;">You are currently offline. Please check your network connection.</p>
        <button class="retry-btn" onclick="location.reload()">重试 / Retry</button>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// Log SW lifecycle
console.log('[SW] Service Worker loaded');

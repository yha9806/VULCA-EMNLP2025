/**
 * Service Worker for VULCA Exhibition Platform
 * Implements caching strategies for offline support and faster repeat visits
 * Version: 1.1.0 - Simplified, no pre-cache to avoid 404 errors
 */

const CACHE_VERSION = 'vulca-v3';
const CACHE_NAME = CACHE_VERSION + '-cache';

// Patterns for cache-first strategy (static assets)
const CACHE_FIRST_PATTERNS = [
  /\.min\.css(\?|$)/,
  /\.min\.js(\?|$)/,
  /\/assets\/artworks/,
  /\.(svg|png|jpg|jpeg|webp|gif|ico)(\?|$)/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/
];

// Patterns to skip caching entirely
const SKIP_CACHE_PATTERNS = [
  /cdn\.jsdelivr\.net/,  // Let browser handle CDN caching
  /chrome-extension:/,
  /^chrome:/
];

/**
 * Install event - skip pre-caching, activate immediately
 */
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('vulca-') && name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip patterns that shouldn't be cached
  if (SKIP_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
    return;
  }

  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Cache-first for static assets
  if (shouldCacheFirst(url)) {
    event.respondWith(cacheFirst(request));
  }
  // Network-first for everything else (HTML, JSON, etc.)
  else {
    event.respondWith(networkFirst(request));
  }
});

/**
 * Check if URL should use cache-first strategy
 */
function shouldCacheFirst(url) {
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.href));
}

/**
 * Cache-first strategy
 */
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Cache-first failed:', error.message);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network-first strategy
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Both failed - return offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return new Response(offlineHTML(), {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

/**
 * Offline fallback HTML
 */
function offlineHTML() {
  return `<!DOCTYPE html>
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
      margin: 0;
    }
    .container { max-width: 400px; }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #b85c3c; }
    p { opacity: 0.8; line-height: 1.6; margin: 0.5rem 0; }
    button {
      margin-top: 2rem;
      padding: 0.75rem 2rem;
      background: #b85c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover { background: #a04d32; }
  </style>
</head>
<body>
  <div class="container">
    <h1>您当前处于离线状态</h1>
    <p>无法连接到服务器。请检查您的网络连接后重试。</p>
    <p>You are currently offline.</p>
    <button onclick="location.reload()">重试 / Retry</button>
  </div>
</body>
</html>`;
}

console.log('[SW] Service Worker loaded');

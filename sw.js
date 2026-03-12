const CACHE_NAME = 'sqlite-pwa-v1';
const ASSETS = [
  'index.html',
  'worker.js',
  'sqlite3.js',
  'sqlite3.wasm',
  'manifest.json'
];

// 安裝並快取檔案
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// 攔截請求，優先從快取讀取
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

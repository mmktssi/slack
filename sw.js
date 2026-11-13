// アプリとしてインストールできるようにするための最小限のサービスワーカー（常に最新ファイルを取得）
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));

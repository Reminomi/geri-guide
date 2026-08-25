const CACHE_NAME = 'geri-guide-v3';
const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-512-maskable.png',
  'tools/clinic-companion.html',
  'tools/ncd-diagnostic-algorithm.html',
  'tools/ncd-quick-reference.html',
  'tools/dementia-toolkit.html',
  'tools/cognitive-tests.html',
  'tools/pattern-summary.html',
  'tools/types-heatmap.html',
  'tools/expanded-heatmap.html',
  'tools/dementia-medications.html',
  'tools/falls-bone-health.html',
  'tools/deprescribing.html',
  'tools/frailty.html',
  'tools/delirium-4at.html',
  'tools/capacity-register.html',
  'tools/grand-round-roulette.html'
];

self.addEventListener('install', event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        PRECACHE.map(url => cache.add(url).catch(()=>{}))
      ))
      .then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', event=>{
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', event=>{
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then(cached=>{
      const network = fetch(req).then(res=>{
        if (res && res.ok){
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(()=> cached);
      return cached || network;
    })
  );
});

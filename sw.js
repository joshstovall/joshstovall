var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/img/logo/16.png',
    '/img/logo/32.png',
    '/img/logo/144.png',
    '/img/logo/152.png',
    '/img/logo/180.png',
    '/css/bootstrap.css',
  '/css/resume.css',
  '/css/theme.css',
  '/css/writing.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(async function() {
       try{
         var res = await fetch(event.request);
         var cache = await caches.open('cache');
         cache.put(event.request.url, res.clone());
         return res;
       }
       catch(error){
         return caches.match(event.request);
        }
      }());
  });
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.html",
    "/style.css",
    "/manifest.webmanifest",
    "/index.js",
    "/icons/icon_192x192.png",
    "/icons/icon_512x512.png"
  ];
  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log("cache open")
          return cache.addAll(FILES_TO_CACHE)
        })
    );
  });
  
  self.addEventListener("fetch", event => {
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cachedResponse => {
          return fetch(event.request)
          .then(response => {
            console.log(response)
            if (response.status === 200) {
              cache.put(event.request.url, response.clone())
            } 
            return response
          }) .catch(err => {
            return cache.match(event.request)
          }) 
        })
        .catch(err => {
          console.log(err)
        })
      );
      return;
    }
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request).then(function(response) {
          if (response) {
            return response;
          } else if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/");
          }
        });
      })
    );
  });
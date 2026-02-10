var cacheName = "v-155";

//self.addEventListener("install",
//    event => {
//        event.waitUntil(self.skipWaiting());
//    });

//self.addEventListener("activate",
//    event => {
//        event.waitUntil(self.clients.claim());
//    });

//self.addEventListener("fetch",
//    function(event) {
//        if (event.request.url.includes(".aspx"))
//            return;
//        if (event.request.url.includes(".png"))
//            return;
//        if (event.request.method === "POST")
//            return;
//        event.respondWith(
//            caches.open(cacheName).then(function(cache) {
//                return cache.match(event.request).then(function(response) {
//                    return response ||
//                        fetch(event.request).then(function(response) {
//                            cache.put(event.request.url, response.clone());
//                            return response;
//                        });
//                });
//            })
//        );
//    });
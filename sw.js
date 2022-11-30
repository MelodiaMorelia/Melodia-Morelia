const CACHE ='cache-3';
const CACHE_DINAMICO ='dinamico-1';
const CACHE_INMUTABLE ='INMUTABLE-1';

self.addEventListener('install', evento=>{
    const promesa =caches.open(CACHE)
    .then(cache=>{
 
    return cache.addAll([
    '/',
    '/index.html',
    '/shop-grid.html',
    '/shoping-cart.html',
    '/blog-details.html',
    '/blog-details2.html',
    '/contact.html',
    '/offline.html',
    '/img/blog/details/offline.jpg'
    

 ]);
 });
  
 const cacheInmutable = caches.open(CACHE_INMUTABLE)
 .then(cache=>{
 cache.add('css/bootstrap.min.css');
 });

 
 evento.waitUntil(Promise.all([promesa, cacheInmutable]));

});

self.addEventListener('activate',evento =>{
    const respuesta=caches.keys().then(keys =>{
        keys.forEach(key =>{
            if(key !== CACHE && key.includes('cache')){
                return caches.delete(key);
            }
        })
    })
    evento.waitUntil(respuesta); 
})

self.addEventListener('fetch', evento =>{

    console.log("pwticion");

    //Estrategia 2 - CACHE WITH NETWORK FALLBACK
    const respuesta=caches.match(evento.request)
    .then(res=>{
    
    if (res) return res;
    
    console.log('No existe', evento.request.url);
   
    return fetch(evento.request)
    .then(resWeb=>{
    caches.open(CACHE_DINAMICO)
    .then(cache=>{
    
    cache.put(evento.request,resWeb);
    
    limpiarCache(CACHE_DINAMICO,60);
})

   return resWeb.clone();

});
    })

    .catch(err=> {
        console.log("errororr");
        if(evento.request.headers.get('accept').includes('text/html')){
        console.log("entro");
        return caches.match('offline.html');
        } else {
        return caches.match('offline.jpg');
        }
        });
    
    evento.respondWith(respuesta);
   });

   
function limpiarCache(nombreCache, numeroItems){
    
    caches.open(nombreCache)
    .then(cache=>{
    return cache.keys()
    
    .then(keys=>{
    
    if (keys.length>numeroItems){
    cache.delete(keys[0])
    .then(limpiarCache(nombreCache, numeroItems));
    }

    });
 });
}

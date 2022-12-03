// Espacios de caché.
const CACHE ='cache-3';
const CACHE_DINAMICO ='dinamico-1';
const CACHE_INMUTABLE ='INMUTABLE-1';

//Proceso de creación del espacio "CACHE" donde 
//deben introducirse los archivos más importantes
//para la visualización de la aplicación.
self.addEventListener('install', evento=>{
    const promesa =caches.open(CACHE)
    .then(cache=>{
 
    return cache.addAll([
    
    'index.html',
    'shop-grid.html',
    'blog.html',
    'blog-details.html',
    'blog-details2.html',
    'contact.html',
    'offline.html',
    'img/blog/details/offline.jpg',
    '50.html',
    '60.html',
    '70.html',
    '80.html',
    '90.html',
    '2000.html'

    

 ]);
 });
  
// Espacio para aquellos archivos inmutables, es decir,
// que no deben modificarse.
 const cacheInmutable = caches.open(CACHE_INMUTABLE)
 .then(cache=>{
 cache.add('css/bootstrap.min.css'); 
 });

 //La instalación esperará hasta que las promesas se cumplan.
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
    
    // Toma el archivo si existe en caché.
    if (res) return res;
    
    //De no encontrarlo en caché, buscará en la web.
    console.log('No existe', evento.request.url);
   
    //Se procesa la respuesta a la petición.
    return fetch(evento.request)
    .then(resWeb=>{

    //Se llama a CACHE DINAMICO.
    caches.open(CACHE_DINAMICO)
    .then(cache=>{
    
    //Sube el archivo descargado de la web.
    cache.put(evento.request,resWeb);
    
    //Se asegura de mantener limitada la cantidad
    //de almacenamiento del caché dinamico.
    limpiarCache(CACHE_DINAMICO,80);
})

   //Retorna el archivo para visualizar la pagina.
   return resWeb.clone();

});
    })

    //Atrapa los errores.
    .catch(err=> {
        
        //Si identifica un error en html, retorna la pantalla de offline
        //y/o la imagen.
        if(evento.request.headers.get('accept').includes('text/html')){
        
        return caches.match('offline.html');
        } else {
        return caches.match('offline.jpg');
        }
        });
    

    evento.respondWith(respuesta);
   });

//Identifica el nombre del espacio de cache que se limpiará
// y el numero de archivos mínimos que pueden almacenarse.   
function limpiarCache(nombreCache, numeroItems){
    
    //Se abre caché.
    caches.open(nombreCache)
    .then(cache=>{

    //Se recupera el arreglo de archivos existentes en caché.    
    return cache.keys()
    
    .then(keys=>{
    
    //Eliminará todos aquellos archivos que superen el espacio
    //previamente determinado del más antiguo al más nuevo.
    if (keys.length>numeroItems){
    cache.delete(keys[0])
    .then(limpiarCache(nombreCache, numeroItems));
    }

    });
 });
}

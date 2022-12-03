// Se obtiene url del servidor.
var url=window.location.href;

//Se define que el sw.js se encuentra
//en el repositorio.
var ubicacionSw='/Melodia-Morelia/sw.js';

if ( navigator.serviceWorker ) {
    if(url.includes('localhost')){
        ubicacionSw='/sw.js';
    }

    navigator.serviceWorker.register(ubicacionSw);

}
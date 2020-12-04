//imports

importScripts('js/sw_utils.js');


const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';



const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'images/logo.png',
    'images/background/01.jpg',
    'images/background/favicon.ico',
    'js/app.js',
    'js/sw_utils.js'
];

const APP_SHELL_INMUTABLE = [
    'js/jquery-1.11.0.min.js',
    'js/scroll.js',
    'js/jquery.countdown.js',
    'js/countdown.js',
    'js/supersized.3.2.7.js',
    'js/images.js',
    'js/form.js',
    'css/bootstrap.css',
    'css/bootstrap-theme.css',
    'css/layout.css',
    'css/background.css',
    'css/font-awesome.min.css'
];


self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll(APP_SHELL)
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE)
    });

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil(respuesta);

});


self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        if (res) {

            return res;

        } else {
            return fetch(e.request).then(newResp => {

                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newResp);

            });
        }

    });
    e.respondWith(respuesta);
});
/**
 * Service Worker for HomeScraper
 * Enables offline support and push notifications
 */

const CACHE_NAME = 'homescraper-v1';
const urlsToCache = [
    '/homescraper/frontend/index.html',
    '/homescraper/frontend/css/styles.css',
    '/homescraper/frontend/js/app.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('Cache installation failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache on network error
                return caches.match(event.request)
                    .then(response => {
                        return response || new Response(
                            'Offline - Page not available',
                            { status: 503, statusText: 'Service Unavailable', headers: new Headers({ 'Content-Type': 'text/plain' }) }
                        );
                    });
            })
    );
});

// Handle push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New property listing available!',
        badge: '/homescraper/frontend/assets/badge.png',
        icon: '/homescraper/frontend/assets/icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('HomeScraper Alert', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.open('/homescraper/frontend/')
    );
});

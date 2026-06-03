const CACHE_VERSION = 'v1'

const CACHE_NAME = `sapper-cat-cache-${CACHE_VERSION}`

const STATIC_URLS: readonly string[] = [
  '/',
  '/index.html',

  '/fonts/nunito-cyrillic-ext.woff2',
  '/fonts/nunito-cyrillic.woff2',
  '/fonts/nunito-vietnamese.woff2',
  '/fonts/nunito-latin-ext.woff2',
  '/fonts/nunito-latin.woff2',
  '/fonts/fredoka.woff2',

  '/icons/logo.svg',
  '/icons/IconTopic.svg',
  '/icons/Cup.svg',
  '/icons/Fish.svg',

  '/img/signup-icon.png',
  '/img/not-found-icon.png',
  '/img/server-error-icon.png',
  '/img/rating1-icon.png',
  '/img/rating2-icon.png',
  '/img/rating3-icon.png',
]

const sw = self as unknown as ServiceWorkerGlobalScope

sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll([...STATIC_URLS]))
  )
  sw.skipWaiting()
})

sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      )
      .then(() => sw.clients.claim())
  )
})

export {}

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

const isNavigationRequest = (request: Request) =>
  request.mode === 'navigate' ||
  request.headers.get('accept')?.includes('text/html') === true

const isSameOrigin = (request: Request) => {
  try {
    return new URL(request.url).origin === sw.location.origin
  } catch {
    return false
  }
}

const shouldCacheResponse = (request: Request, response: Response) =>
  response.ok && response.type === 'basic' && isSameOrigin(request)

const putInCache = async (request: Request, response: Response) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}

const networkFirstWithCacheFallback = async (
  request: Request
): Promise<Response> => {
  try {
    const response = await fetch(request)

    if (shouldCacheResponse(request, response)) {
      void putInCache(request, response.clone())
    }

    return response
  } catch {
    const cached = await caches.match(request)

    if (cached) {
      return cached
    }

    if (isNavigationRequest(request)) {
      const shell = await caches.match('/index.html')

      if (shell) {
        return shell
      }
    }

    throw new Error(`Offline and no cache for ${request.url}`)
  }
}

sw.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(networkFirstWithCacheFallback(event.request))
})

export {}

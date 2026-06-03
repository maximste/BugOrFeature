/// <reference lib="webworker" />

type PrecacheManifestEntry = {
  url: string
  revision: string | null
}

type SwScope = ServiceWorkerGlobalScope & {
  __WB_MANIFEST: PrecacheManifestEntry[]
}

const CACHE_VERSION = 'v3'

const CACHE_NAME = `sapper-cat-cache-${CACHE_VERSION}`

const sw = self as unknown as SwScope

// self.__WB_MANIFEST — точка injectManifest (vite-plugin-pwa подставляет массив при сборке)
// @ts-expect-error плейсхолдер до сборки; после build здесь литерал массива
const WB_MANIFEST: PrecacheManifestEntry[] = self.__WB_MANIFEST

const precacheUrls = (): string[] => [
  ...new Set(WB_MANIFEST.map(entry => entry.url)),
]

sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(precacheUrls()))
      .then(() => sw.skipWaiting())
  )
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

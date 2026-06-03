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

export { CACHE_NAME, STATIC_URLS }

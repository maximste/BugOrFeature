import type { RequestHandler } from 'express'
/** Хост API Яндекс Практикума (аватары и ресурсы). */
export declare const PRACTICUM_ORIGIN = 'https://ya-praktikum.tech'
/** Разрешённый origin для OAuth-редиректов через формы. */
export declare const YANDEX_OAUTH_ORIGIN = 'https://oauth.yandex.ru'
export declare const CSP_HEADER = 'Content-Security-Policy'
export type CspBuildOptions = {
  nonce: string
  isDev: boolean
  apiOrigin?: string | null
  clientPort?: string | number
}
export declare const generateCspNonce: () => string
export declare const parseOrigin: (url: string | undefined) => string | null
/** Собирает значение заголовка Content-Security-Policy. */
export declare const buildCspHeaderValue: ({
  nonce,
  isDev,
  apiOrigin,
  clientPort,
}: CspBuildOptions) => string
/** Упрощённая политика для yarn dev:spa (Vite без SSR). */
export declare const buildDevSpaCspHeaderValue: (
  apiOrigin?: string | null,
  clientPort?: string | number
) => string
export declare const injectScriptNonces: (html: string, nonce: string) => string
export type CreateCspMiddlewareOptions = {
  isDev: boolean
  apiOrigin?: string | null
  clientPort?: string | number
}
export declare const createCspMiddleware: ({
  isDev,
  apiOrigin,
  clientPort,
}: CreateCspMiddlewareOptions) => RequestHandler

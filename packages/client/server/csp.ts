import { randomBytes } from 'crypto'
import type { RequestHandler } from 'express'

/** Хост API Яндекс Практикума (аватары и ресурсы). */
export const PRACTICUM_ORIGIN = 'https://ya-praktikum.tech'

/** Разрешённый origin для OAuth-редиректов через формы. */
export const YANDEX_OAUTH_ORIGIN = 'https://oauth.yandex.ru'

export const CSP_HEADER = 'Content-Security-Policy'

export type CspBuildOptions = {
  nonce: string
  isDev: boolean
  apiOrigin?: string | null
  clientPort?: string | number
}

export const generateCspNonce = (): string => randomBytes(16).toString('base64')

export const parseOrigin = (url: string | undefined): string | null => {
  if (!url) {
    return null
  }

  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

/** Собирает значение заголовка Content-Security-Policy. */
export const buildCspHeaderValue = ({
  nonce,
  isDev,
  apiOrigin,
  clientPort,
}: CspBuildOptions): string => {
  const scriptSrc = ["'self'", `'nonce-${nonce}'`]

  if (isDev) {
    // Vite HMR и dev-инструменты
    scriptSrc.push("'unsafe-eval'")
  }

  const connectSrc = new Set<string>(["'self'", PRACTICUM_ORIGIN])

  if (apiOrigin) {
    connectSrc.add(apiOrigin)
  }

  if (isDev && clientPort) {
    connectSrc.add(`ws://localhost:${clientPort}`)
    connectSrc.add(`wss://localhost:${clientPort}`)
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    `img-src 'self' data: blob: ${PRACTICUM_ORIGIN}`,
    `connect-src ${[...connectSrc].join(' ')}`,
    "media-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    `form-action 'self' ${YANDEX_OAUTH_ORIGIN}`,
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
  ]

  return directives.join('; ')
}

/** Упрощённая политика для yarn dev:spa (Vite без SSR). */
export const buildDevSpaCspHeaderValue = (
  apiOrigin?: string | null,
  clientPort?: string | number
): string => {
  const connectSrc = new Set<string>(["'self'", PRACTICUM_ORIGIN])

  if (apiOrigin) {
    connectSrc.add(apiOrigin)
  }

  if (clientPort) {
    connectSrc.add(`ws://localhost:${clientPort}`)
    connectSrc.add(`wss://localhost:${clientPort}`)
  }

  return [
    "default-src 'self'",
    // unsafe-inline нужен для inline module preamble React Refresh в dev:spa
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    `img-src 'self' data: blob: ${PRACTICUM_ORIGIN}`,
    `connect-src ${[...connectSrc].join(' ')}`,
    "media-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    `form-action 'self' ${YANDEX_OAUTH_ORIGIN}`,
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
  ].join('; ')
}

export const injectScriptNonces = (html: string, nonce: string): string =>
  html.replace(/<script(?![^>]*\snonce=)/gi, `<script nonce="${nonce}"`)

export type CreateCspMiddlewareOptions = {
  isDev: boolean
  apiOrigin?: string | null
  clientPort?: string | number
}

export const createCspMiddleware =
  ({
    isDev,
    apiOrigin,
    clientPort,
  }: CreateCspMiddlewareOptions): RequestHandler =>
  (_req, res, next) => {
    const nonce = generateCspNonce()

    res.locals.cspNonce = nonce
    res.setHeader(
      CSP_HEADER,
      buildCspHeaderValue({ nonce, isDev, apiOrigin, clientPort })
    )
    next()
  }

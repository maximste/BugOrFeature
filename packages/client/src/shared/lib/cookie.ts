/**
 * Работа с cookie в браузере через document.cookie.
 *
 * Сессия авторизации (authCookie/uuid) выставляется бэкендом; JS может не видеть HttpOnly-cookie.
 *
 * Только браузер: на сервере (SSR) document нет — getCookie вернёт undefined.
 */

export const getCookie = (name: string) => {
  // SSR: в Node нет window/document — не падаем, просто «cookie нет»
  if (typeof document === 'undefined') {
    return undefined
  }

  // document.cookie — одна строка: "token=abc; theme=dark"
  const prefix = `${name}=`
  const row = document.cookie.split('; ').find(part => part.startsWith(prefix))

  if (!row) {
    return undefined
  }

  // decodeURIComponent: значения часто в URL-кодировке (%D0%BF...)
  return decodeURIComponent(row.slice(prefix.length))
}

/** Параметры при записи cookie */
type SetCookieOptions = {
  /** Срок жизни в секундах */
  maxAge?: number
  /** На каких путях сайта доступна cookie; "/" — весь сайт */
  path?: string
}

export const setCookie = (
  name: string,
  value: string,
  { maxAge, path = '/' }: SetCookieOptions = {}
) => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; path=${path}`

  if (maxAge != null) {
    cookie += `; max-age=${maxAge}`
  }

  document.cookie = cookie
}

export const removeCookie = (name: string, path = '/') => {
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0`
}

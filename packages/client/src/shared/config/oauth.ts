/** Базовый URL авторизации Яндекс ID */
export const YANDEX_OAUTH_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize'

/**
 * redirect_uri после OAuth.
 * Локально — http://localhost:3000/oauth/, на стенде — {origin}/oauth/
 */
export const getYandexOAuthRedirectUri = (): string => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/oauth/'
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/oauth/`
  }

  return ''
}

/** URL редиректа на страницу авторизации Яндекса (формат из задания) */
export const buildYandexOAuthAuthorizeUrl = (
  clientId: string,
  redirectUri: string
): string =>
  `${YANDEX_OAUTH_AUTHORIZE_URL}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

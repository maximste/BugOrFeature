import './client.d'

/**
 * Адрес API из .env (EXTERNAL_SERVER_URL) — для сервера и SSR.
 * На клиенте для axios используйте API_FETCH_BASE_URL.
 */
export const API_BASE_URL = __EXTERNAL_SERVER_URL__

/**
 * База URL для fetch в браузере. Задаётся в vite.config.ts:
 * в dev (yarn dev:spa) — пустая строка, пути /auth/* идут через прокси Vite;
 * в production-сборке — тот же хост, что EXTERNAL_SERVER_URL.
 */
export const API_FETCH_BASE_URL = __API_FETCH_BASE_URL__

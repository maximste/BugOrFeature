import { ApiError } from '@/shared/api'
import { toProfileError } from '@/shared/profile'

export type ProfileLoadError = {
  message: string
  showSignInHint: boolean
}

export const isBrowserOffline = () =>
  typeof navigator !== 'undefined' && !navigator.onLine

const isNetworkFailure = (err: unknown): boolean => {
  if (isBrowserOffline()) {
    return true
  }

  if (err instanceof Error && err.message === 'Network Error') {
    return true
  }

  return false
}

export const toProfileLoadError = (err: unknown): ProfileLoadError => {
  if (isNetworkFailure(err)) {
    return {
      message:
        'Нет подключения к интернету. Если вы уже открывали профиль онлайн, обновите страницу — данные могут подтянуться из кеша.',
      showSignInHint: false,
    }
  }

  if (err instanceof ApiError && err.status === 401) {
    return {
      message: err.reason ?? err.message,
      showSignInHint: true,
    }
  }

  return {
    message: err instanceof Error ? err.message : toProfileError(err),
    showSignInHint: true,
  }
}

import { useAuth } from '@/app/providers'

export const AUTH_TARGET = {
  PRIVATE: 'private',
  GUEST: 'guest',
} as const

type AuthTarget = (typeof AUTH_TARGET)[keyof typeof AUTH_TARGET]

/** Клиентский fallback для SPA-навигации; основная проверка — на бэкенде (SSR + API). */
export const useRequireAuth = (target: AuthTarget = AUTH_TARGET.PRIVATE) => {
  const { isAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return { isAuthenticated: false, redirect: null, pending: true }
  }

  let redirect: string | null = null

  if (target === AUTH_TARGET.PRIVATE && !isAuthenticated) {
    redirect = '/signin'
  } else if (target === AUTH_TARGET.GUEST && isAuthenticated) {
    redirect = '/'
  }

  return { isAuthenticated, redirect, pending: false }
}

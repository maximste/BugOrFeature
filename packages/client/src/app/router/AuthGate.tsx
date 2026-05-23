import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/app/providers'

const GUEST_ONLY_PATHS = ['/signin', '/signup']

const normalizePathname = (pathname: string) => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

const resolveAuthRedirect = (
  pathname: string,
  isAuthenticated: boolean
): string | null => {
  const path = normalizePathname(pathname)
  const isGuestOnly = GUEST_ONLY_PATHS.includes(path)

  if (!isAuthenticated && !isGuestOnly) {
    return '/signin'
  }

  if (isAuthenticated && isGuestOnly) {
    return '/'
  }

  return null
}

/**
 * Защита роутов по флагу isAuthenticated из AuthProvider.
 * Гость: только /signin и /signup; остальное → редирект на /signin.
 */
export const AuthGate = () => {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const redirect = resolveAuthRedirect(pathname, isAuthenticated)

  if (redirect != null) {
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

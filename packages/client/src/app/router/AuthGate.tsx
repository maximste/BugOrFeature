import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { AUTH_TARGET, useRequireAuth } from '@/shared/hooks'

const GUEST_ONLY_PATHS = ['/signin', '/signup', '/oauth']

const normalizePathname = (pathname: string) => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export const AuthGate = () => {
  const { pathname } = useLocation()
  const path = normalizePathname(pathname)
  const isGuestOnly = GUEST_ONLY_PATHS.includes(path)

  const { redirect } = useRequireAuth(
    isGuestOnly ? AUTH_TARGET.GUEST : AUTH_TARGET.PRIVATE
  )

  if (redirect != null) {
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

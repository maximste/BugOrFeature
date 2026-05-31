import { Outlet, useLocation } from 'react-router-dom'

import { useRequireAuth } from '@/shared/hooks'

const GUEST_ONLY_PATHS = ['/signin', '/signup']

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

  useRequireAuth(isGuestOnly ? 'guest' : 'private')

  return <Outlet />
}

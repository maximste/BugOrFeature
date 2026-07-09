import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { AUTH_TARGET, useRequireAuth } from '@/shared/hooks'
import {
  getPageAuthRequirement,
  normalizePathname,
} from '@/shared/config/authRoutes'

export const AuthGate = () => {
  const { pathname } = useLocation()
  const path = normalizePathname(pathname)
  const requirement = getPageAuthRequirement(path)

  const { redirect } = useRequireAuth(
    requirement === 'guest' ? AUTH_TARGET.GUEST : AUTH_TARGET.PRIVATE
  )

  if (requirement === 'none') {
    return <Outlet />
  }

  if (redirect != null) {
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

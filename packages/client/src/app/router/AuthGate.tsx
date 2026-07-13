import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Center, Spinner } from '@chakra-ui/react'

import { AUTH_TARGET, useRequireAuth } from '@/shared/hooks'
import {
  getPageAuthRequirement,
  normalizePathname,
} from '@/shared/config/authRoutes'

export const AuthGate = () => {
  const { pathname } = useLocation()
  const path = normalizePathname(pathname)
  const requirement = getPageAuthRequirement(path)

  const { redirect, pending } = useRequireAuth(
    requirement === 'guest' ? AUTH_TARGET.GUEST : AUTH_TARGET.PRIVATE
  )

  if (requirement === 'none') {
    return <Outlet />
  }

  if (pending) {
    return (
      <Center minH="50vh">
        <Spinner size="lg" />
      </Center>
    )
  }

  if (redirect != null) {
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

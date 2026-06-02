import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/app/providers'

export const AUTH_TARGET = {
  PRIVATE: 'private',
  GUEST: 'guest',
} as const

type AuthTarget = (typeof AUTH_TARGET)[keyof typeof AUTH_TARGET]

export const useRequireAuth = (target: AuthTarget = AUTH_TARGET.PRIVATE) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (target === AUTH_TARGET.PRIVATE && !isAuthenticated) {
      navigate('/signin', { replace: true })
    } else if (target === AUTH_TARGET.GUEST && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, target, navigate])

  return { isAuthenticated }
}

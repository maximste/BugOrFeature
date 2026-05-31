import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/app/providers'

type AuthTarget = 'private' | 'guest'

export const useRequireAuth = (target: AuthTarget = 'private') => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (target === 'private' && !isAuthenticated) {
      navigate('/signin', { replace: true })
    } else if (target === 'guest' && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, target, navigate])

  return { isAuthenticated }
}

import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import {
  fetchAuthUser,
  selectAuthStatus,
  useDispatch,
  useSelector,
} from '@/app/store'
import { normalizePathname } from '@/shared/config/authRoutes'

type AuthProviderProps = {
  children: ReactNode
}

/** Запрашивает сессию у бэкенда при первом рендере (если SSR не предзагрузил user). */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch()
  const status = useSelector(selectAuthStatus)
  const { pathname } = useLocation()
  const path = normalizePathname(pathname)
  // /oauth сам обменивает code и загружает user — ранний fetch даст 401
  const skipAutoFetch = path === '/oauth'

  useEffect(() => {
    if (status === 'idle' && !skipAutoFetch) {
      dispatch(fetchAuthUser())
    }
  }, [dispatch, status, skipAutoFetch])

  return <>{children}</>
}

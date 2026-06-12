import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/app/providers'
import { clearAuth, useDispatch } from '@/app/store'
import { logout } from '@/shared/auth'

import styles from './LogoutButton.module.scss'

export const LogoutButton = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { refreshAuth } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleClick = async () => {
    if (loggingOut) {
      return
    }

    setLoggingOut(true)

    try {
      await logout()
      dispatch(clearAuth())
      refreshAuth()
      navigate('/signin', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <button
      type="button"
      className={styles.root}
      onClick={handleClick}
      disabled={loggingOut}>
      {loggingOut ? 'Выход…' : 'Logout'}
    </button>
  )
}

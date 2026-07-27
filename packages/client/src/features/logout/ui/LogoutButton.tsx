import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearAuth, useDispatch } from '@/app/store'
import { logout } from '@/shared/auth'
import { Button } from '@/shared/ui/button'
import { useColorMode } from '@/app/providers'

export const LogoutButton = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loggingOut, setLoggingOut] = useState(false)

  const { setColorMode } = useColorMode()

  const handleClick = async () => {
    if (loggingOut) {
      return
    }

    setLoggingOut(true)

    try {
      await logout()
      dispatch(clearAuth())
      navigate('/signin', { replace: true })
    } finally {
      setLoggingOut(false)
      setColorMode('light')
    }
  }

  return (
    <Button
      type="button"
      bg="cyan"
      fontSize="16px "
      onClick={handleClick}
      disabled={loggingOut}>
      {loggingOut ? 'Выход…' : 'Выйти'}
    </Button>
  )
}

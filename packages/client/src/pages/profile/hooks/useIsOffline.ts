import { useEffect, useState } from 'react'

import { isBrowserOffline } from '../model/profileLoadError'

export const useIsOffline = () => {
  const [offline, setOffline] = useState(isBrowserOffline)

  useEffect(() => {
    const sync = () => setOffline(isBrowserOffline())

    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)

    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  return offline
}

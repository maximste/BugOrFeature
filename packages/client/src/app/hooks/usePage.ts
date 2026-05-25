import { useEffect } from 'react'

import { useDispatch, useSelector, useStore } from '@/app/store'
import {
  selectPageHasBeenInitializedOnServer,
  setPageHasBeenInitializedOnServer,
} from '@/app/ssr'
import type { PageInitArgs, PageInitContext } from '@/app/routes'
import { getCookie } from '@/shared/lib/cookie'
import { TOKEN_COOKIE } from '@/shared/auth'

const createContext = (): PageInitContext => ({
  clientToken: getCookie(TOKEN_COOKIE),
})

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown>
}

export const usePage = ({ initPage }: PageProps) => {
  const dispatch = useDispatch()
  const pageHasBeenInitializedOnServer = useSelector(
    selectPageHasBeenInitializedOnServer
  )
  const store = useStore()

  useEffect(() => {
    if (pageHasBeenInitializedOnServer) {
      dispatch(setPageHasBeenInitializedOnServer(false))
      return
    }
    initPage({ dispatch, state: store.getState(), ctx: createContext() })
  }, [])
}

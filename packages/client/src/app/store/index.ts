import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  TypedUseSelectorHook,
  useStore as useStoreBase,
} from 'react-redux'

import { rootReducer } from './rootReducer'
import { setupStore } from './setupStore'

declare global {
  interface Window {
    APP_INITIAL_STATE: RootState
  }
}

export const store = setupStore(
  typeof window === 'undefined' ? undefined : window.APP_INITIAL_STATE
)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const reducer = rootReducer

export const useDispatch: () => AppDispatch = useDispatchBase
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase
export const useStore: () => typeof store = useStoreBase

export {
  fetchAuthUser,
  setUser,
  clearAuth,
  selectAuthUser,
  selectAuthStatus,
  selectIsAuthUserLoading,
  selectIsAuthenticated,
} from './authSlice'

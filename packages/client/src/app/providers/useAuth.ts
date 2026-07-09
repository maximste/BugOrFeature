import {
  fetchAuthUser,
  selectAuthStatus,
  selectIsAuthenticated,
  useDispatch,
  useSelector,
} from '@/app/store'

export const useAuth = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const status = useSelector(selectAuthStatus)
  const isAuthLoading = status === 'idle' || status === 'loading'

  const refreshAuth = () => {
    dispatch(fetchAuthUser())
  }

  return { isAuthenticated, isAuthLoading, refreshAuth }
}

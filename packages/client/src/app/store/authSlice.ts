import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { UserProfile } from '@/entities/user'
import { getAuthUser } from '@/shared/api'

export interface AuthState {
  user: UserProfile | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
}

export const fetchAuthUser = createAsyncThunk(
  'auth/fetchUser',
  () => getAuthUser(),
  {
    condition: (_, { getState }) => {
      const { status } = (getState() as RootState).auth
      return status !== 'loading'
    },
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<UserProfile>) => {
      state.user = payload
      state.status = 'succeeded'
    },
    clearAuth: state => {
      state.user = null
      state.status = 'idle'
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuthUser.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchAuthUser.fulfilled, (state, { payload }) => {
        state.user = payload
        state.status = 'succeeded'
      })
      .addCase(fetchAuthUser.rejected, state => {
        state.user = null
        state.status = 'failed'
      })
  },
})

export const { setUser, clearAuth } = authSlice.actions

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectIsAuthUserLoading = (state: RootState) =>
  state.auth.status === 'loading'
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.user != null

export default authSlice.reducer

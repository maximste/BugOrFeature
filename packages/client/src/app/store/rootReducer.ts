import { combineReducers } from 'redux'

import { ssrReducer } from '../ssr'

import authReducer from './authSlice'

export const rootReducer = combineReducers({
  ssr: ssrReducer,
  auth: authReducer,
})

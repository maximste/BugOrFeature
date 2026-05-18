import { combineReducers } from 'redux'

import { ssrReducer } from '../ssr'

export const rootReducer = combineReducers({
  ssr: ssrReducer,
})

import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from './rootReducer'

export function setupStore(
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

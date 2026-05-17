import type { ComponentType } from 'react'

import type { AppDispatch, RootState } from '@/app/store'
import { MainPage, initMainPage } from '@/pages/main'
import { initNotFoundPage, NotFoundPage } from '@/pages/not-found'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export type AppRoute = {
  path: string
  Component: ComponentType
  fetchData: (args: PageInitArgs) => Promise<unknown>
}

export const routes: AppRoute[] = [
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]

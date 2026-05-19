import type { RouteObject } from 'react-router-dom'

import type { AppDispatch, RootState } from '@/app/store'
import { MainLayout } from '@/app/layouts'
import { ForumPage, initForumPage } from '@/pages/forum'
import {
  ForumTopicNewPage,
  initForumTopicNewPage,
} from '@/pages/forum-topic-new'
import { MainPage, initMainPage } from '@/pages/main'
import { initNotFoundPage, NotFoundPage } from '@/pages/not-found'
import { initServerErrorPage, ServerErrorPage } from '@/pages/server-error'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export type AppRouteObject = RouteObject & {
  fetchData?: (args: PageInitArgs) => Promise<unknown>
  children?: AppRouteObject[]
}

export const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
        fetchData: initMainPage,
      },
      {
        path: 'forum/new',
        element: <ForumTopicNewPage />,
        fetchData: initForumTopicNewPage,
      },
      {
        path: 'forum',
        element: <ForumPage />,
        fetchData: initForumPage,
      },
    ],
  },
  {
    path: '500',
    element: <ServerErrorPage />,
    fetchData: initServerErrorPage,
  },
  {
    path: '*',
    element: <NotFoundPage />,
    fetchData: initNotFoundPage,
  },
]

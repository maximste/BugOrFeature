import type { RouteObject } from 'react-router-dom'

import type { AppDispatch, RootState } from '@/app/store'
import { MainLayout } from '@/app/layouts'
import { AuthGate } from '@/app/router/AuthGate'
import { ForumPage, initForumPage } from '@/pages/forum'
import { ForumTopicPage, initForumTopicPage } from '@/pages/forum-topic'
import {
  ForumTopicNewPage,
  initForumTopicNewPage,
} from '@/pages/forum-topic-new'
import { GamePage, initGamePage } from '@/pages/game'
import { LeaderboardPage, initLeaderboardPage } from '@/pages/leaderboard'
import { MainPage, initMainPage } from '@/pages/main'
import { initNotFoundPage, NotFoundPage } from '@/pages/not-found'
import { initServerErrorPage, ServerErrorPage } from '@/pages/server-error'
import { SignInPage, initSignInPage } from '@/pages/signin'
import { SignUpPage, initSignUpPage } from '@/pages/signup'

/** Контекст SSR/клиента для init*Page (токен, позже — user с сервера) */
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

const authGateChildren: AppRouteObject[] = [
  {
    path: 'signin',
    element: <SignInPage />,
    fetchData: initSignInPage,
  },
  {
    path: 'signup',
    element: <SignUpPage />,
    fetchData: initSignUpPage,
  },
  {
    index: true,
    element: <MainPage />,
    fetchData: initMainPage,
  },
  {
    path: 'game',
    element: <GamePage />,
    fetchData: initGamePage,
  },
  {
    path: 'leaderboard',
    element: <LeaderboardPage />,
    fetchData: initLeaderboardPage,
  },
  {
    path: 'forum/new',
    element: <ForumTopicNewPage />,
    fetchData: initForumTopicNewPage,
  },
  {
    path: 'forum/:topicId',
    element: <ForumTopicPage />,
    fetchData: initForumTopicPage,
  },
  {
    path: 'forum',
    element: <ForumPage />,
    fetchData: initForumPage,
  },
]

export const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <AuthGate />,
        children: authGateChildren,
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

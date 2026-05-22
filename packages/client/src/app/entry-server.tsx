import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Request as ExpressRequest } from 'express'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'

import { routes, type AppRouteObject } from '@/app/routes'
import { setPageHasBeenInitializedOnServer } from '@/app/ssr'
import { reducer } from '@/app/store'

import {
  createContext,
  createFetchRequest,
  createUrl,
} from './entry-server.utils'

import '@/app/styles/index.scss'
import ErrorBoundary from './errorBoundary/ErrorBoundary'

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const store = configureStore({
    reducer,
  })

  const url = createUrl(req)

  const foundRoutes = matchRoutes(routes, url)
  if (!foundRoutes) {
    throw new Error('Страница не найдена!')
  }

  const leafRoute = foundRoutes[foundRoutes.length - 1].route as AppRouteObject
  const fetchData = leafRoute.fetchData

  if (!fetchData) {
    console.log('Страница без fetchData:', url)
  }

  try {
    if (fetchData) {
      await fetchData({
        dispatch: store.dispatch,
        state: store.getState(),
        ctx: createContext(req),
      })
    }
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e)
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true))

  const router = createStaticRouter(dataRoutes, context)

  let html = ''
  try {
    html = ReactDOM.renderToString(
      <ErrorBoundary>
        <Provider store={store}>
          <StaticRouterProvider router={router} context={context} />
        </Provider>
      </ErrorBoundary>
    )
  } catch (e) {
    console.error(e)
  }

  const helmet = Helmet.renderStatic()

  return {
    html,
    helmet,
    styleTags: '',
    initialState: store.getState(),
  }
}

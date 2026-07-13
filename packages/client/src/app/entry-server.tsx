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

import { ColorModeProvider } from '@/app/providers'
import { setUser } from '@/app/store'
import { routes, type AppRouteObject } from '@/app/routes'
import { setPageHasBeenInitializedOnServer } from '@/app/ssr'
import { setupStore } from '@/app/store/setupStore'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/theme'

import {
  createContext,
  createFetchRequest,
  createUrl,
  fetchAuthUserForSsr,
} from './entry-server.utils'

import '@/app/styles/fonts.css'
import '@/app/styles/input-field.css'
import ErrorBoundary from './errorBoundary/ErrorBoundary'

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const store = setupStore()

  const authUser = await fetchAuthUserForSsr(req)

  if (authUser != null) {
    store.dispatch(setUser(authUser))
  }

  const url = createUrl(req)

  const foundRoutes = matchRoutes(routes, url.pathname)
  const leafRoute = foundRoutes?.[foundRoutes.length - 1]?.route as
    | AppRouteObject
    | undefined
  const fetchData = leafRoute?.fetchData

  if (!fetchData) {
    console.log('Страница без fetchData:', url.pathname)
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
      <ChakraProvider value={system}>
        <ColorModeProvider>
          <ErrorBoundary>
            <Provider store={store}>
              <StaticRouterProvider
                router={router}
                context={context}
                hydrate={false}
              />
            </Provider>
          </ErrorBoundary>
        </ColorModeProvider>
      </ChakraProvider>
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
    routerState: {
      loaderData: context.loaderData,
      actionData: context.actionData,
      errors: context.errors,
    },
  }
}

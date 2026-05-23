import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import { AuthProvider } from '@/app/providers'
import '@/app/styles/index.scss'

import { routes } from '@/app/routes'
import { store } from '@/app/store'
import ErrorBoundary from './errorBoundary/ErrorBoundary'

const router = createBrowserRouter(routes)
const rootElement = document.getElementById('root') as HTMLElement

const app = (
  <ErrorBoundary>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </ErrorBoundary>
)

/** SSR dev: в root уже есть разметка. SPA (yarn dev:spa): пустой root → createRoot. */
if (rootElement.childElementCount > 0) {
  ReactDOM.hydrateRoot(rootElement, app)
} else {
  ReactDOM.createRoot(rootElement).render(app)
}

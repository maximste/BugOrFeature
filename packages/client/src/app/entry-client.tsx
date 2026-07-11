import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import { AuthProvider, ColorModeProvider } from '@/app/providers'
import '@/app/styles/fonts.css'
import '@/app/styles/input-field.css'

import { routes } from '@/app/routes'
import { store } from '@/app/store'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/theme'
import ErrorBoundary from './errorBoundary/ErrorBoundary'

declare global {
  interface Window {
    __staticRouterHydrationData?: {
      loaderData?: Record<string, unknown>
      actionData?: Record<string, unknown>
      errors?: Record<string, unknown>
    }
  }
}

const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
})
const rootElement = document.getElementById('root') as HTMLElement

const app = (
  <ChakraProvider value={system}>
    <ColorModeProvider>
      <ErrorBoundary>
        <Provider store={store}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </Provider>
      </ErrorBoundary>
    </ColorModeProvider>
  </ChakraProvider>
)

/** SSR dev: в root уже есть разметка. SPA (yarn dev:spa): пустой root → createRoot. */
if (rootElement.childElementCount > 0) {
  ReactDOM.hydrateRoot(rootElement, app)
} else {
  ReactDOM.createRoot(rootElement).render(app)
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(err => {
      console.error('Service worker registration failed:', err)
    })
  })
}

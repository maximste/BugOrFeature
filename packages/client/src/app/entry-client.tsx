import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import '@/app/styles/index.scss'

import { routes } from '@/app/routes'
import { store } from '@/app/store'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/theme'
import { HelmetProvider } from 'react-helmet-async'

const router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <HelmetProvider>
    <ChakraProvider value={system}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  </HelmetProvider>
)

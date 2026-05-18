import { Outlet } from 'react-router-dom'

import { Header } from '@/widgets/header'

export const MainLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
)

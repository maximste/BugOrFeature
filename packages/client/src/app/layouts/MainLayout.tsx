import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import styles from './MainLayout.module.scss'
import ErrorBoundary from '../errorBoundary/ErrorBoundary'

export const MainLayout = () => (
  <ErrorBoundary>
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
  </ErrorBoundary>
)

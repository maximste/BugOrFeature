import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import styles from './MainLayout.module.scss'

export const MainLayout = () => (
  <>
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
  </>
)

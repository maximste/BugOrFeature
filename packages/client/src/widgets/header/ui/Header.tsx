import { Link } from 'react-router-dom'

import { useAuth } from '@/app/providers'
import { LogoutButton } from '@/features/logout'

import styles from './Header.module.scss'

export const Header = () => {
  const { isAuthenticated } = useAuth()

  return (
    <header className={styles.shell}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li>
            <Link to="/" className={styles.link}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/game" className={styles.link}>
              Игра
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className={styles.link}>
              Лидерборд
            </Link>
          </li>
          <li>
            <Link to="/forum" className={styles.link}>
              Форум
            </Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/signin" className={styles.link}>
                  Вход
                </Link>
              </li>
              <li>
                <Link to="/signup" className={styles.link}>
                  Регистрация
                </Link>
              </li>
            </>
          ) : (
            <li>
              <LogoutButton />
            </li>
          )}
          <li>
            <Link to="/404" className={styles.link}>
              404
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

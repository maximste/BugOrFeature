import { Link } from 'react-router-dom'

import styles from './Header.module.scss'

export const Header = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <Link to="/" className={styles.link}>
            Главная
          </Link>
        </li>
        <li>
          <Link to="/forum" className={styles.link}>
            Форум
          </Link>
        </li>
        <li>
          <Link to="/404" className={styles.link}>
            404
          </Link>
        </li>
      </ul>
    </nav>
  )
}

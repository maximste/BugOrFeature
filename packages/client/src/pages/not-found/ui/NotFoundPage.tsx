import styles from './NotFoundPage.module.scss'
import { Helmet } from 'react-helmet'
import { usePage } from '@/app/hooks/usePage'
import { initNotFoundPage } from '../model/initNotFoundPage'
import { Link } from 'react-router-dom'
import ErrorBoundary from '@/app/errorBoundary/ErrorBoundary'

export const NotFoundPage = () => {
  usePage({ initPage: initNotFoundPage })

  return (
    <ErrorBoundary>
      <main className={styles.noHeaderMain}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>404</title>
          <meta name="description" content="Страница не найдена" />
        </Helmet>

        <section className={styles.errorPageContainer}>
          <img
            className={styles.errorIcon}
            src="/img/not-found-icon.png"
            alt=""
          />
          <h1 className={styles.errorHeader}>404</h1>
          <h2 className={styles.errorSubHeader}>Котик потерялся</h2>
          <div className={styles.errorText}>
            <p>
              Такой странички не существует. Может, она ушла гулять по крышам.
            </p>
          </div>
          <Link className={styles.errorPageButton} to="/">
            На главную
          </Link>
        </section>
      </main>
    </ErrorBoundary>
  )
}

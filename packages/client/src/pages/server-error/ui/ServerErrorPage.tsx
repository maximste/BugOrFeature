import styles from './ServerErrorPage.module.scss'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { usePage } from '@/app/hooks/usePage'
import { initServerErrorPage } from '../model/initServerErrorPage'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'

export const ServerErrorPage = () => {
  usePage({ initPage: initServerErrorPage })
  const navigate = useNavigate()

  return (
    <main className={styles.noHeaderMain}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>500</title>
        <meta name="description" content="Что-то сломалось" />
      </Helmet>

      <section className={styles.errorPageContainer}>
        <img
          className={styles.errorIcon}
          src="/img/server-error-icon.png"
          alt=""
        />
        <h1 className={styles.errorHeader}>500</h1>
        <h2 className={styles.errorSubHeader}>Котики что-то уронили</h2>
        <div className={styles.errorText}>
          <p>
            На сервере неполадки. Попробуйте ещё разок — мы уже метёлкой
            убираем.
          </p>
        </div>
        <Button
          className={`${styles.errorPageButton} ${styles.reloadButton}`}
          onClick={() => navigate(-1)}>
          Попробовать снова
        </Button>
        <Link className={styles.errorPageWhiteButton} to="/">
          На главную
        </Link>
      </section>
    </main>
  )
}

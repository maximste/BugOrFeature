import styles from './ErrorWidget.module.scss'
import { Button } from '@/shared/ui/button'

export const ErrorWidget = () => {
  return (
    <main className={styles.noHeaderMain}>
      <section className={styles.errorPageContainer}>
        <img
          className={styles.errorIcon}
          src="/img/server-error-icon.png"
          alt=""
        />
        <h1 className={styles.errorHeader}>Ошибка</h1>
        <h2 className={styles.errorSubHeader}>Котики опять что-то уронили</h2>
        <Button
          className={`${styles.errorPageButton} ${styles.reloadButton}`}
          onClick={() => window.location.reload()}>
          Перезагрузить страницу
        </Button>
      </section>
    </main>
  )
}

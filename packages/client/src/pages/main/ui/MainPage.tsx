import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { usePage } from '@/app/hooks/usePage'
import { Button } from '@/shared/ui/button'
import { MainFeatureCards } from '@/widgets/main-feature-cards'

import { MAIN_FEATURE_CARDS } from '../model/mainFeatureCards'
import { initMainPage } from '../model/initMainPage'

import styles from './MainPage.module.scss'

export const MainPage = () => {
  usePage({ initPage: initMainPage })
  const navigate = useNavigate()

  return (
    <div className={styles.mainPage}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>BugOrFeature</title>
        <meta name="description" content="BugOrFeature" />
      </Helmet>
      <main className={styles.mainPageContent}>
        <section className={styles.mainTitleContainer}>
          <h2 className={styles.preTitle}>
            <img
              className={styles.preTitleIcon}
              src="img/star.png"
              alt="Звезда"
            />
            Уютная игра для пушистых умов
          </h2>
          <h1 className={styles.mainTitle}>
            Сапёр, но с{' '}
            <span className={styles.mainTitleSpanCats}>котиками</span> и{' '}
            <span className={styles.mainTitleSpanFish}>
              рыбками
              <img src="img/blue-fish.png" alt="" width={74} height={74} />
            </span>
            <img className={styles.mainTitleIcon} src="" alt="" />
          </h1>
          <p className={styles.mainTitleDescription}>
            Открывайте пушистые клеточки, ставьте рыбки-флажки и берегитесь
            спящих пёсиков.
          </p>
          <div className={styles.mainTitleButtons}>
            <Button
              className={styles.mainTitleButtonPlay}
              type="button"
              onClick={() => {
                navigate('/game')
              }}>
              <img
                className={styles.mainTitleButtonIcon}
                src="img/signup-icon.png"
                alt="Иконка кнопки «Играть»"
              />{' '}
              Играть
            </Button>
            <Button
              className={styles.mainTitleButtonForum}
              type="button"
              onClick={() => {
                navigate('/forum')
              }}>
              <img
                className={styles.mainTitleButtonIcon}
                src="img/chat.png"
                alt="Иконка кнопки «На форум»"
              />{' '}
              На форум
            </Button>
          </div>
          <div>
            <img src="img/main-page-image.png" alt="mainPageImage" />
          </div>
          <MainFeatureCards cards={MAIN_FEATURE_CARDS} />
        </section>
      </main>
      <footer className={styles.footer}>Команда BugOrFeature. 2026</footer>
    </div>
  )
}

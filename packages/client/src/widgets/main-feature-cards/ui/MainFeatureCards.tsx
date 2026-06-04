import type { MainFeatureCard } from '../model/types'

import styles from './MainFeatureCards.module.scss'

export type MainFeatureCardsProps = {
  cards: MainFeatureCard[]
}

export const MainFeatureCards = ({ cards }: MainFeatureCardsProps) => {
  return (
    <div className={styles.root}>
      {cards.map(card => (
        <article key={card.id} className={styles.card}>
          <div className={styles.icon}>
            <img src={card.iconSrc} alt={card.iconAlt} width={24} height={24} />
          </div>
          <h3 className={styles.title}>{card.title}</h3>
          <p className={styles.description}>{card.description}</p>
        </article>
      ))}
    </div>
  )
}

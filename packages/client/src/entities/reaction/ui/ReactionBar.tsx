import { EMOTION_EMOJI } from '../model/types'
import type { Emotion, ReactionSummary } from '../model/types'

import styles from './ReactionBar.module.scss'

export type ReactionBarProps = {
  reactions: ReactionSummary[]
  myReaction: Emotion | null
  onReact: (emotion: Emotion) => void
  disabled?: boolean
}

export const ReactionBar = ({
  reactions,
  myReaction,
  onReact,
  disabled,
}: ReactionBarProps) => {
  return (
    <div className={styles.root} role="group" aria-label="Реакции">
      {reactions.map(({ emotion, count }) => (
        <button
          key={emotion}
          type="button"
          className={
            myReaction === emotion
              ? `${styles.button} ${styles.active}`
              : styles.button
          }
          onClick={() => onReact(emotion)}
          disabled={disabled}
          aria-pressed={myReaction === emotion}>
          <span aria-hidden>{EMOTION_EMOJI[emotion]}</span>
          {count > 0 ? <span className={styles.count}>{count}</span> : null}
        </button>
      ))}
    </div>
  )
}

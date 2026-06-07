import type { ReactNode } from 'react'

import styles from './PageHeading.module.scss'

export type PageHeadingProps = {
  title: ReactNode
  subtitle?: ReactNode
  className?: string
}

export const PageHeading = ({
  title,
  subtitle,
  className = '',
}: PageHeadingProps) => {
  return (
    <div className={`${styles.root} ${className}`.trim()}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle != null && subtitle !== '' ? (
        <p className={styles.subtitle}>{subtitle}</p>
      ) : null}
    </div>
  )
}

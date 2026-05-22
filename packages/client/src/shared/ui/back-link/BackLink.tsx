import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import styles from './BackLink.module.scss'

export type BackLinkProps = {
  to?: string
  children?: ReactNode
  className?: string
}

export const BackLink = ({
  to = '/',
  children = '← На главную',
  className = '',
}: BackLinkProps) => {
  return (
    <Link className={`${styles.root} ${className}`.trim()} to={to}>
      {children}
    </Link>
  )
}

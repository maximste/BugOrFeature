import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './Button.module.scss'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode
}

export const Button = ({
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.root} ${className}`.trim()}
      {...rest}>
      {children}
    </button>
  )
}

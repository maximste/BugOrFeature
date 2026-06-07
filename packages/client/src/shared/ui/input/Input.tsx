import type { InputHTMLAttributes } from 'react'

import styles from './Input.module.scss'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ className = '', ...rest }: InputProps) => (
  <input className={`${styles.root} ${className}`.trim()} {...rest} />
)

import type { TextareaHTMLAttributes } from 'react'

import styles from './Textarea.module.scss'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = ({ className = '', ...rest }: TextareaProps) => (
  <textarea className={`${styles.root} ${className}`.trim()} {...rest} />
)

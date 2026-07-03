import type { ReactNode } from 'react'

import styles from './FormField.module.scss'

export type FormFieldProps = {
  label: ReactNode
  htmlFor: string
  children: ReactNode
  className?: string
}

export const FormField = ({
  label,
  htmlFor,
  children,
  className = '',
}: FormFieldProps) => {
  return (
    <div className={`${styles.root} input-field ${className}`.trim()}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  )
}

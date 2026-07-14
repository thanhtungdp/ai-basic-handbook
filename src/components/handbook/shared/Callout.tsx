import React from 'react'
import styles from '../handbook.module.css'

interface CalloutProps {
  variant?: 'default' | 'orange'
  children: React.ReactNode
}

export function Callout({ variant = 'default', children }: CalloutProps) {
  const className = variant === 'orange'
    ? `${styles.callout} ${styles.calloutOrange}`
    : styles.callout

  return (
    <div className={className}>
      {children}
    </div>
  )
}

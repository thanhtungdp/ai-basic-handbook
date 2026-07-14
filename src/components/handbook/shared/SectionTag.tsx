import React from 'react'
import styles from '../handbook.module.css'

interface SectionTagProps {
  index: number
  children: React.ReactNode
}

export function SectionTag({ index, children }: SectionTagProps) {
  return (
    <div className={styles.sectionTag}>
      <span className={styles.sectionIndex}>{String(index).padStart(2, '0')}</span>
      {children}
    </div>
  )
}

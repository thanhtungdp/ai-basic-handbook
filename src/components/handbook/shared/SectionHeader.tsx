import React from 'react'
import styles from '../handbook.module.css'

interface SectionHeaderProps {
  children: React.ReactNode
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return <h2 className={styles.sectionHeader}>{children}</h2>
}

'use client'

import React from 'react'
import styles from '../handbook.module.css'

export interface Concept {
  term: string
  desc: string
  example: React.ReactNode
}

interface ConceptCardsProps {
  concepts: Concept[]
}

export function ConceptCards({ concepts }: ConceptCardsProps) {
  return (
    <div className={styles.concepts}>
      {concepts.map((c, i) => (
        <div key={i} className={styles.ccard}>
          <div className={styles.cnum}>{i + 1}</div>
          <div className={styles.ck}>{c.term}</div>
          <h4 className={styles.ccardTitle}>{c.term}</h4>
          <div className={styles.cd}>{c.desc}</div>
          <div className={styles.cex}>
            Ví dụ — {c.example}
          </div>
        </div>
      ))}
    </div>
  )
}
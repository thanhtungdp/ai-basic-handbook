'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

export interface ComparisonRow {
  criterion: string
  chatAI: string
  hermes: string
}

interface ComparisonTableProps {
  rows: ComparisonRow[]
}

export function ComparisonTable({ rows }: ComparisonTableProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleRowClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <>
      <div className={styles.comparisonHint}>
        ↓ Bấm từng dòng để soi khác biệt <kbd>click</kbd>
      </div>
      <div className={styles.comparisonTable}>
        <div className={styles.comparisonHead}>
          <div>Tiêu chí</div>
          <div>Chat AI thông thường</div>
          <div className={styles.comparisonHeadHermes}>Hermes Agent</div>
        </div>
        {rows.map((row, index) => (
          <div
            key={index}
            className={`${styles.comparisonRow} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => handleRowClick(index)}
          >
            <div className={styles.comparisonCriterion}>{row.criterion}</div>
            <div className={styles.comparisonChat}>{row.chatAI}</div>
            <div className={styles.comparisonHermes}>{row.hermes}</div>
          </div>
        ))}
      </div>
    </>
  )
}

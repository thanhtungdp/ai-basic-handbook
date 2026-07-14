'use client'

import React from 'react'
import styles from '../handbook.module.css'

interface FormulaLine {
  who: 'ceo' | 'hermes'
  text: string
}

const LINES: FormulaLine[] = [
  { who: 'ceo', text: 'quyết định việc đúng.' },
  { who: 'hermes', text: 'làm đúng việc.' },
  { who: 'ceo', text: 'duyệt ngoại lệ.' },
  { who: 'hermes', text: 'ghi lại cách làm tốt hơn cho lần sau.' },
]

export function Formula() {
  return (
    <div className={styles.formula}>
      {LINES.map((line, i) => (
        <div key={i} className={styles.formulaLine}>
          <span className={line.who === 'ceo' ? styles.whoCeo : styles.whoHermes}>
            {line.who === 'ceo' ? 'CEO' : 'Hermes'}
          </span>{' '}
          {line.text}
        </div>
      ))}
    </div>
  )
}

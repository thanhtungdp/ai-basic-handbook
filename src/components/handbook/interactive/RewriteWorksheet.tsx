'use client'

import React, { useState, useEffect } from 'react'
import styles from '../handbook.module.css'

interface RwRow {
  task: string
  vague: string
}

const ROWS: RwRow[] = [
  { task: 'Email follow-up', vague: 'Viết email cho khách' },
  { task: 'Báo giá', vague: 'Làm báo giá' },
  { task: 'Content', vague: 'Viết bài LinkedIn' },
]

const STORAGE_KEY = 'hermes02_rw'

export function RewriteWorksheet() {
  const [values, setValues] = useState<string[]>(['', '', ''])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setValues(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const handleChange = (i: number, val: string) => {
    const next = [...values]
    next[i] = val
    setValues(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  return (
    <div className={styles.rewrite}>
      <div className={styles.rwHead}>
        <div>Việc</div>
        <div>Prompt mơ hồ ban đầu</div>
        <div className={styles.rwHeadCeo}>Prompt kiểu CEO của bạn</div>
      </div>
      {ROWS.map((r, i) => (
        <div key={i} className={styles.rwRow}>
          <div className={styles.rwTask}>{r.task}</div>
          <div className={styles.rwVague}>{r.vague}</div>
          <textarea
            className={styles.rwTextarea}
            placeholder="Viết lại: Bối cảnh… Mục tiêu… Đầu ra… Quyền hạn…"
            value={values[i]}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
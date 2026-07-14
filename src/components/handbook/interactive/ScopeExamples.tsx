'use client'

import React from 'react'
import styles from '../handbook.module.css'

const ROWS = [
  { bad: 'Làm sales cho anh.', good: 'Soạn email follow-up sau demo B2B SaaS.' },
  { bad: 'Làm content cho anh.', good: 'Tạo báo giá dịch vụ triển khai ERP cho khách SME.' },
]

export function ScopeExamples() {
  return (
    <div className={styles.scope}>
      <div className={styles.scopeHead}>Skill quá rộng vs skill dùng được</div>
      {ROWS.map((r, i) => (
        <div key={i} className={styles.scopeRow}>
          <div className={styles.scopeCol}>
            <span className={`${styles.scopeLabel} ${styles.scopeBad}`}>✕ Quá rộng</span>
            <code className={styles.scopeCode}>{r.bad}</code>
          </div>
          <div className={styles.scopeArrow}>→</div>
          <div className={styles.scopeCol}>
            <span className={`${styles.scopeLabel} ${styles.scopeGood}`}>✓ Dùng được</span>
            <code className={`${styles.scopeCode} ${styles.scopeGoodCode}`}>{r.good}</code>
          </div>
        </div>
      ))}
    </div>
  )
}
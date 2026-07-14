'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

export interface ErrorItem {
  icon: string
  error: string
  sign: React.ReactNode
  fix: React.ReactNode
}

interface ErrorAccordionProps {
  items: ErrorItem[]
}

export function ErrorAccordion({ items }: ErrorAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className={styles.acc}>
      {items.map((it, i) => (
        <div
          key={i}
          className={`${styles.accItem} ${open === i ? styles.accItemOpen : ''}`}
        >
          <div
            className={styles.accQ}
            onClick={() => setOpen((cur) => (cur === i ? null : i))}
            role="button"
            tabIndex={0}
          >
            <div className={styles.accIcon}>{it.icon}</div>
            <div className={styles.accErr}>{it.error}</div>
          </div>
          <div
            className={styles.accA}
            style={{ maxHeight: open === i ? '300px' : '0' }}
          >
            <div className={styles.accAIn}>
              <div className={styles.accRow}>
                <div className={styles.accRowLabel}>Dấu hiệu</div>
                <div className={styles.accRowVal}>{it.sign}</div>
              </div>
              <div className={styles.accRow}>
                <div className={styles.accRowLabel}>Cách xử lý</div>
                <div className={styles.accRowVal}>{it.fix}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
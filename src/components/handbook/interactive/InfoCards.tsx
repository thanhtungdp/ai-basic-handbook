'use client'

import React from 'react'
import styles from '../handbook.module.css'

export interface InfoCard {
  icon: string
  title: string
  when?: string
  desc?: React.ReactNode
  pros?: string[]
  cons?: string[]
  flag?: string
  featured?: boolean
}

interface InfoCardsProps {
  cards: InfoCard[]
  columns?: 2 | 3
}

export function InfoCards({ cards, columns = 3 }: InfoCardsProps) {
  return (
    <div
      className={styles.installGrid}
      style={
        columns === 2
          ? { gridTemplateColumns: '1fr 1fr' }
          : undefined
      }
    >
      {cards.map((c, i) => (
        <div
          key={i}
          className={`${styles.icard} ${c.featured ? styles.icardFeat : ''}`}
        >
          {c.flag && <span className={styles.icardFlag}>{c.flag}</span>}
          {c.icon && <div className={styles.icardIcon}>{c.icon}</div>}
          <h4 className={styles.icardTitle}>{c.title}</h4>
          {c.when && <div className={styles.icardWhen}>{c.when}</div>}
          {c.desc && <p className={styles.icardDesc}>{c.desc}</p>}
          {c.pros && (
            <>
              <div className={styles.icardPn}>Ưu điểm</div>
              <ul className={`${styles.icardList} ${styles.icardPro}`}>
                {c.pros.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </>
          )}
          {c.cons && (
            <>
              <div className={styles.icardPn}>Nhược điểm</div>
              <ul className={`${styles.icardList} ${styles.icardCon}`}>
                {c.cons.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
'use client'

import React from 'react'
import styles from '../handbook.module.css'

interface LessonMetaItem {
  label: string
  value: string
  strong?: boolean
}

interface LessonMetaProps {
  eyebrow: string
  title: React.ReactNode
  goal: React.ReactNode
  addons: React.ReactNode
  meta?: LessonMetaItem[]
}

export function LessonMeta({ title, goal, meta, addons}: LessonMetaProps) {
  return (
    <header className={styles.lessonHeader}>
      <div className="mb-4 flex items-center justify-between max-md:flex-col max-md:items-start max-md:justify-start max-md:gap-3">
        {meta && meta.length > 0 && (
          <div className={styles.lessonMetaRow}>
            {meta.map((m, i) => (
              <div key={i} className={styles.lessonMetaItem}>
                <strong>{m.label}</strong> {m.value}
              </div>
            ))}
          </div>
        )}
        {addons}
      </div>
      {/* <div className={styles.lessonEyebrow}>{eyebrow}</div> */}
      <h1 className={styles.lessonTitle}>{title}</h1>
      <div className={styles.lessonGoal}>
        <p className={styles.serifEm}>{goal}</p>
      </div>
    </header>
  )
}
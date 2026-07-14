'use client'

import React from 'react'
import styles from '../handbook.module.css'

interface NextLessonCardProps {
  kicker: string
  title: string
  desc: React.ReactNode
  cta: string
  href?: string
}

export function NextLessonCard({
  kicker,
  title,
  desc,
  cta,
  href = '#',
}: NextLessonCardProps) {
  return (
    <div className={styles.nextLesson}>
      <div className={styles.nextLessonLeft}>
        <div className={styles.nextLessonKicker}>{kicker}</div>
        <h3 className={styles.nextLessonTitle}>{title}</h3>
        <p className={styles.nextLessonDesc}>{desc}</p>
      </div>
      <a href={href} className={styles.nextLessonBtn}>
        {cta} →
      </a>
    </div>
  )
}
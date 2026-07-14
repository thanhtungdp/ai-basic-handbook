'use client'

import React, { useEffect, useState } from 'react'
import styles from '../handbook.module.css'

export interface TOCItem {
  id: string
  label: string
}

interface TOCProps {
  items: TOCItem[]
}

export function TOC({ items }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    items.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <aside className={styles.toc}>
      <div className={styles.tocKicker}>Mục lục bài học</div>
      <ol className={styles.tocList}>
        {items.map((item, index) => (
          <li key={item.id} className={styles.tocItem}>
            <a
              href={`#${item.id}`}
              className={`${styles.tocLink} ${activeId === item.id ? styles.tocLinkActive : ''}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
      <div className={styles.tocProgress}>
        <div className={styles.tocProgressBar}>
          <div className={styles.tocProgressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.tocProgressLabel}>
          <span>Tiến độ học</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </aside>
  )
}

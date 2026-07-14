'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from '../handbook.module.css'

export interface TaskChip {
  label: string
  time: string
  tag: string
}

interface TaskChipsAnimationProps {
  tasks: TaskChip[]
}

export function TaskChipsAnimation({ tasks }: TaskChipsAnimationProps) {
  const [visible, setVisible] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !visible) {
          setVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(wrapper)

    return () => observer.disconnect()
  }, [visible])

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div ref={wrapperRef} className={styles.taskChips}>
      {tasks.map((task, index) => (
        <div
          key={index}
          className={`${styles.taskChip} ${visible ? styles.visible : ''}`}
          style={{
            transitionDelay: prefersReducedMotion ? '0s' : `${index * 0.09}s`,
          }}
        >
          {task.label}
          <span className={styles.taskChipTime}>
            {task.time} · {task.tag}
          </span>
        </div>
      ))}
    </div>
  )
}

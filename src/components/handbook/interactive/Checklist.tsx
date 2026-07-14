'use client'

import React, { useState, useEffect } from 'react'
import styles from '../handbook.module.css'

interface ChecklistItem {
  text: string
}

interface ChecklistProps {
  items: ChecklistItem[]
  storageKey?: string
  completeMessage?: React.ReactNode
  progressMessage?: (completed: number, total: number) => React.ReactNode
}

export function Checklist({
  items,
  storageKey = 'hermes_handbook_00_checklist',
  completeMessage = (
    <>
      <strong>Hoàn thành bài 00 ✓</strong> Sẵn sàng cài đặt & chạy Hermes lần đầu.
    </>
  ),
  progressMessage = (completed, total) => (
    <>
      Đã đạt <strong>{completed}/{total}</strong> mục. Tiếp tục nhé.
    </>
  ),
}: ChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false))

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length === items.length) {
          setChecked(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load checklist data:', e)
    }
  }, [items.length])

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked))
    } catch (e) {
      console.error('Failed to save checklist data:', e)
    }
  }, [checked])

  const handleToggle = (index: number) => {
    const updated = [...checked]
    updated[index] = !updated[index]
    setChecked(updated)
  }

  const completedCount = checked.filter(Boolean).length
  const progress = (completedCount / items.length) * 100
  const isComplete = completedCount === items.length

  // Circle progress calculation
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress / 100)

  return (
    <div className={styles.checklist}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.checklistItem} ${checked[index] ? styles.checklistItemDone : ''}`}
          onClick={() => handleToggle(index)}
        >
          <div className={styles.checklistBox}>✓</div>
          <div className={styles.checklistText}>{item.text}</div>
        </div>
      ))}
      <div className={styles.checklistFoot}>
        <div className={styles.checklistRing}>
          <svg width="54" height="54">
            <circle
              cx="27"
              cy="27"
              r={radius}
              fill="none"
              stroke="#3a352c"
              strokeWidth="5"
            />
            <circle
              cx="27"
              cy="27"
              r={radius}
              fill="none"
              stroke="var(--hb-terracotta)"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="square"
              style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              transform="rotate(-90 27 27)"
            />
          </svg>
          <div className={styles.checklistPct}>{Math.round(progress)}%</div>
        </div>
        <div className={styles.checklistMsg}>
          {isComplete ? (
            completeMessage
          ) : (
            progressMessage(completedCount, items.length)
          )}
        </div>
      </div>
    </div>
  )
}

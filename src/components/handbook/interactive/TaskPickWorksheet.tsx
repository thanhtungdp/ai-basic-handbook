'use client'

import React, { useState, useEffect } from 'react'
import styles from '../handbook.module.css'

const TASK_OPTS = ['Email follow-up sau demo', 'Outline blog góc CEO', 'Báo giá nháp', 'Tóm tắt họp → việc cần làm']
const STEPS = [
  'Chọn một việc lặp có ROI',
  'Gửi prompt dạy việc cho Hermes',
  'Cung cấp dữ liệu thật',
  'Review bản nháp bằng tiêu chí cụ thể',
  'Yêu cầu Hermes rút ra checklist',
  'Duyệt checklist',
  'Lưu thành skill nếu quy trình đủ ổn',
]

const STORAGE_KEY = 'hermes03_ws'

interface WsState {
  task: string
  custom: string
  done: boolean[]
  notes: string[]
}

export function TaskPickWorksheet() {
  const [task, setTask] = useState('')
  const [custom, setCustom] = useState('')
  const [done, setDone] = useState<boolean[]>(new Array(7).fill(false))
  const [notes, setNotes] = useState<string[]>(new Array(7).fill(''))

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const s: WsState = JSON.parse(stored)
        if (s.task) setTask(s.task)
        if (s.custom) setCustom(s.custom)
        if (Array.isArray(s.done) && s.done.length === 7) setDone(s.done)
        if (Array.isArray(s.notes) && s.notes.length === 7) setNotes(s.notes)
      }
    } catch { /* ignore */ }
  }, [])

  const save = (next: Partial<WsState>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        task, custom, done, notes, ...next,
      }))
    } catch { /* ignore */ }
  }

  const toggleTask = (t: string) => {
    const next = task === t ? '' : t
    setTask(next)
    save({ task: next })
  }

  const toggleDone = (i: number) => {
    const next = [...done]
    next[i] = !next[i]
    setDone(next)
    save({ done: next })
  }

  const updateNote = (i: number, val: string) => {
    const next = [...notes]
    next[i] = val
    setNotes(next)
    save({ notes: next })
  }

  const reset = () => {
    setDone(new Array(7).fill(false))
    setNotes(new Array(7).fill(''))
    save({ done: new Array(7).fill(false), notes: new Array(7).fill('') })
  }

  const doneCount = done.filter(Boolean).length

  return (
    <>
      <div className={styles.taskPick}>
        <span className={styles.tpLabel}>Việc của tôi:</span>
        <div className={styles.tpOpts}>
          {TASK_OPTS.map((t) => (
            <button
              key={t}
              className={`${styles.tpOptBtn} ${task === t ? styles.tpOptOn : ''}`}
              onClick={() => toggleTask(t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
        <input
          type="text"
          className={styles.tpCustom}
          placeholder="…hoặc gõ việc khác của bạn"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); save({ custom: e.target.value }) }}
        />
      </div>
      <div className={styles.ws03}>
        <table>
          <thead>
            <tr>
              <th className={styles.wsChk}>✓</th>
              <th>Bước</th>
              <th>Việc cần làm</th>
              <th>Ghi chú của bạn</th>
            </tr>
          </thead>
          <tbody>
            {STEPS.map((s, i) => (
              <tr key={i} className={done[i] ? styles.ws03Done : ''}>
                <td className={styles.wsChk} onClick={() => toggleDone(i)}>
                  <span className={styles.wsCb}>✓</span>
                </td>
                <td className={styles.wsIx}>{i + 1}</td>
                <td className={styles.wsStep}>{s}</td>
                <td>
                  <input
                    type="text"
                    className={styles.wsInput}
                    placeholder="ghi chú / kết quả…"
                    value={notes[i]}
                    onChange={(e) => updateNote(i, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.wsFoot}>
          <button className={styles.wsResetBtn} onClick={reset} type="button">Xóa tiến độ</button>
          <span className={styles.wsSum}>Hoàn thành <b>{doneCount}/7</b> bước</span>
        </div>
      </div>
    </>
  )
}
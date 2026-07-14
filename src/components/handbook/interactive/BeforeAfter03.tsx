'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface Mode {
  flow: React.ReactNode[]
  say: React.ReactNode
  costClass: string
  costIcon: string
  costText: string
}

const OLD: Mode = {
  flow: ['Việc lặp lại', '→', 'Brief lại từ đầu', '→', 'Hermes làm'],
  say: <>Hôm nay viết email, phải nói lại tone. Mai làm báo giá, nhắc lại format. Tuần sau viết blog, lại copy guideline cũ. Mỗi lần bạn vẫn phải <b>dạy lại từ con số 0</b>.</>,
  costClass: styles.ba03CostMinus,
  costIcon: '✕',
  costText: 'Chi phí: thời gian brief lặp lại mỗi lần — không tích lũy',
}

const NEW: Mode = {
  flow: ['Làm một việc thật', '→', 'Review & sửa', '→', 'Lưu thành skill'],
  say: <>Làm một lần cho thật tốt, rồi yêu cầu Hermes <b>ghi lại cách làm thành skill</b>. Lần sau chỉ cần gọi đúng skill — agent đã biết quy trình, tiêu chuẩn và lỗi cần tránh.</>,
  costClass: styles.ba03CostPlus,
  costIcon: '✓',
  costText: 'Lợi ích: năng lực vận hành tích lũy — dạy một lần, dùng mãi',
}

export function BeforeAfter03() {
  const [mode, setMode] = useState<'old' | 'new'>('old')
  const d = mode === 'old' ? OLD : NEW

  return (
    <div className={styles.ba03}>
      <div className={styles.ba03Switch}>
        <button
          className={`${styles.ba03Btn} ${mode === 'old' ? styles.ba03BtnOn : ''}`}
          onClick={() => setMode('old')}
          type="button"
        >
          ↻ Mỗi lần dạy lại từ đầu
        </button>
        <button
          className={`${styles.ba03Btn} ${mode === 'new' ? styles.ba03BtnOnNew : ''}`}
          onClick={() => setMode('new')}
          type="button"
        >
          ★ Làm một lần → lưu skill
        </button>
      </div>
      <div className={styles.ba03Body}>
        <div className={styles.ba03Flow}>
          {d.flow.map((node, i) => {
            const isLast = i === d.flow.length - 1
            const isArrow = typeof node === 'string' && (node === '→' || node === '↻')
            const isLoopback = false
            if (isArrow) {
              return <span key={i} className={styles.ba03Arrow}>{node}</span>
            }
            return (
              <span key={i} className={`${styles.ba03Node} ${isLast && mode === 'new' ? styles.ba03NodeAcc : ''}`}>
                {node}
              </span>
            )
          })}
          <span className={styles.ba03Loopback}>
            {mode === 'old' ? '↻' : '↻'} {mode === 'old' ? 'lần sau lặp lại' : 'lần sau dùng lại ngay'}
          </span>
        </div>
        <div className={styles.ba03Say}>{d.say}</div>
        <div className={`${styles.ba03Cost} ${d.costClass}`}>
          {d.costIcon} {d.costText}
        </div>
      </div>
    </div>
  )
}
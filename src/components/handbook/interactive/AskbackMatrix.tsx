'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface AskbackRow {
  icon: string
  situation: string
  action: string
}

const ROWS: AskbackRow[] = [
  { icon: '📭', situation: 'Thiếu dữ liệu quan trọng', action: 'Hỏi lại trước khi làm' },
  { icon: '🔀', situation: 'Có nhiều cách hiểu', action: 'Đưa 2–3 phương án để CEO chọn' },
  { icon: '📤', situation: 'Việc có rủi ro gửi ra ngoài', action: 'Chỉ draft, chờ duyệt' },
  { icon: '⚠️', situation: 'Dữ liệu có thể sai', action: 'Nêu giả định trước khi tiếp tục' },
  { icon: '🆕', situation: 'Quy trình chưa từng làm', action: 'Làm bản nháp + đề xuất checklist' },
]

export function AskbackMatrix() {
  const [on, setOn] = useState<number | null>(null)

  return (
    <div className={styles.askback}>
      {ROWS.map((r, i) => (
        <div
          key={i}
          className={`${styles.abRow} ${on === i ? styles.abRowOn : ''}`}
          onClick={() => setOn(on === i ? null : i)}
        >
          <div className={styles.abSitu}>
            <span className={styles.abIcon}>{r.icon}</span>
            {r.situation}
          </div>
          <div className={styles.abAct}>→ {r.action}</div>
        </div>
      ))}
    </div>
  )
}
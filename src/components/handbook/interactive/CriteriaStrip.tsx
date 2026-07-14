'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const CRITS: [string, string][] = [
  ['Lặp lại', 'Việc này có xảy ra hằng tuần không?'],
  ['Đầu vào rõ', 'Hermes cần nhận dữ liệu gì để bắt đầu?'],
  ['Đầu ra rõ', 'Kết quả đúng là file, email, bảng hay checklist?'],
  ['Review được', 'CEO có biết cách kiểm tra đúng/sai không?'],
  ['Rủi ro kiểm soát', 'Nếu sai, có sửa được trước khi gửi ra ngoài không?'],
]

export function CriteriaStrip() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className={styles.crit}>
      {CRITS.map(([title, question], i) => (
        <div
          key={i}
          className={`${styles.critItem} ${open === i ? styles.critItemOn : ''}`}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className={styles.critHead}>
            <span className={styles.critNum}>{i + 1}</span>
            {title}
          </div>
          <div className={styles.critQ}>{question}</div>
        </div>
      ))}
    </div>
  )
}
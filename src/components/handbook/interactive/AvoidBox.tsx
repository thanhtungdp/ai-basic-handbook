'use client'

import React from 'react'
import styles from '../handbook.module.css'

const ITEMS: string[] = [
  'Tự gửi email nhạy cảm cho khách lớn.',
  'Tự xóa/sửa dữ liệu quan trọng.',
  'Tự ra quyết định tài chính.',
  'Tự phản hồi khủng hoảng truyền thông.',
]

export function AvoidBox() {
  return (
    <div className={styles.avoid}>
      <div className={styles.avoidLabel}>✕ Chưa nên bắt đầu bằng việc quá rủi ro</div>
      <ul className={styles.avoidList}>
        {ITEMS.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

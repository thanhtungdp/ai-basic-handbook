'use client'

import React from 'react'
import styles from '../handbook.module.css'

interface Group {
  name: string
  examples: string
  why: string
}

const GROUPS: Group[] = [
  {
    name: 'Sales',
    examples: 'Báo giá, follow-up, nghiên cứu lead',
    why: 'Có mẫu, có quy trình, ROI rõ',
  },
  {
    name: 'Content',
    examples: 'Outline, draft, lịch đăng',
    why: 'Lặp nhiều, kiểm tra bằng giọng thương hiệu',
  },
  {
    name: 'Ops',
    examples: 'Báo cáo ngày/tuần, checklist vận hành',
    why: 'Đầu ra rõ, tiết kiệm thời gian',
  },
  {
    name: 'Research',
    examples: 'Tóm tắt thị trường, đối thủ, khách',
    why: 'AI làm nhanh phần thu thập/tổng hợp',
  },
  {
    name: 'Admin',
    examples: 'Nhắc việc, tổng hợp email, cập nhật sheet',
    why: 'Nhiều thao tác nhỏ, dễ tự động hóa',
  },
]

export function TaskGroups() {
  return (
    <div className={styles.groups}>
      {GROUPS.map((g, i) => (
        <div key={i} className={styles.grp}>
          <div className={styles.grpName}>{g.name}</div>
          <div className={styles.grpEx}>{g.examples}</div>
          <div className={styles.grpWhy}>↳ {g.why}</div>
        </div>
      ))}
    </div>
  )
}

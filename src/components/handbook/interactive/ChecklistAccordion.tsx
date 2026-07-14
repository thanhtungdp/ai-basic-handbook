'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface Item {
  title: string
  items: string[]
}

const DATA: Item[] = [
  {
    title: 'Đầu vào bắt buộc',
    items: ['Tên khách / công ty', 'Người nhận và vai trò', 'Nhu cầu chính', 'Ghi chú demo', 'Bước tiếp theo mong muốn', 'Giọng văn'],
  },
  {
    title: 'Các bước xử lý',
    items: ['Xác định nhu cầu quan trọng nhất', 'Mở đầu ngắn, nhắc lại buổi demo', 'Liên kết giải pháp với nhu cầu đó', 'Xử lý một băn khoăn chính nếu có', 'Kết thúc bằng CTA rõ ràng', 'Kiểm tra độ dài và giọng văn'],
  },
  {
    title: 'Tiêu chuẩn đầu ra',
    items: ['Có subject', 'Email dưới 150–180 từ', 'Không phóng đại', 'Không tự bịa thông tin', 'Có bước tiếp theo cụ thể', 'Chưa gửi nếu chưa được duyệt'],
  },
]

export function ChecklistAccordion() {
  const [open, setOpen] = useState<Set<number>>(new Set([0]))

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className={styles.acc03}>
      {DATA.map((item, i) => (
        <div key={i} className={`${styles.acc03Item} ${open.has(i) ? styles.acc03ItemOn : ''}`}>
          <div className={styles.acc03Q} onClick={() => toggle(i)}>
            <span className={styles.acc03Num}>{i + 1}</span>
            {item.title}
            <span className={styles.acc03Chev}>›</span>
          </div>
          <div
            className={styles.acc03Body}
            style={{ maxHeight: open.has(i) ? '500px' : '0' }}
          >
            <ul className={styles.acc03List}>
              {item.items.map((it, j) => (
                <li key={j} className={styles.acc03Li}>{it}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
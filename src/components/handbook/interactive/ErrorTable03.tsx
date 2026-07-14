'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const ERRORS: [string, string, string][] = [
  ['Chọn việc quá lớn', 'Hermes trả lời chung chung', 'Thu nhỏ phạm vi việc'],
  ['Không có dữ liệu thật', 'Output nghe hay nhưng khó dùng', 'Dùng case thật, dù nhỏ'],
  ['Feedback mơ hồ', 'Hermes sửa không đúng ý', 'Feedback theo tiêu chí cụ thể'],
  ['Lưu skill quá sớm', 'Lần sau agent lặp lại lỗi cũ', 'Chỉ lưu sau khi đã review'],
  ['Skill quá rộng', 'Agent không biết khi nào dùng', 'Đặt skill theo tình huống cụ thể'],
]

export function ErrorTable03() {
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className={styles.errtbl03}>
      {ERRORS.map(([label, sign, fix], i) => (
        <div
          key={i}
          className={`${styles.errRow03} ${open.has(i) ? styles.errRowOn03 : ''}`}
        >
          <div className={styles.errQ03} onClick={() => toggle(i)}>
            <span className={styles.errNum03}>{i + 1}</span>
            <span className={styles.errTitle03}>{label}</span>
            <span className={styles.errChev03}>›</span>
          </div>
          <div
            className={styles.errBody03}
            style={{ maxHeight: open.has(i) ? '300px' : '0' }}
          >
            <div className={styles.errIn03}>
              <div className={styles.errSign03}>
                <div className={styles.errLab03}>Dấu hiệu</div>
                <div className={styles.errVal03}>{sign}</div>
              </div>
              <div className={styles.errFix03}>
                <div className={styles.errLab03}>Cách sửa</div>
                <div className={styles.errVal03}>{fix}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
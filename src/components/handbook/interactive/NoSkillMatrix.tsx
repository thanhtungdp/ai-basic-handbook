'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const ROWS: [string, string, string][] = [
  ['🔂', 'Việc chỉ xảy ra một lần', 'Không có giá trị tái sử dụng'],
  ['🚧', 'Quy trình chưa ổn', 'Lưu sớm → agent lặp lại cách sai'],
  ['🎭', 'Đầu ra phụ thuộc nhiều vào cảm tính', 'Cần thêm ví dụ trước khi chuẩn hóa'],
  ['🔒', 'Dữ liệu nhạy cảm / tạm thời', 'Không nên biến thành tri thức lâu dài'],
  ['🌫️', 'Việc quá rộng', 'Skill sẽ mơ hồ, khó dùng'],
]

export function NoSkillMatrix() {
  const [on, setOn] = useState<number | null>(null)

  return (
    <div className={styles.askback}>
      {ROWS.map(([icon, situ, act], i) => (
        <div
          key={i}
          className={`${styles.abRow} ${on === i ? styles.abRowOn : ''}`}
          onClick={() => setOn(on === i ? null : i)}
        >
          <div className={styles.abSitu}>
            <span className={styles.abIcon}>{icon}</span>
            {situ}
          </div>
          <div className={styles.abAct}>→ {act}</div>
        </div>
      ))}
    </div>
  )
}
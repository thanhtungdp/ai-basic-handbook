'use client'

import React from 'react'
import styles from '../handbook.module.css'

interface FormulaPart {
  num: string
  title: string
  desc: string
}

const PARTS: FormulaPart[] = [
  { num: '1', title: 'Bối cảnh', desc: 'Việc đang nằm trong tình huống nào?' },
  { num: '2', title: 'Mục tiêu', desc: 'Muốn đạt kết quả gì?' },
  { num: '3', title: 'Đầu vào', desc: 'Hermes cần dùng dữ liệu nào?' },
  { num: '4', title: 'Đầu ra', desc: 'Kết quả cần trông thế nào?' },
  { num: '5', title: 'Quyền hạn', desc: 'Hermes được tự làm gì?' },
  { num: '6', title: 'Hỏi lại', desc: 'Thiếu gì thì phải hỏi?' },
]

export function CommandFormula() {
  return (
    <div className={styles.cmdFormula}>
      {PARTS.map((p) => (
        <div key={p.num} className={styles.cmdFormulaLine}>
          <span className={styles.cmdFormulaNum}>{p.num} · {p.title}</span>
          {' '}
          {p.desc}
        </div>
      ))}
    </div>
  )
}
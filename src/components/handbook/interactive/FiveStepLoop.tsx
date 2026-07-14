'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const STEPS = [
  { t: 'Chọn việc', ceo: 'Chọn một việc lặp lại, có ROI và rủi ro kiểm soát được.', herm: 'Hỏi lại để làm rõ đầu vào và đầu ra cần có.' },
  { t: 'Làm cùng', ceo: 'Cung cấp dữ liệu thật của một case cụ thể.', herm: 'Tạo bản nháp đầu tiên dựa trên dữ liệu đó.' },
  { t: 'Review / sửa', ceo: 'Chỉ ra điểm đúng/sai bằng tiêu chí cụ thể.', herm: 'Cập nhật bản nháp theo từng điểm feedback.' },
  { t: 'Ghi checklist', ceo: 'Chốt cách làm chuẩn sau khi đã đạt.', herm: 'Tóm tắt cách làm thành checklist quy trình.' },
  { t: 'Lưu skill', ceo: 'Duyệt nội dung skill trước khi lưu.', herm: 'Ghi lại thành skill để lần sau dùng lại.' },
]

export function FiveStepLoop() {
  const [active, setActive] = useState(0)
  const L = STEPS[active]

  return (
    <div className={styles.loop03}>
      <div className={styles.loopRail}>
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`${styles.loopNode} ${i === active ? styles.loopNodeOn : ''}`}
            onClick={() => setActive(i)}
          >
            <div className={styles.loopNodeNum}>{i + 1}</div>
            <div className={styles.loopNodeTitle}>{s.t}</div>
          </div>
        ))}
      </div>
      <div className={styles.loopDetail}>
        <div className={styles.loopDetailHead}>
          <div className={styles.loopDetailK}>Bước {active + 1} / 5</div>
          <h4 className={styles.loopDetailH4}>{L.t}</h4>
        </div>
        <div className={styles.loopWho}>
          <div className={`${styles.loopWhoCol} ${styles.loopWhoCeo}`}>
            <div className={styles.loopWhoLab}>👤 CEO làm gì</div>
            <div className={styles.loopWhoVal}>{L.ceo}</div>
          </div>
          <div className={`${styles.loopWhoCol} ${styles.loopWhoHerm}`}>
            <div className={styles.loopWhoLab}>⬡ Hermes làm gì</div>
            <div className={styles.loopWhoVal}>{L.herm}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
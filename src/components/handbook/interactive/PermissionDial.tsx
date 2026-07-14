'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface Perm {
  name: string
  risk: string
  safe: boolean
  mean: string
  ex: string
  warn: string
}

const PERMS: Perm[] = [
  {
    name: 'Chỉ đề xuất',
    risk: 'An toàn nhất',
    safe: true,
    mean: 'Hermes chỉ phân tích, gợi ý hướng đi — không tạo ra sản phẩm cuối.',
    ex: 'Đề xuất 3 hướng xử lý tình huống này.',
    warn: 'Phù hợp khi bạn muốn giữ toàn quyền quyết định.',
  },
  {
    name: 'Chỉ draft',
    risk: 'An toàn',
    safe: true,
    mean: 'Hermes soạn bản nháp để bạn duyệt — chưa có gì ra ngoài.',
    ex: 'Soạn email, chưa gửi. Chỉ draft để anh duyệt.',
    warn: 'Đây là mức người mới nên dùng nhiều nhất.',
  },
  {
    name: 'Làm và báo lại',
    risk: 'Cần cân nhắc',
    safe: false,
    mean: 'Hermes tự thực hiện việc rủi ro thấp rồi báo lại kết quả.',
    ex: 'Tạo file báo cáo và gửi link cho anh.',
    warn: 'Chỉ dùng khi quy trình đã ổn định và rủi ro thấp.',
  },
  {
    name: 'Tự quyết trong phạm vi',
    risk: 'Cần rule rõ',
    safe: false,
    mean: 'Hermes tự xử lý theo rule đã định trước — vượt rule thì hỏi.',
    ex: 'Nếu email là newsletter thì tóm tắt; nếu là khách hàng thì báo anh.',
    warn: 'Cần định nghĩa rule thật rõ trước khi trao quyền này.',
  },
]

export function PermissionDial() {
  const [active, setActive] = useState(1)
  const p = PERMS[active]

  return (
    <div className={styles.perm}>
      <div className={styles.permScale}>
        {PERMS.map((perm, i) => (
          <div
            key={i}
            className={`${styles.permStep} ${i === active ? styles.permStepOn : ''}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.permNum}>{i + 1}</span>
            <span className={styles.permDot} />
            <div>
              <div className={styles.permName}>{perm.name}</div>
              <div className={styles.permRisk}>{perm.risk}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.permDetail}>
        <span className={`${styles.safeBadge} ${p.safe ? styles.safeBadgeSafe : styles.safeBadgeCare}`}>
          {p.safe ? '✓ AN TOÀN CHO NGƯỜI MỚI' : '⚠ CẦN CÂN NHẮC'}
        </span>
        <div className={styles.permLevel}>Mức quyền {active + 1} / 4</div>
        <h4 className={styles.permTitle}>{p.name}</h4>
        <p className={styles.permMean}>{p.mean}</p>
        <div className={styles.permExLabel}>Ví dụ câu lệnh</div>
        <div className={styles.permEx}>{p.ex}</div>
        <p className={styles.permWarn}>{p.warn}</p>
      </div>
    </div>
  )
}
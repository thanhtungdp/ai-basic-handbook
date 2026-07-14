'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface Level {
  tab: string
  name: string
  when: string
  risk: string
  time: string
  code: string
}

const LEVELS: Level[] = [
  {
    tab: 'Mức 1',
    name: 'Lệnh nhanh',
    when: 'Việc đơn giản, rủi ro thấp',
    risk: 'Thấp',
    time: '< 1 phút',
    code: 'Tóm tắt nội dung dưới đây thành 5 gạch đầu dòng, tiếng Việt, dễ hiểu cho CEO bận rộn.',
  },
  {
    tab: 'Mức 2',
    name: 'Brief có tiêu chuẩn',
    when: 'Cần đầu ra tốt, có format rõ',
    risk: 'Vừa',
    time: '2–3 phút',
    code: 'Hãy viết email follow-up cho khách theo thông tin bên dưới.\nMục tiêu: chốt lịch demo lại trong tuần này.\nGiọng văn: chuyên nghiệp, thân thiện, không quá bán hàng.\nĐầu ra: 1 subject + 1 email dưới 180 từ.\nChưa gửi, chỉ draft để anh duyệt.',
  },
  {
    tab: 'Mức 3',
    name: 'Giao việc như SOP nhỏ',
    when: 'Nhiều bước, có thể thành skill',
    risk: 'Cao hơn',
    time: '5+ phút',
    code: 'Hãy xử lý lead mới theo quy trình sau:\n1. Đọc thông tin lead.\n2. Phân loại nhu cầu chính.\n3. Đề xuất email phản hồi đầu tiên.\n4. Gợi ý bước tiếp theo cho sales.\n5. Trả về bảng gồm: Insight khách hàng, Email draft, Rủi ro, Việc cần anh duyệt.\nKhông gửi email. Nếu thiếu ngành nghề hoặc nhu cầu, hỏi lại anh trước.',
  },
]

export function LevelTabs() {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const L = LEVELS[active]

  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(L.code).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
    } catch { /* ignore */ }
  }

  return (
    <div className={styles.levels}>
      <div className={styles.lvTabs}>
        {LEVELS.map((lv, i) => (
          <button
            key={i}
            className={`${styles.lvTab} ${i === active ? styles.lvTabOn : ''}`}
            onClick={() => setActive(i)}
            type="button"
          >
            <span className={styles.lvN}>{lv.tab}</span>
            {lv.name}
          </button>
        ))}
      </div>
      <div className={styles.lvPanel}>
        <div className={styles.lvMeta}>
          <div className={styles.lm}>
            <div className={styles.lmLabel}>Dùng khi</div>
            <div className={styles.lmValue}>{L.when}</div>
          </div>
          <div className={styles.lm}>
            <div className={styles.lmLabel}>Rủi ro</div>
            <div className={styles.lmValue}>{L.risk}</div>
          </div>
          <div className={styles.lm}>
            <div className={styles.lmLabel}>Thời gian soạn</div>
            <div className={styles.lmValue}>{L.time}</div>
          </div>
        </div>
        <div className={styles.lvCode}>
          <button className={`${styles.lvCopy} ${copied ? styles.lvCopyDone : ''}`} onClick={handleCopy} type="button">
            {copied ? 'Đã copy ✓' : 'Copy'}
          </button>
          {L.code}
        </div>
      </div>
    </div>
  )
}
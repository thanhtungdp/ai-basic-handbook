'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface Template {
  icon: string
  name: string
  code: string
}

const TEMPLATES: Template[] = [
  {
    icon: '✉️',
    name: 'Viết email',
    code: 'Bối cảnh: [khách/sự kiện/tình huống]\nMục tiêu: [muốn khách làm gì sau email]\nĐầu vào: [ghi chú, thông tin khách, ưu đãi, deadline]\nĐầu ra: 1 subject + 1 email tiếng Việt dưới [số từ].\nGiọng văn: [chuyên nghiệp/thân thiện/thẳng vào vấn đề].\nQuyền hạn: Chỉ draft, chưa gửi.\nNếu thiếu thông tin: hỏi lại tối đa 3 câu.',
  },
  {
    icon: '🧾',
    name: 'Tạo báo giá',
    code: 'Hãy chuẩn bị báo giá cho khách [tên khách].\nBối cảnh: [nhu cầu khách]\nĐầu vào: [sản phẩm/dịch vụ, số lượng, đơn giá, điều khoản]\nĐầu ra: bảng báo giá + email gửi kèm.\nTiêu chuẩn: kiểm tra lại tổng tiền, ghi rõ điều kiện thanh toán, thời hạn hiệu lực.\nQuyền hạn: Chỉ tạo draft/file để anh duyệt, chưa gửi khách.\nNếu thiếu giá hoặc điều khoản quan trọng thì hỏi lại anh.',
  },
  {
    icon: '🔍',
    name: 'Nghiên cứu khách',
    code: 'Hãy nghiên cứu nhanh khách hàng [tên/domain].\nMục tiêu: giúp anh chuẩn bị trước cuộc gọi sales.\nĐầu vào: website, LinkedIn, thông tin công khai nếu có.\nĐầu ra: bảng gồm: họ làm gì, khách hàng mục tiêu, dấu hiệu nhu cầu, 5 câu hỏi nên hỏi, 3 góc chào hàng phù hợp.\nTiêu chuẩn: không bịa dữ kiện; chỗ nào không chắc thì ghi "chưa xác minh".',
  },
  {
    icon: '📅',
    name: 'Lên lịch content',
    code: 'Hãy lên lịch content 2 tuần cho chủ đề [chủ đề].\nBối cảnh: anh là CEO/founder, muốn viết theo góc nhìn vận hành thực tế.\nĐầu ra: bảng gồm ngày đăng, hook, luận điểm chính, ví dụ thực tế, CTA.\nTiêu chuẩn: mỗi bài nghe xong người đọc biết làm gì tiếp theo.\nQuyền hạn: Chỉ đề xuất lịch và outline, chưa viết full bài.',
  },
]

export function TemplateCards() {
  const [copied, setCopied] = useState<number | null>(null)

  const handleCopy = (i: number, text: string) => {
    try {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(i)
        setTimeout(() => setCopied((c) => (c === i ? null : c)), 1400)
      })
    } catch { /* ignore */ }
  }

  return (
    <div className={styles.tplGrid}>
      {TEMPLATES.map((t, i) => (
        <div key={i} className={styles.tpl}>
          <div className={styles.tplHead}>
            <span className={styles.tplIcon}>{t.icon}</span>
            <h4 className={styles.tplName}>{t.name}</h4>
            <button
              className={`${styles.tplCopy} ${copied === i ? styles.tplCopyDone : ''}`}
              onClick={() => handleCopy(i, t.code)}
              type="button"
            >
              {copied === i ? '✓' : 'Copy'}
            </button>
          </div>
          <pre className={styles.tplPre}>{t.code}</pre>
        </div>
      ))}
    </div>
  )
}
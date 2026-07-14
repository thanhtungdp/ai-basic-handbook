'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const tools = [
  { ic:'✈️', name:'Telegram', role:'Giao diện ra lệnh', can:'Nhận lệnh của CEO và báo lại kết quả ngay trong chat — duyệt nhanh bằng điện thoại.', uc:'CEO nhắn một câu để tạo báo giá.' },
  { ic:'📁', name:'File / folder', role:'Workspace an toàn', can:'Đọc, tạo, sửa file trong một không gian làm việc có cấu trúc.', uc:'Tạo DOCX/PDF, đọc brief, lưu báo cáo.' },
  { ic:'✉️', name:'Gmail', role:'Email · draft trước', can:'Soạn, kiểm tra, và gửi email nếu được phép — mặc định chỉ draft.', uc:'Draft follow-up, tóm tắt inbox.' },
  { ic:'📊', name:'Google Sheets', role:'Bảng điều phối', can:'Đọc và cập nhật dữ liệu bảng theo rule đã định.', uc:'Theo dõi lead, cập nhật pipeline.' },
  { ic:'🌐', name:'Web / browser', role:'Nghiên cứu', can:'Tìm kiếm, kiểm tra website, thu thập thông tin công khai — ghi rõ nguồn.', uc:'Research khách hàng, kiểm tra đối thủ.' },
  { ic:'⏱️', name:'Cron / webhook', role:'Tự động hóa', can:'Chạy định kỳ theo lịch hoặc kích hoạt theo sự kiện.', uc:'Báo cáo sáng, xử lý form mới.' },
]

export function ToolHub04() {
  const [sel, setSel] = useState<number | null>(null)
  const t = sel === null ? null : tools[sel]
  return (
    <div className={styles.hub04}>
      <div className={styles.hub04Stage}>
        <div className={styles.hub04Core}><span>⬡</span><b>HERMES</b></div>
        {tools.map((tool, i) => {
          const angle = -90 + i * (360 / tools.length)
          const left = 50 + 37 * Math.cos((angle * Math.PI) / 180)
          const top = 50 + 41 * Math.sin((angle * Math.PI) / 180)
          return (
            <button key={tool.name} type="button" className={`${styles.hub04Node} ${sel === i ? styles.hub04NodeOn : ''}`} style={{ left: `${left}%`, top: `${top}%` }} onClick={() => setSel(i)}>
              <span className={styles.hub04Ic}>{tool.ic}</span><span>{tool.name}</span>
            </button>
          )
        })}
      </div>
      <div className={styles.hub04Detail}>
        {!t ? <div className={styles.hub04Empty}>Bấm một tool để xem chi tiết.</div> : <>
          <div className={styles.hub04Big}>{t.ic}</div><h4>{t.name}</h4><div className={styles.hub04Role}>{t.role}</div><p>{t.can}</p>
          <div className={styles.hub04Uc}><span>Ví dụ use case</span><b>{t.uc}</b></div>
        </>}
      </div>
    </div>
  )
}

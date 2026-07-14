'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const STEPS = [
  {
    label: '① Giao việc dạy quy trình',
    user: 'Anh muốn dạy em quy trình soạn email follow-up sau buổi demo. Đầu ra: 1 subject + email dưới 180 từ. Chỉ draft, chưa gửi. Thiếu gì thì hỏi lại tối đa 3 câu.',
    bot: 'Rõ rồi anh. Trước khi viết, em cần hỏi: tên khách/công ty, nhu cầu chính, và bước tiếp theo anh muốn chốt là gì?',
  },
  {
    label: '② Cung cấp dữ liệu thật',
    user: 'Khách: Công ty ABC. Nhu cầu: quản lý pipeline sales + báo cáo doanh số theo khu vực. Băn khoăn: thời gian triển khai. Bước tiếp theo: lịch 30 phút với team kỹ thuật.',
    bot: 'Đây là bản nháp đầu tiên: cảm ơn anh Minh, nhắc đúng nhu cầu pipeline theo khu vực, xử lý băn khoăn triển khai, và đề xuất lịch trao đổi kỹ thuật.',
  },
  {
    label: '③ Feedback có tiêu chí',
    user: 'Bản này đúng hướng, sửa 3 điểm: mở đầu ngắn hơn, nhấn nỗi đau pipeline theo khu vực, CTA rõ với 2 khung giờ. Viết lại dưới 150 từ.',
    bot: 'Đã sửa theo đúng 3 tiêu chí. Bản v2 ngắn hơn, CTA rõ hơn, và vẫn chưa gửi ra ngoài — chờ anh duyệt.',
  },
  {
    label: '④ Rút checklist',
    user: 'Bản này đã đạt. Hãy rút ra checklist quy trình soạn email follow-up sau demo.',
    bot: 'Checklist gồm: đầu vào bắt buộc, các bước xử lý, tiêu chuẩn đầu ra, lỗi cần tránh, và khi nào phải hỏi lại CEO.',
  },
  {
    label: '⑤ Lưu skill',
    user: 'Hãy lưu quy trình này thành skill `sales-follow-up-after-demo`.',
    bot: 'Sẵn sàng lưu skill với cấu trúc: khi nào dùng · đầu vào · quy trình · tiêu chuẩn · lỗi cần tránh · checklist kiểm tra.',
  },
]

export function Lesson03Playground() {
  const [count, setCount] = useState(0)

  const shown = STEPS.slice(0, count)
  const done = count >= STEPS.length

  return (
    <>
      <div className={styles.pgContainer}>
        <div className={styles.pgBar}>
          <span className={styles.pgDot}>H</span>
          Hermes · huấn luyện skill
          <span className={styles.pgLive}>ĐANG HỌC</span>
        </div>
        <div className={styles.pgBody}>
          {shown.length === 0 && (
            <div className={`${styles.pgBubble} ${styles.pgBubbleBot}`}>
              Chào anh 👋 Mình sẽ cùng dạy một việc thật: <strong>soạn email follow-up sau demo</strong>. Bấm bước ① để bắt đầu.
            </div>
          )}
          {shown.map((step, i) => (
            <React.Fragment key={i}>
              <div className={`${styles.pgBubble} ${styles.pgBubbleMe}`}>{step.user}</div>
              <div className={`${styles.pgBubble} ${styles.pgBubbleBot}`}>{step.bot}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={styles.pgChips}>
        {!done ? (
          <button className={styles.pgChip} onClick={() => setCount(count + 1)} type="button">
            {STEPS[count].label}
          </button>
        ) : (
          <button className={styles.pgChip} onClick={() => setCount(0)} type="button">
            ↻ Chạy lại mô phỏng
          </button>
        )}
      </div>
      <p className={styles.pgNote}>💡 Mẹo: feedback càng có tiêu chí, Hermes càng dễ rút ra checklist tốt để lưu thành skill.</p>
    </>
  )
}

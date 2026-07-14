'use client'

import React from 'react'
import styles from '../handbook.module.css'

export function BeforeAfter() {
  return (
    <div className={styles.beforeAfter}>
      <div className={styles.baCol}>
        <div className={styles.baHeader}>Cách làm cũ · CEO tự làm</div>
        <ol className={styles.baSteps}>
          <li>Đọc tin nhắn khách</li>
          <li>Mở file mẫu</li>
          <li>Tìm thông tin sản phẩm</li>
          <li>Tính giá</li>
          <li>Viết email</li>
          <li>Xuất PDF</li>
          <li>Gửi khách</li>
          <li>Ghi lại vào sheet</li>
        </ol>
        <div className={styles.baSummary}>8 thao tác · ~30 phút · mỗi lần</div>
      </div>

      <div className={`${styles.baCol} ${styles.baColNew}`}>
        <div className={styles.baHeader}>Cách làm với Hermes · CEO giao việc</div>
        <div className={styles.baCommand}>
          Tạo báo giá cho khách A. Dùng mẫu chuẩn, kiểm tra tổng tiền,
          xuất DOCX/PDF. Chưa gửi — chỉ draft để anh duyệt.
        </div>
        <div className={styles.baLabel}>Hermes tự động:</div>
        <ul className={styles.baChecks}>
          <li>Đọc dữ liệu đầu vào</li>
          <li>Dùng template đúng</li>
          <li>Tạo file</li>
          <li>Kiểm tra lỗi cơ bản</li>
          <li>Soạn email</li>
          <li>Báo lại để CEO duyệt</li>
        </ul>
        <div className={styles.baSummary}>1 câu lệnh · CEO chỉ duyệt</div>
      </div>
    </div>
  )
}

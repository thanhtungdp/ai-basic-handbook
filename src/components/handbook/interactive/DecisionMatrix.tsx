'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface MatrixItem {
  x: number
  y: number
  t: string
  rec: boolean
  why: string
  roi: string
  risk: string
}

const ITEMS: MatrixItem[] = [
  { x: 22, y: 82, t: 'Email follow-up', rec: true, why: 'Lặp hằng tuần, ROI cao, chỉ draft nên rủi ro thấp — bạn duyệt trước khi gửi. Ứng viên số 1 cho lần đầu.', roi: 'Cao', risk: 'Thấp' },
  { x: 34, y: 74, t: 'Báo giá nháp', rec: true, why: 'Giá trị bán hàng rõ, có mẫu sẵn. Chỉ tạo bản nháp để CEO duyệt nên rủi ro được kiểm soát.', roi: 'Cao', risk: 'Thấp–vừa' },
  { x: 26, y: 60, t: 'Outline blog', rec: true, why: 'Lặp nhiều, dễ chỉnh tone, không gửi ra ngoài. Tốt để luyện vòng review.', roi: 'Vừa', risk: 'Thấp' },
  { x: 18, y: 34, t: 'Tóm tắt email', rec: true, why: 'Rủi ro rất thấp và tiết kiệm thời gian, nhưng ROI vừa phải — tốt để khởi động, chưa phải việc đáng lưu skill nhất.', roi: 'Thấp–vừa', risk: 'Thấp' },
  { x: 82, y: 80, t: 'Tự gửi email khách lớn', rec: false, why: 'ROI cao nhưng rủi ro cao: sai một câu là ảnh hưởng quan hệ khách lớn. Để agent tự gửi ngay từ đầu là quá sớm.', roi: 'Cao', risk: 'Cao' },
  { x: 74, y: 50, t: 'Sửa dữ liệu tài chính', rec: false, why: 'Thay đổi dữ liệu thật, khó hoàn tác. Không phù hợp cho lần đầu — cần quy trình và quyền hạn chặt.', roi: 'Vừa', risk: 'Cao' },
  { x: 88, y: 30, t: 'Xóa/sửa data production', rec: false, why: 'Rủi ro cao nhất, giá trị học tập thấp. Tuyệt đối không giao cho lần dạy đầu tiên.', roi: 'Thấp', risk: 'Rất cao' },
]

export function DecisionMatrix() {
  const [sel, setSel] = useState<number | null>(null)
  const item = sel !== null ? ITEMS[sel] : null

  return (
    <div className={styles.matrix03}>
      <div className={styles.mxYlab}>ROI →</div>
      <div className={styles.mxGrid}>
        <div className={styles.mxZone} />
        <div className={styles.mxAxisX}>Rủi ro →</div>
        <div className={`${styles.mxQ} ${styles.mxQTr}`}>Rủi ro cao</div>
        <div className={`${styles.mxQ} ${styles.mxQBl}`}>Giá trị thấp</div>
        <div className={`${styles.mxQ} ${styles.mxQBr}`}>Tránh lần đầu</div>
        {ITEMS.map((m, i) => (
          <div
            key={i}
            className={`${styles.mxDot} ${m.rec ? styles.mxDotRec : styles.mxDotAvoid} ${sel === i ? styles.mxSel : ''}`}
            style={{ left: `${m.x}%`, bottom: `${m.y}%` }}
            onClick={() => setSel(i)}
          >
            <span className={styles.mxDotD} />
            <span className={styles.mxDotL}>{m.t}</span>
          </div>
        ))}
      </div>
      <div className={styles.mxDetail}>
        {!item ? (
          <div className={styles.mxdEmpty}>Bấm một chấm để xem chi tiết.</div>
        ) : (
          <>
            <div className={styles.mxv}>
              <span className={`${styles.mxVerdict} ${item.rec ? styles.mxVerdictRec : styles.mxVerdictAvoid}`}>
                {item.rec ? '✓ NÊN GIAO' : '✕ TRÁNH LẦN ĐẦU'}
              </span>
              <h4 className={styles.mxTitle}>{item.t}</h4>
            </div>
            <p className={styles.mxWhy}>{item.why}</p>
            <div className={styles.mxStats}>
              <span>ROI: <b>{item.roi}</b></span>
              <span>Rủi ro: <b>{item.risk}</b></span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
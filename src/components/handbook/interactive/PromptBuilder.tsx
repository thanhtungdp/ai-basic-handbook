'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styles from '../handbook.module.css'

type FieldKey = 'boicanh' | 'muctieu' | 'dauvao' | 'daura' | 'quyenhan' | 'hoilai'

interface Field {
  key: FieldKey
  label: string
  num: string
  required?: boolean
  type: 'textarea' | 'input'
  placeholder: string
}

const FIELDS: Field[] = [
  { key: 'boicanh', label: 'Bối cảnh', num: '1', type: 'textarea', placeholder: 'VD: Khách A vừa xem demo hôm qua, quan tâm gói 12 tháng.' },
  { key: 'muctieu', label: 'Mục tiêu', num: '2', required: true, type: 'textarea', placeholder: 'VD: Chốt lịch trao đổi 30 phút trong tuần này.' },
  { key: 'dauvao', label: 'Đầu vào', num: '3', type: 'textarea', placeholder: 'VD: Ghi chú demo + bảng giá anh gửi.' },
  { key: 'daura', label: 'Đầu ra mong muốn', num: '4', required: true, type: 'textarea', placeholder: 'VD: Email tiếng Việt, chuyên nghiệp, dưới 180 từ, có 2 khung giờ.' },
  { key: 'quyenhan', label: 'Quyền hạn', num: '5', type: 'input', placeholder: 'VD: Chỉ soạn draft, chưa gửi.' },
  { key: 'hoilai', label: 'Nếu thiếu thông tin', num: '6', type: 'input', placeholder: 'VD: Hỏi lại anh trước, không tự bịa.' },
]

const LABEL_MAP: Record<FieldKey, string> = {
  boicanh: 'Bối cảnh',
  muctieu: 'Mục tiêu',
  dauvao: 'Đầu vào',
  daura: 'Đầu ra mong muốn',
  quyenhan: 'Quyền hạn của em',
  hoilai: 'Nếu thiếu thông tin thì',
}

const EXAMPLES: Record<string, Record<FieldKey, string>> = {
  email: {
    boicanh: 'Khách A vừa xem demo phần mềm quản lý bán hàng hôm qua, quan tâm gói 12 tháng.',
    muctieu: 'Soạn email follow-up để chốt lịch trao đổi 30 phút trong tuần này.',
    dauvao: 'Dùng ghi chú demo bên dưới và bảng giá anh gửi.',
    daura: 'Email tiếng Việt, chuyên nghiệp, dưới 180 từ, có 2 lựa chọn khung giờ.',
    quyenhan: 'Chỉ soạn draft, chưa gửi.',
    hoilai: 'Hỏi lại anh trước, không tự bịa.',
  },
  baogia: {
    boicanh: 'Khách B cần báo giá dịch vụ triển khai cho 20 user.',
    muctieu: 'Chuẩn bị báo giá để anh duyệt rồi gửi khách.',
    dauvao: 'Bảng giá dịch vụ, số lượng user, điều khoản thanh toán.',
    daura: 'Bảng báo giá + email gửi kèm, ghi rõ điều kiện thanh toán và thời hạn hiệu lực.',
    quyenhan: 'Chỉ tạo draft/file để anh duyệt, chưa gửi khách.',
    hoilai: 'Nếu thiếu giá hoặc điều khoản quan trọng thì hỏi lại anh.',
  },
}

const STORAGE_KEY = 'hermes02_bld'

export function PromptBuilder() {
  const [state, setState] = useState<Record<FieldKey, string>>({
    boicanh: '', muctieu: '', dauvao: '', daura: '', quyenhan: '', hoilai: '',
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setState(JSON.parse(stored))
      }
    } catch { /* ignore */ }
  }, [])

  const updateField = useCallback((key: FieldKey, value: string) => {
    setState((prev) => {
      const next = { ...prev, [key]: value }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const loadExample = (ex: string) => {
    if (ex === 'clear') {
      const empty = { boicanh: '', muctieu: '', dauvao: '', daura: '', quyenhan: '', hoilai: '' }
      setState(empty)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(empty)) } catch { /* ignore */ }
    } else if (EXAMPLES[ex]) {
      setState(EXAMPLES[ex])
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(EXAMPLES[ex])) } catch { /* ignore */ }
    }
  }

  const filledCount = FIELDS.filter((f) => state[f.key].trim()).length
  const pct = Math.round((filledCount / 6) * 100)

  const lines = FIELDS.filter((f) => state[f.key].trim()).map((f) => `${LABEL_MAP[f.key]}: ${state[f.key].trim()}`)
  const output = lines.length === 0
    ? 'Điền các ô bên trái — prompt kiểu CEO sẽ hiện ra ở đây để bạn copy…'
    : lines.join('\n')

  const handleCopy = () => {
    if (lines.length === 0) return
    try {
      navigator.clipboard?.writeText(lines.join('\n')).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      })
    } catch { /* ignore */ }
  }

  return (
    <>
      <div className={styles.builder}>
        <div className={styles.bldForm}>
          {FIELDS.map((f) => (
            <div key={f.key} className={styles.bldField}>
              <label className={styles.bldLabel}>
                <span className={styles.bldNum}>{f.num}</span>
                {' '}
                {f.label}
                {f.required && <span className={styles.bldReq}>bắt buộc</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  className={styles.bldTextarea}
                  placeholder={f.placeholder}
                  value={state[f.key]}
                  onChange={(e) => updateField(f.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className={styles.bldInput}
                  placeholder={f.placeholder}
                  value={state[f.key]}
                  onChange={(e) => updateField(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className={styles.bldFoot}>
            <span className={styles.bldExLab}>Tải ví dụ mẫu:</span>
            <button className={styles.bldBtnSm} onClick={() => loadExample('email')} type="button">Email</button>
            <button className={styles.bldBtnSm} onClick={() => loadExample('baogia')} type="button">Báo giá</button>
            <button className={styles.bldBtnSm} onClick={() => loadExample('clear')} type="button">Xóa hết</button>
          </div>
        </div>
        <div className={styles.bldOut}>
          <div className={styles.bldOutHead}>
            <span className={styles.bldDot} />
            {' '}PROMPT KIỂU CEO
            <span className={styles.bldMeter}>
              <span className={styles.bldMbar}><span className={styles.bldMfill} style={{ width: `${pct}%` }} /></span>
              <span>{filledCount}/6</span>
            </span>
            <button className={`${styles.bldCopy} ${copied ? styles.bldCopyDone : ''}`} onClick={handleCopy} type="button">
              {copied ? 'Đã copy ✓' : 'Copy'}
            </button>
          </div>
          <div className={styles.bldPre}>
            {lines.length === 0 ? (
              <span className={styles.bldPh}>{output}</span>
            ) : (
              lines.map((l, i) => (
                <div key={i}>
                  <span className={styles.bldKey}>{l.split(':')[0]}:</span>
                  {l.substring(l.indexOf(':') + 1)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <p className={styles.bldHint}>
        💡 Hai ô <strong>Mục tiêu</strong> và <strong>Đầu ra</strong> là quan trọng nhất. Thiếu chúng, Hermes buộc phải đoán.
      </p>
    </>
  )
}
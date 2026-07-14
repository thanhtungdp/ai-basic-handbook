'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface VsRow {
  type: 'bad' | 'good'
  text: string
}

interface VsMode {
  prompt: string
  tagClass: 'guess' | 'brief'
  tagText: string
  rows: VsRow[]
}

const VS_DATA: Record<'chatbot' | 'ceo', VsMode> = {
  chatbot: {
    prompt: 'Viết email follow-up.',
    tagClass: 'guess',
    tagText: 'Agent phải tự đoán',
    rows: [
      { type: 'bad', text: 'Gửi cho khách nào? — phải đoán' },
      { type: 'bad', text: 'Mục tiêu email? — phải đoán' },
      { type: 'bad', text: 'Giọng văn? — phải đoán' },
      { type: 'bad', text: 'Được gửi hay chỉ draft? — phải đoán' },
      { type: 'bad', text: 'Kết quả: email chung chung, dễ phải làm lại' },
    ],
  },
  ceo: {
    prompt:
      'Soạn email follow-up cho lead A sau buổi demo hôm qua. Mục tiêu là chốt lịch trao đổi 30 phút tuần này. Giọng chuyên nghiệp, ngắn. Chưa gửi, chỉ draft để anh duyệt.',
    tagClass: 'brief',
    tagText: 'Agent làm như đã được brief',
    rows: [
      { type: 'good', text: 'Đối tượng rõ: lead A sau demo' },
      { type: 'good', text: 'Mục tiêu rõ: chốt lịch 30 phút' },
      { type: 'good', text: 'Giọng & độ dài rõ: chuyên nghiệp, ngắn' },
      { type: 'good', text: 'Quyền hạn rõ: chưa gửi, chỉ draft' },
      { type: 'good', text: 'Kết quả: đúng mục tiêu, đúng quyền hạn' },
    ],
  },
}

export function VsToggle() {
  const [mode, setMode] = useState<'chatbot' | 'ceo'>('chatbot')
  const d = VS_DATA[mode]

  return (
    <div className={styles.vs}>
      <div className={styles.vsSwitch}>
        <button
          className={`${styles.vsBtn} ${mode === 'chatbot' ? styles.vsBtnOn : ''}`}
          onClick={() => setMode('chatbot')}
          type="button"
        >
          ⌨ Kiểu chatbot
        </button>
        <button
          className={`${styles.vsBtn} ${mode === 'ceo' ? styles.vsBtnOnCeo : ''}`}
          onClick={() => setMode('ceo')}
          type="button"
        >
          ★ Kiểu CEO
        </button>
      </div>
      <div className={styles.vsBody}>
        <div className={styles.vsPrompt}>
          <div className={styles.vsLabel}>Prompt bạn gửi</div>
          <div className={styles.vsPromptText}>{d.prompt}</div>
        </div>
        <div className={styles.vsResult}>
          <div className={styles.vsLabel}>Hermes phải xử lý</div>
          {d.rows.map((r, i) => (
            <div key={i} className={`${styles.vsRline} ${r.type === 'bad' ? styles.vsRlineBad : styles.vsRlineGood}`}>
              {r.text}
            </div>
          ))}
          <span className={`${styles.vsTag} ${d.tagClass === 'brief' ? styles.vsTagBrief : styles.vsTagGuess}`}>
            {d.tagText}
          </span>
        </div>
      </div>
    </div>
  )
}
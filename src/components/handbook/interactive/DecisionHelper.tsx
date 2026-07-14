'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface Question {
  key: string
  text: string
}

const QUESTIONS: Question[] = [
  { key: 'CÂU 1', text: 'Bạn chỉ đang học / thử nghiệm vài ngày?' },
  { key: 'CÂU 2', text: 'Cần agent chạy ổn định 24/7 (kể cả khi laptop tắt)?' },
  { key: 'CÂU 3', text: 'Cần nhận lệnh Telegram, chạy cron hoặc nối webhook?' },
]

type Answer = 0 | 1 | null

export function DecisionHelper() {
  const [answers, setAnswers] = useState<Answer[]>([null, null, null])

  const setAnswer = (i: number, v: 0 | 1) => {
    const next = [...answers] as Answer[]
    next[i] = v
    setAnswers(next)
  }

  const allAnswered = !answers.includes(null)
  const vps = answers[1] === 1 || answers[2] === 1
  const left = answers.filter((a) => a === null).length

  return (
    <div className={styles.decide}>
      <div className={styles.decideQ}>
        {QUESTIONS.map((q, i) => (
          <div key={i} className={styles.decideRow}>
            <div className={styles.decideRowText}>
              <strong>{q.key}</strong>
              {q.text}
            </div>
            <div className={styles.decideSeg}>
              <button
                className={answers[i] === 1 ? styles.decideSegYes : ''}
                onClick={() => setAnswer(i, 1)}
                type="button"
              >
                Có
              </button>
              <button
                className={answers[i] === 0 ? styles.decideSegNo : ''}
                onClick={() => setAnswer(i, 0)}
                type="button"
              >
                Chưa
              </button>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`${styles.decideOut} ${
          allAnswered ? (vps ? styles.decideOutVps : styles.decideOutPersonal) : ''
        }`}
      >
        {!allAnswered ? (
          <>
            <div className={styles.decideOutIcon}>🤔</div>
            <div className={styles.decideOutLabel}>Gợi ý setup</div>
            <div className={styles.decideOutPick}>Còn {left} câu →</div>
            <div className={styles.decideOutWhy}>
              Trả lời hết 3 câu để xem gợi ý.
            </div>
          </>
        ) : vps ? (
          <>
            <div className={styles.decideOutIcon}>☁️</div>
            <div className={styles.decideOutLabel}>Gợi ý setup</div>
            <div className={styles.decideOutPick}>Cloud VPS</div>
            <div className={styles.decideOutWhy}>
              Bạn cần agent online 24/7 và nối Telegram/cron/webhook. Dùng VPS
              Hermes (tino.vn/vps-hermes) để không phụ thuộc laptop CEO.
            </div>
          </>
        ) : (
          <>
            <div className={styles.decideOutIcon}>💻</div>
            <div className={styles.decideOutLabel}>Gợi ý setup</div>
            <div className={styles.decideOutPick}>Máy cá nhân</div>
            <div className={styles.decideOutWhy}>
              Bạn đang học & thử. Cứ cài trên máy cá nhân trước — đủ để chạy
              agent đầu tiên, thử prompt, tạo skill nhỏ. Khi chạy thật mới
              chuyển VPS.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const QUESTIONS = [
  'Hermes có biết việc này phục vụ mục tiêu gì không?',
  'Hermes có đủ dữ liệu đầu vào chưa?',
  'Đầu ra mong muốn có rõ format không?',
  'Hermes có biết quyền hạn của mình không?',
  'Hermes có biết khi nào phải hỏi lại không?',
]

export function PromptScorer() {
  const [answers, setAnswers] = useState<boolean[]>(new Array(QUESTIONS.length).fill(false))

  const score = answers.filter(Boolean).length
  let verdict = ''
  let verdictText = ''
  if (score >= 4) {
    verdict = 'Prompt kiểu CEO ✓'
    verdictText = 'Đủ rõ để Hermes làm đúng mà không phải đoán nhiều. Gửi được.'
  } else if (score >= 3) {
    verdict = 'Gần đạt'
    verdictText = 'Bổ sung thêm 1–2 phần còn thiếu để chắc chắn.'
  } else {
    verdict = 'Chưa phải prompt CEO'
    verdictText = 'Thiếu hơn 2/5. Hermes sẽ phải phỏng đoán — dễ ra sai kết quả.'
  }

  const setAnswer = (i: number, val: boolean) => {
    const next = [...answers]
    next[i] = val
    setAnswers(next)
  }

  return (
    <div className={styles.scorer}>
      {QUESTIONS.map((q, i) => (
        <div key={i} className={styles.scQ}>
          <div className={styles.scText}>{q}</div>
          <div className={styles.scSeg}>
            <button
              className={`${styles.scYes} ${answers[i] ? styles.scYesOn : ''}`}
              onClick={() => setAnswer(i, true)}
              type="button"
            >
              Có
            </button>
            <button
              className={`${styles.scNo} ${!answers[i] && answers[i] !== undefined ? styles.scNoOn : ''}`}
              onClick={() => setAnswer(i, false)}
              type="button"
            >
              Chưa
            </button>
          </div>
        </div>
      ))}
      <div className={styles.scFoot}>
        <div className={styles.scGauge}>
          <span className={styles.scN}>{score}</span>
          <span className={styles.scOf}>/5 đạt</span>
        </div>
        <div className={styles.scVerdict}>
          <span className={styles.scVt}>{verdict}</span>
          {verdictText}
        </div>
      </div>
    </div>
  )
}
'use client'

import React from 'react'
import styles from '../handbook.module.css'

interface ExpectBehaviorProps {
  prompt: React.ReactNode
  questions: string[]
}

export function ExpectBehavior({ prompt, questions }: ExpectBehaviorProps) {
  return (
    <div className={styles.expect}>
      <div className={styles.expectHalf}>
        <div className={styles.expectHead}>↳ Bạn gửi</div>
        <p className={styles.expectPrompt}>{prompt}</p>
      </div>
      <div className={styles.expectHalf}>
        <div className={styles.expectHead}>Hermes nên hỏi lại</div>
        <ul className={styles.expectList}>
          {questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
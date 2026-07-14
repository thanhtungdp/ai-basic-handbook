'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const QUESTIONS = [
  { key: 'CÂU 1', text: 'Việc này có lặp lại không?' },
  { key: 'CÂU 2', text: 'Đầu vào có rõ không? (form, email, sheet, brief…)' },
  { key: 'CÂU 3', text: 'Đầu ra mong muốn có hình dung rõ không?' },
  { key: 'CÂU 4', text: 'Có tiêu chuẩn đúng/sai để kiểm tra không?' },
  { key: 'CÂU 5', text: 'Có bước duyệt trước khi gửi ra ngoài không?' },
]

interface AgentThinkingQuizProps {
  defaultTask?: string
}

export function AgentThinkingQuiz({ defaultTask = '' }: AgentThinkingQuizProps) {
  const [task, setTask] = useState(defaultTask)
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(QUESTIONS.length).fill(null))

  const handleAnswer = (index: number, value: boolean) => {
    const updated = [...answers]
    updated[index] = value
    setAnswers(updated)
  }

  const answeredCount = answers.filter((a) => a !== null).length
  const score = answers.filter((a) => a === true).length
  const isComplete = answeredCount === QUESTIONS.length

  let verdictClass = styles.quizVerdictNo
  let verdictLabel = 'Kết luận'
  let verdictText = 'Trả lời 5 câu để xem việc này có nên giao cho Hermes.'

  if (isComplete) {
    const taskName = task.trim() || 'Việc này'
    if (score >= 4) {
      verdictClass = styles.quizVerdictGo
      verdictLabel = 'Nên giao'
      verdictText = `${taskName} là ứng viên tốt để giao cho Hermes. Bắt đầu từ cấp Skill và thêm bước duyệt.`
    } else if (score === 3) {
      verdictClass = styles.quizVerdictMaybe
      verdictLabel = 'Có thể giao, cần điều chỉnh'
      verdictText = `${taskName} giao được nhưng hãy làm rõ đầu vào/đầu ra trước, và giữ approval flow.`
    } else {
      verdictClass = styles.quizVerdictNo
      verdictLabel = 'Chưa nên vội'
      verdictText = `${taskName} còn thiếu tiêu chí. Chuẩn hóa quy trình thủ công trước khi giao cho agent.`
    }
  } else if (answeredCount > 0) {
    verdictText = `Còn ${QUESTIONS.length - answeredCount} câu chưa trả lời…`
  }

  return (
    <div className={styles.quiz}>
      <div className={styles.quizTop}>
        <label htmlFor="quizTask">Việc bạn muốn chấm</label>
        <input
          id="quizTask"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="VD: Soạn báo giá cho khách mới"
        />
      </div>
      {QUESTIONS.map((q, index) => (
        <div key={index} className={styles.quizQ}>
          <div className={styles.quizQT}>
            <strong>{q.key}</strong>
            {q.text}
          </div>
          <div className={styles.quizSeg}>
            <button
              className={answers[index] === true ? styles.quizSegYes : ''}
              onClick={() => handleAnswer(index, true)}
            >
              Có
            </button>
            <button
              className={answers[index] === false ? styles.quizSegNo : ''}
              onClick={() => handleAnswer(index, false)}
            >
              Chưa
            </button>
          </div>
        </div>
      ))}
      <div className={styles.quizFoot}>
        <div className={styles.quizScore}>
          <div className={styles.quizScoreN}>{score}</div>
          <div className={styles.quizScoreOf}>/5 tiêu chí đạt</div>
        </div>
        <div className={verdictClass}>
          <span className={styles.quizVerdictLabel}>{verdictLabel}</span>
          <span>{verdictText}</span>
        </div>
      </div>
    </div>
  )
}

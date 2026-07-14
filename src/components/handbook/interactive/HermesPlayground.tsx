'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from '../handbook.module.css'

interface Step {
  text: string
  tag: string
}

interface Scenario {
  match: string[]
  steps: Step[]
  reply: string
  approve: string
}

const SCENARIOS: Scenario[] = [
  {
    match: ['báo giá', 'bao gia', 'quote'],
    steps: [
      { text: 'Đọc dữ liệu khách + bảng giá', tag: 'memory' },
      { text: 'Mở template báo giá chuẩn', tag: 'skill' },
      { text: 'Tính & kiểm tra tổng tiền', tag: 'tool' },
      { text: 'Xuất file DOCX + PDF', tag: 'file' },
      { text: 'Soạn nội dung email', tag: 'skill' },
    ],
    reply: 'Xong rồi anh. Em đã tạo báo giá theo mẫu chuẩn, đã đối chiếu tổng tiền, xuất DOCX + PDF và soạn sẵn email. Em CHƯA gửi — chờ anh duyệt.',
    approve: 'Gửi báo giá + email cho khách A?',
  },
  {
    match: ['email', 'follow', 'theo dõi', 'theo doi'],
    steps: [
      { text: 'Quét inbox khách chưa phản hồi', tag: 'tool' },
      { text: 'Đối chiếu lịch sử trao đổi', tag: 'memory' },
      { text: 'Soạn 3 email follow-up', tag: 'skill' },
      { text: 'Gắn nhắc lịch theo dõi', tag: 'cron' },
    ],
    reply: 'Em đã soạn 3 email follow-up cho 3 khách đang im. Mỗi email bám đúng ngữ cảnh lần trao đổi trước. Em để anh duyệt trước khi gửi.',
    approve: 'Duyệt & gửi 3 email follow-up?',
  },
  {
    match: ['content', 'bài viết', 'bai viet', 'linkedin', 'post'],
    steps: [
      { text: 'Lấy giọng thương hiệu đã lưu', tag: 'skill' },
      { text: 'Tạo 5 ý tưởng theo pipeline', tag: 'memory' },
      { text: 'Draft bài theo hook→insight→CTA', tag: 'skill' },
      { text: 'Đặt lịch nhắc duyệt thứ Hai', tag: 'cron' },
    ],
    reply: 'Em đã tạo 5 ý tưởng + draft 1 bài LinkedIn theo giọng thương hiệu của anh. Mỗi sáng thứ Hai em sẽ tự đề xuất bài mới và nhắc anh duyệt.',
    approve: 'Lưu "Content CEO POV" thành skill dùng lại?',
  },
  {
    match: ['báo cáo', 'bao cao', 'report', 'tổng hợp', 'tong hop'],
    steps: [
      { text: 'Thu thập số liệu ngày', tag: 'tool' },
      { text: 'Đối chiếu chỉ tiêu tuần', tag: 'memory' },
      { text: 'Dựng báo cáo + biểu đồ', tag: 'file' },
      { text: 'Gửi vào 8:00 mỗi sáng', tag: 'cron' },
    ],
    reply: 'Em đã dựng báo cáo ngày gồm số liệu chính + cảnh báo lệch chỉ tiêu. Em có thể tự gửi mỗi sáng 8:00 nếu anh bật cron.',
    approve: 'Bật báo cáo tự động mỗi sáng 8:00?',
  },
]

const FALLBACK: Scenario = {
  match: [],
  steps: [
    { text: 'Phân tích yêu cầu', tag: 'memory' },
    { text: 'Chọn skill/tool phù hợp', tag: 'skill' },
    { text: 'Thực hiện & kiểm tra', tag: 'tool' },
    { text: 'Tổng hợp kết quả', tag: 'file' },
  ],
  reply: 'Em đã xử lý yêu cầu của anh theo quy trình agent: hiểu ngữ cảnh → chọn công cụ → làm → kiểm tra. Em để anh duyệt trước khi đẩy ra ngoài.',
  approve: 'Duyệt kết quả này?',
}

const SAMPLES = [
  'Tạo báo giá cho khách A, xuất DOCX/PDF, chưa gửi — chỉ draft để anh duyệt',
  'Soạn email follow-up cho khách đang im',
  'Mỗi sáng thứ Hai tạo 5 ý tưởng bài LinkedIn',
  'Dựng báo cáo ngày và gửi lúc 8:00',
]

export function HermesPlayground() {
  const [messages, setMessages] = useState<React.ReactNode[]>([])
  const [input, setInput] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial greeting
    addMessage('bot', 'Chào anh 👋 Em là Hermes. Giao cho em một việc lặp — em sẽ làm và trình anh duyệt. Thử chọn một mẫu bên dưới nhé.')
  }, [])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages])

  const addMessage = (who: 'me' | 'bot', text: string | React.ReactNode) => {
    const time = new Date().toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' })
    const label = who === 'me' ? 'Bạn' : 'Hermes'

    const bubble = (
      <div key={Date.now() + Math.random()} className={`${styles.pgBubble} ${styles[`pgBubble${who === 'me' ? 'Me' : 'Bot'}`]}`}>
        {typeof text === 'string' ? text : text}
        <small>{label} · {time}</small>
      </div>
    )

    setMessages((prev) => [...prev, bubble])
  }

  const addTyping = () => {
    const typing = (
      <div key="typing" className={`${styles.pgBubble} ${styles.pgTyping}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
    setMessages((prev) => [...prev, typing])
    return 'typing'
  }

  const removeTyping = () => {
    setMessages((prev) => prev.filter((m) => {
      if (React.isValidElement(m)) {
        return m.key !== 'typing'
      }
      return true
    }))
  }

  const handleSend = async () => {
    const value = input.trim()
    if (!value || isBusy) return

    setIsBusy(true)
    setInput('')
    addMessage('me', value)

    // Find matching scenario
    const scenario =
      SCENARIOS.find((s) => s.match.some((m) => value.toLowerCase().includes(m))) || FALLBACK

    // Show typing
    addTyping()

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const typingDelay = prefersReducedMotion ? 200 : 850

    setTimeout(() => {
      removeTyping()

      // Add steps card
      const stepsCard = (
        <div key={Date.now()} className={styles.pgSteps}>
          <div className={styles.pgStepsHead}>⚙ Hermes đang xử lý</div>
          {scenario.steps.map((step, i) => (
            <div
              key={i}
              className={`${styles.pgStep} ${styles.pgStepDone}`}
              style={{
                animationDelay: prefersReducedMotion ? '0s' : `${i * 0.52}s`,
              }}
            >
              <span className={styles.pgStepTick}>✓</span>
              {step.text}
              <span className={styles.pgStepBadge}>{step.tag}</span>
            </div>
          ))}
        </div>
      )
      setMessages((prev) => [...prev, stepsCard])

      const after = prefersReducedMotion ? 300 : scenario.steps.length * 520 + 700

      setTimeout(() => {
        addMessage('bot', scenario.reply)

        const handleApprove = () => {
          // Remove approval card
          setMessages((prev) => prev.filter((m) => {
            if (React.isValidElement(m)) {
              return !m.key?.toString().includes('approve')
            }
            return true
          }))

          // Add confirmation message
          setTimeout(() => {
            addMessage('bot', '✓ Đã duyệt. Em thực hiện ngay. Anh sẽ nhận thông báo khi hoàn thành.')
            setIsBusy(false)
          }, 100)
        }

        const handleEdit = () => {
          setMessages((prev) => prev.filter((m) => {
            if (React.isValidElement(m)) {
              return !m.key?.toString().includes('approve')
            }
            return true
          }))

          setTimeout(() => {
            addMessage('bot', '✎ OK, anh muốn sửa gì? Em lắng nghe.')
            setIsBusy(false)
          }, 100)
        }

        const handleCancel = () => {
          setMessages((prev) => prev.filter((m) => {
            if (React.isValidElement(m)) {
              return !m.key?.toString().includes('approve')
            }
            return true
          }))

          setTimeout(() => {
            addMessage('bot', '✕ Đã hủy. Anh cần em làm gì khác không?')
            setIsBusy(false)
          }, 100)
        }

        const approveCard = (
          <div key={Date.now() + '-approve'} className={styles.pgApprove}>
            <div className={styles.pgApproveTitle}>⏸ Chờ CEO duyệt</div>
            <div className={styles.pgApproveDesc}>{scenario.approve}</div>
            <div className={styles.pgApproveRow}>
              <button
                className={`${styles.pgApproveBtn} ${styles.pgApproveBtnYes}`}
                onClick={handleApprove}
              >
                ✓ Duyệt
              </button>
              <button
                className={styles.pgApproveBtn}
                onClick={handleEdit}
              >
                ✎ Sửa
              </button>
              <button
                className={styles.pgApproveBtn}
                onClick={handleCancel}
              >
                ✕ Hủy
              </button>
            </div>
          </div>
        )
        setMessages((prev) => [...prev, approveCard])
      }, after)
    }, typingDelay)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <>
      <div className={styles.pgContainer}>
        <div className={styles.pgBar}>
          <div className={styles.pgDot}>H</div>
          <div>Hermes Agent — Telegram</div>
          <div className={styles.pgLive}>ĐANG TRỰC</div>
        </div>
        <div className={styles.pgBody} ref={bodyRef}>
          {messages}
        </div>
        <div className={styles.pgInput}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Giao một việc cho Hermes…"
            disabled={isBusy}
          />
          <button onClick={handleSend} disabled={isBusy}>
            GỬI
          </button>
        </div>
      </div>
      <div className={styles.pgChips}>
        {SAMPLES.map((sample, i) => (
          <div
            key={i}
            className={styles.pgChip}
            onClick={() => {
              setInput(sample)
              setTimeout(handleSend, 100)
            }}
          >
            {sample}
          </div>
        ))}
      </div>
      <div className={styles.pgNote}>
        ↑ Mô phỏng minh họa luồng agent: nhận lệnh → dùng tool/skill → tạo kết quả → xin duyệt.
        Không gọi hệ thống thật.
      </div>
    </>
  )
}

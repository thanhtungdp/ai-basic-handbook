'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface SortItem {
  t: string
  keep: boolean
}

const ITEMS: SortItem[] = [
  { t: 'Quy trình từng bước', keep: true },
  { t: 'Tiêu chuẩn đầu ra (độ dài, format)', keep: true },
  { t: 'Tên khách cụ thể của một deal', keep: false },
  { t: 'Cách hỏi lại khi thiếu dữ liệu', keep: true },
  { t: 'Giá cụ thể của một deal hôm nay', keep: false },
  { t: 'Danh sách lỗi cần tránh', keep: true },
  { t: 'Nội dung email chỉ dùng một lần', keep: false },
  { t: 'Việc đã hoàn thành trong hôm nay', keep: false },
]

export function SkillSorter() {
  const [answered, setAnswered] = useState<boolean[]>(new Array(ITEMS.length).fill(false))
  const [correct, setCorrect] = useState<boolean[]>(new Array(ITEMS.length).fill(false))

  const handleAnswer = (i: number, choseKeep: boolean) => {
    const nextAns = [...answered]
    nextAns[i] = true
    setAnswered(nextAns)
    const nextCor = [...correct]
    nextCor[i] = choseKeep === ITEMS[i].keep
    setCorrect(nextCor)
  }

  const rightCount = correct.filter(Boolean).length
  const answeredCount = answered.filter(Boolean).length
  const allDone = answeredCount === ITEMS.length
  const allRight = rightCount === ITEMS.length

  const reset = () => {
    setAnswered(new Array(ITEMS.length).fill(false))
    setCorrect(new Array(ITEMS.length).fill(false))
  }

  return (
    <div className={styles.sorter}>
      <div className={styles.sortDeck}>
        {ITEMS.map((it, i) => (
          <div
            key={i}
            className={`${styles.sortCard} ${answered[i] ? styles.sortCardAnswered : ''} ${answered[i] ? (correct[i] ? styles.sortCardRight : styles.sortCardWrong) : ''}`}
          >
            <div className={styles.sortTxt}>{it.t}</div>
            {!answered[i] && (
              <div className={styles.sortBtns}>
                <button className={`${styles.sb} ${styles.sbKeep}`} onClick={() => handleAnswer(i, true)} type="button">📥 Lưu</button>
                <button className={`${styles.sb} ${styles.sbDrop}`} onClick={() => handleAnswer(i, false)} type="button">🗑 Bỏ</button>
              </div>
            )}
            {answered[i] && (
              <div className={styles.sortRes}>
                {correct[i]
                  ? `✓ Đúng — ${it.keep ? 'thuộc skill' : 'dữ liệu tạm'}`
                  : `✕ Nên ${it.keep ? 'LƯU (thuộc skill)' : 'BỎ (dữ liệu tạm)'}`}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.sortScore}>
        <div className={styles.ssN}>{rightCount}</div>
        <span className={styles.ssOf}>/ {ITEMS.length} phân loại đúng</span>
        <div className={styles.ssMsg}>
          {!allDone
            ? <>Còn <b>{ITEMS.length - answeredCount}</b> mục.</>
            : allRight
              ? <>Hoàn hảo! Bạn phân biệt rõ <b>cách làm</b> với <b>dữ liệu tạm thời</b>.</>
              : <>Nhớ: skill lưu <b>quy trình, tiêu chuẩn, format, lỗi cần tránh</b> — không lưu tên/giá/nội dung dùng một lần.</>
          }
        </div>
        {allDone && (
          <button className={styles.ssReset} onClick={reset} type="button">Làm lại</button>
        )}
      </div>
    </div>
  )
}
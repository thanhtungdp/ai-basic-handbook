'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

export interface FlashCard {
  question: string
  answer: string
}

interface FlashcardsProps {
  cards: FlashCard[]
}

export function Flashcards({ cards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 100)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }, 100)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleDotClick = (index: number) => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex(index)
    }, 100)
  }

  if (cards.length === 0) return null

  return (
    <div className={styles.flashcardWrapper}>
      <div className={styles.flashcardTop}>
        <span>FLASHCARD · ôn nhanh khái niệm cốt lõi</span>
        <span>
          Thẻ <strong>{currentIndex + 1}</strong>/<span>{cards.length}</span>
        </span>
      </div>
      <div
        className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleFlip}
      >
        <div className={styles.flashcardInner}>
          <div className={`${styles.flashcardFace} ${styles.flashcardFront}`}>
            <div className={styles.flashcardLabel}>Câu hỏi</div>
            <div className={styles.flashcardQuestion}>{cards[currentIndex].question}</div>
            <div className={styles.flashcardHint}>bấm để lật ↻</div>
          </div>
          <div className={`${styles.flashcardFace} ${styles.flashcardBack}`}>
            <div className={styles.flashcardLabel}>Trả lời</div>
            <div className={styles.flashcardAnswer}>{cards[currentIndex].answer}</div>
            <div className={styles.flashcardHint}>bấm để lật ↻</div>
          </div>
        </div>
      </div>
      <div className={styles.flashcardNav}>
        <div className={styles.flashcardDots}>
          {cards.map((_, index) => (
            <i
              key={index}
              className={`${styles.flashcardDot} ${index === currentIndex ? styles.active : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handleDotClick(index)
              }}
            />
          ))}
        </div>
        <button className={`${styles.btn} ${styles.btnSmall}`} onClick={handlePrev}>
          ← Trước
        </button>
        <button
          className={`${styles.btn} ${styles.btnSmall} ${styles.btnPrimary}`}
          onClick={handleNext}
        >
          Tiếp →
        </button>
      </div>
    </div>
  )
}

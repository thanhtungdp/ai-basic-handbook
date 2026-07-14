'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

export interface LadderLevel {
  lv: string
  name: string
  sub: string
  ceo: string
  hermes: string
  example: string
}

interface AutomationLadderProps {
  levels: LadderLevel[]
}

export function AutomationLadder({ levels }: AutomationLadderProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeLevel = levels[activeIndex]

  return (
    <div className={styles.ladder}>
      <div className={styles.ladderSteps}>
        {levels.map((level, index) => (
          <div
            key={index}
            className={`${styles.ladderStep} ${index === activeIndex ? styles.ladderStepActive : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <div className={styles.ladderStepLv}>{level.lv}</div>
            <div>
              <div className={styles.ladderStepName}>{level.name}</div>
              <div className={styles.ladderStepSub}>{level.sub}</div>
            </div>
            <div className={styles.ladderStepRung}>▸</div>
          </div>
        ))}
      </div>
      <div className={styles.ladderDetail}>
        <div className={styles.ladderDetailLabel}>Cấp độ {activeIndex + 1} / {levels.length}</div>
        <h4 className={styles.ladderDetailTitle}>{activeLevel.name}</h4>
        <div className={styles.ladderWho}>
          <div className={styles.ladderWhoCeo}>
            <div className={styles.ladderWhoLabel}>CEO làm gì</div>
            <div className={styles.ladderWhoVal}>{activeLevel.ceo}</div>
          </div>
          <div className={styles.ladderWhoHermes}>
            <div className={styles.ladderWhoLabel}>Hermes làm gì</div>
            <div className={styles.ladderWhoVal}>{activeLevel.hermes}</div>
          </div>
        </div>
        <div className={styles.ladderExample}>
          <div className={styles.ladderExampleLabel}>Ví dụ với content</div>
          <div
            className={styles.ladderExampleCmd}
            dangerouslySetInnerHTML={{ __html: activeLevel.example }}
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

interface ModelNode {
  id: string
  name: string
  role: string
}

// quadrant order: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
const PLACEMENT: ModelNode[] = [
  { id: 'glm', name: 'GLM 5.2', role: 'Backup đa dụng' }, // top-left
  { id: 'opus', name: 'Opus 4.8', role: 'Chiến lược · UI · nội dung sâu' }, // top-right
  { id: 'deepseek', name: 'DeepSeek 4-Pro', role: 'Backup kỹ thuật/lập luận' }, // bottom-left
  { id: 'gpt', name: 'GPT 5.5', role: 'Điều phối · tool · workflow' }, // bottom-right
]

interface TaskBtn {
  rec: 'gpt' | 'opus' | 'backup'
  head: string
  body: string
}

const TASKS: TaskBtn[] = [
  {
    rec: 'gpt',
    head: 'VẬN HÀNH',
    body: 'Chạy quy trình, gọi tool, thực thi workflow nhiều bước',
  },
  {
    rec: 'opus',
    head: 'CHIẾN LƯỢC',
    body: 'Lập kế hoạch, viết framework, thiết kế giao diện, phân tích sâu',
  },
  {
    rec: 'backup',
    head: 'DỰ PHÒNG',
    body: 'Model chính lỗi/chậm, hoặc cần tiết kiệm hơn',
  },
]

const REC_MAP: Record<TaskBtn['rec'], { ids: string[]; html: React.ReactNode }> = {
  gpt: {
    ids: ['gpt'],
    html: (
      <>
        → Dùng <b>GPT 5.5</b> cho vận hành: làm nhiều bước, gọi tool, kiểm tra
        kết quả.
      </>
    ),
  },
  opus: {
    ids: ['opus'],
    html: (
      <>
        → Dùng <b>Opus 4.8</b> cho chiều sâu: reasoning, cấu trúc, tư duy
        sản phẩm/UX.
      </>
    ),
  },
  backup: {
    ids: ['glm', 'deepseek'],
    html: (
      <>
        → Khi model chính lỗi/chậm hoặc cần tiết kiệm: <b>GLM 5.2</b> (đa dụng)
        hoặc <b>DeepSeek 4-Pro</b> (kỹ thuật/lập luận).
      </>
    ),
  },
}

function keyForId(id: string): TaskBtn['rec'] {
  if (id === 'gpt') return 'gpt'
  if (id === 'opus') return 'opus'
  return 'backup'
}

export function ModelMatrix() {
  const [active, setActive] = useState<TaskBtn['rec'] | null>(null)

  const selectTask = (rec: TaskBtn['rec']) => {
    setActive((cur) => (cur === rec ? null : rec))
  }

  const selectNode = (id: string) => {
    const key = keyForId(id)
    setActive((cur) => (cur === key ? null : key))
  }

  return (
    <div className={styles.matrixWrap}>
      <div className={styles.matrix}>
        <div className={styles.matrixAxY}>Chiến lược · Sáng tạo →</div>
        <div className={styles.matrixAxX}>Vận hành · Tool execution →</div>
        <div className={styles.matrixQuad}>
          {PLACEMENT.map((m) => (
            <div key={m.id}>
              <div
                className={`${styles.mnode} ${
                  active && REC_MAP[active].ids.includes(m.id)
                    ? styles.mnodeOn
                    : ''
                }`}
                data-m={m.id}
                onClick={() => selectNode(m.id)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.mnodeName}>{m.name}</div>
                <div className={styles.mnodeRole}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.matrixSide}>
        <div className={styles.matrixLab}>Bạn cần làm gì?</div>
        {TASKS.map((t) => (
          <button
            key={t.rec}
            className={`${styles.taskbtn} ${active === t.rec ? styles.taskbtnOn : ''}`}
            onClick={() => selectTask(t.rec)}
            type="button"
          >
            <span className={styles.taskbtnHead}>{t.head}</span>
            {t.body}
          </button>
        ))}
        <div className={styles.matrixRec}>
          {active ? (
            REC_MAP[active].html
          ) : (
            <span className={styles.matrixRecEmpty}>
              Chọn một việc để xem model gợi ý…
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
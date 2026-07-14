'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const data = {
  chat: {
    label: '💬 AI chat — tư vấn',
    say: <>Hermes “trả lời hay”, nhưng <b>CEO vẫn phải tự làm phần còn lại</b>. Mọi thao tác trong hệ thống vẫn nằm trên tay bạn:</>,
    items: ['Tự mở file','Tự copy nội dung sang email','Tự cập nhật sheet','Tự kiểm tra website','Tự gửi tài liệu cho khách','Tự nhớ lịch chạy báo cáo'],
  },
  agent: {
    label: '⚙ AI agent — vận hành',
    say: <>Hermes <b>hành động trong hệ thống thật</b> qua tool — bạn ra lệnh, agent làm và trả kết quả hoặc chờ duyệt:</>,
    items: ['Đọc & tạo file trong workspace','Soạn draft email, chờ duyệt','Đọc / cập nhật sheet theo rule','Research web, tách fact/giả định','Gửi tài liệu khi được phép','Chạy báo cáo theo lịch cron'],
  },
}

export function ChatAgentToggle04() {
  const [mode, setMode] = useState<'chat' | 'agent'>('chat')
  const d = data[mode]
  return (
    <div className={styles.ba04}>
      <div className={styles.ba04Switch}>
        <button type="button" className={`${styles.ba04Btn} ${mode === 'chat' ? styles.ba04BtnOn : ''}`} onClick={() => setMode('chat')}>{data.chat.label}</button>
        <button type="button" className={`${styles.ba04Btn} ${mode === 'agent' ? styles.ba04BtnOnAgent : ''}`} onClick={() => setMode('agent')}>{data.agent.label}</button>
      </div>
      <div className={styles.ba04Body}>
        <div className={styles.ba04Say}>{d.say}</div>
        <div className={styles.ba04List}>
          {d.items.map((t) => (
            <div key={t} className={`${styles.ba04Li} ${mode === 'agent' ? styles.ba04LiHerm : styles.ba04LiCeo}`}>
              <span className={styles.ba04Icon}>{mode === 'agent' ? '⬡' : '👤'}</span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

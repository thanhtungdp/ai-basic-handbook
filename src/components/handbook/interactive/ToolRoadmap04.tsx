'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

const stages = [
  {ic:'📁', n:'Mới học', t:'File / folder', tool:'File / folder', why:'Dễ kiểm soát, ít rủi ro nhất — nơi tốt nhất để tập cho agent làm việc có cấu trúc.'},
  {ic:'✈️', n:'Dùng hằng ngày', t:'Telegram', tool:'Telegram', why:'CEO ra lệnh nhanh mọi lúc, mọi nơi — kể cả từ điện thoại.'},
  {ic:'✉️', n:'Sales / content', t:'Gmail + Sheets', tool:'Gmail + Google Sheets', why:'Gắn trực tiếp với quy trình lead, email và báo giá — nơi ROI rõ nhất.'},
  {ic:'🌐', n:'Research / ops', t:'Web / browser', tool:'Web / browser', why:'Thu thập và kiểm tra thông tin công khai cho sales và vận hành.'},
  {ic:'⏱️', n:'Chạy 24/7', t:'Cron / webhook', tool:'Cron / webhook', why:'Việc lặp tự chạy đúng lịch hoặc đúng sự kiện — không cần CEO nhớ.'},
]
const usecases = {
  'Báo giá': [['📁','File / template'],['✉️','Email draft'],['📊','Sheet tracking']],
  'Content': [['📁','Folder content'],['🌐','Web research'],['⏱️','Lịch đăng']],
  'Sales follow-up': [['✉️','Gmail'],['📊','Google Sheets'],['✈️','Telegram duyệt']],
} as const

export function ToolRoadmap04() {
  const [cur, setCur] = useState(0)
  const [uc, setUc] = useState<keyof typeof usecases | null>(null)
  const s = stages[cur]
  return <>
    <div className={styles.roadmap04}>{stages.map((x,i)=><button type="button" key={x.t} className={`${styles.rm04Stage} ${i===cur?styles.rm04On:''}`} onClick={()=>setCur(i)}><div>{x.ic}</div><small>{x.n}</small><b>{x.t}</b></button>)}</div>
    <div className={styles.rm04Detail}><span>{s.tool}</span><p>{s.why}</p></div>
    <p className={styles.uc04Label}>Kết nối theo use case, không nối tool vì thấy hay. Bấm một use case:</p>
    <div className={styles.uc04Pick}>{(Object.keys(usecases) as (keyof typeof usecases)[]).map(k=><button type="button" key={k} onClick={()=>setUc(k)} className={uc===k?styles.uc04On:''}>{k}</button>)}</div>
    {uc && <div className={styles.uc04Out}><div>Tool stack cho “{uc}”</div><p>{usecases[uc].map(([ic,t])=><span key={t}><b>{ic}</b>{t}</span>)}</p></div>}
  </>
}

'use client'
import React, { useState } from 'react'
import styles from '../handbook.module.css'
const rows=[['📝','Tóm tắt thông tin','ok','Tự làm và trả kết quả'],['✏️','Tạo draft','appr','Tự làm, chờ CEO duyệt'],['📤','Gửi email cho khách','appr','Phải hỏi lại trước khi gửi'],['🗂️','Cập nhật dữ liệu quan trọng','appr','Phải nêu thay đổi và xin duyệt'],['🗑️','Xóa file / dữ liệu','no','Không tự làm nếu chưa có lệnh rõ']]
export function TelegramRules04(){const[on,setOn]=useState<number|null>(null);return <div className={styles.tgRules04}>{rows.map(([ic,w,cls,a],i)=><div key={w} onClick={()=>setOn(on===i?null:i)} className={`${styles.tgRow04} ${on===i?styles.tgRowOn04:''}`}><div className={styles.tgWork04}><span>{ic}</span>{w}</div><div className={`${styles.tgPerm04} ${styles['perm_'+cls]}`}><i />{a}</div></div>)}</div>}

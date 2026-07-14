'use client'
import React,{useState}from'react'
import styles from '../handbook.module.css'
const folders=[['inputs','Brief, ghi chú, dữ liệu đầu vào'],['outputs','Kết quả Hermes tạo ra'],['templates','Mẫu email, báo giá, báo cáo'],['reports','Báo cáo định kỳ'],['archive','Lưu bản cũ hoặc kết quả đã duyệt']]
export function FolderTree04(){const[on,setOn]=useState(0);return <div className={styles.tree04}><div className={styles.treeRoot04}>📂 /hermes-workspace</div>{folders.map(([f,d],i)=><div key={f} className={`${styles.treeItem04} ${on===i?styles.treeItemOn04:''}`} onClick={()=>setOn(i)}><span>📁</span>/{f}<em>{d}</em></div>)}</div>}

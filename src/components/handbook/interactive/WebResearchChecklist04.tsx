'use client'
import React from 'react'
import { Checklist } from './Checklist'
export function WebResearchChecklist04(){return <Checklist storageKey="hermes04_webcheck" items={[{text:'Có nguồn hoặc dấu hiệu kiểm chứng.'},{text:'Tách rõ fact và giả định.'},{text:'Không tự bịa số liệu.'},{text:'Có câu hỏi tiếp theo cho CEO / sales.'},{text:'Có đề xuất hành động cụ thể.'}]} completeMessage={<><strong>Research đạt chuẩn ✓</strong> Có nguồn, tách fact/giả định, không bịa.</>} progressMessage={(n,t)=><>Đã đạt <strong>{n}/{t}</strong> tiêu chí research.</>}/>}

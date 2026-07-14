'use client'

import React from 'react'
import { Checklist } from './Checklist'

export function Lesson02Checklist() {
  return (
    <Checklist
      storageKey="hermes02_check"
      items={[
        { text: 'Hiểu khác biệt giữa prompt chatbot và prompt kiểu CEO.' },
        { text: 'Biết công thức 6 phần: bối cảnh, mục tiêu, đầu vào, đầu ra, quyền hạn, khi nào hỏi lại.' },
        { text: 'Biết 3 mức giao việc: lệnh nhanh, brief có tiêu chuẩn, SOP nhỏ.' },
        { text: 'Biết thêm quyền hạn vào prompt.' },
        { text: 'Biết yêu cầu Hermes hỏi lại khi thiếu thông tin.' },
        { text: 'Có ít nhất 3 prompt kiểu CEO dùng được ngay.' },
      ]}
      completeMessage={
        <>
          <strong>Hoàn thành bài 02 ✓</strong> Bạn đã ra lệnh được kiểu CEO — sẵn sàng biến việc thành skill.
        </>
      }
      progressMessage={(c, t) => (
        <>
          Đã đạt <strong>{c}/{t}</strong> mục. Tiếp tục nhé.
        </>
      )}
    />
  )
}
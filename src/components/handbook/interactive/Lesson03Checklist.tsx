'use client'

import React, { useState } from 'react'
import { Checklist } from './Checklist'

export function Lesson03Checklist() {
  return (
    <Checklist
      storageKey="hermes03_check"
      items={[
        { text: 'Chọn được 1 việc thật để dạy Hermes.' },
        { text: 'Việc đó có đầu vào và đầu ra rõ.' },
        { text: 'Hermes đã tạo bản nháp đầu tiên.' },
        { text: 'Đã feedback ít nhất một vòng bằng tiêu chí cụ thể.' },
        { text: 'Hermes đã rút ra checklist quy trình.' },
        { text: 'Biết khi nào nên và không nên lưu skill.' },
        { text: 'Có ít nhất 1 skill / checklist sẵn sàng để lưu.' },
      ]}
      completeMessage={
        <>
          <strong>Hoàn thành bài 03 ✓</strong> Bạn đã dạy Hermes một việc thật và biến nó thành skill.
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
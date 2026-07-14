'use client'

import React, { useState, useEffect } from 'react'
import styles from '../handbook.module.css'

interface WorksheetRow {
  task: string
  freq: number // lần/tuần
  min: number // phút/lần
  ease: '1' | '2' | '3' // khó | vừa | dễ
}

const EASE_OPTIONS = {
  '1': 'Khó',
  '2': 'Vừa',
  '3': 'Dễ',
} as const

const DEFAULT_ROWS: WorksheetRow[] = [
  { task: 'Soạn báo giá', freq: 3, min: 30, ease: '2' },
  { task: 'Tóm tắt email khách', freq: 5, min: 20, ease: '3' },
  { task: 'Viết bài LinkedIn', freq: 2, min: 45, ease: '3' },
]

const STORAGE_KEY = 'hermes_handbook_00_worksheet'

function calculateHoursPerWeek(row: WorksheetRow): number {
  return (row.freq * row.min) / 60
}

function calculateROI(row: WorksheetRow): number {
  const hours = calculateHoursPerWeek(row)
  const roi = Math.round(hours * (1 + row.freq * 0.1) * Number(row.ease))
  return roi
}

function getROIColor(roi: number): string {
  if (roi >= 8) return '#1f7a4d' // good
  if (roi >= 3) return '#c2772a' // warn
  return '#a89c8c' // low
}

export function ROIWorksheet() {
  const [rows, setRows] = useState<WorksheetRow[]>(DEFAULT_ROWS)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load worksheet data:', e)
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
    } catch (e) {
      console.error('Failed to save worksheet data:', e)
    }
  }, [rows])

  const handleAddRow = () => {
    setRows([...rows, { task: '', freq: 1, min: 15, ease: '2' }])
  }

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  const handleUpdateRow = (index: number, field: keyof WorksheetRow, value: string | number) => {
    const updated = [...rows]
    if (field === 'task') {
      updated[index][field] = String(value)
    } else if (field === 'ease') {
      updated[index][field] = value as '1' | '2' | '3'
    } else {
      updated[index][field] = Number(value)
    }
    setRows(updated)
  }

  const handleSort = () => {
    const sorted = [...rows].sort((a, b) => calculateROI(b) - calculateROI(a))
    setRows(sorted)
  }

  const totalHours = rows.reduce((sum, row) => sum + calculateHoursPerWeek(row), 0)

  return (
    <div className={styles.worksheet}>
      <div className={styles.worksheetTable}>
        <table>
          <thead>
            <tr>
              <th style={{ minWidth: '200px' }}>Việc lặp</th>
              <th>
                Tần suất
                <br />
                <span style={{ opacity: 0.6 }}>lần/tuần</span>
              </th>
              <th>
                Phút
                <br />
                <span style={{ opacity: 0.6 }}>mỗi lần</span>
              </th>
              <th style={{ minWidth: '130px' }}>Dễ kiểm soát</th>
              <th>Giờ/tuần</th>
              <th>ROI</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const hours = calculateHoursPerWeek(row)
              const roi = calculateROI(row)
              const roiColor = getROIColor(roi)

              return (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.task}
                      onChange={(e) => handleUpdateRow(index, 'task', e.target.value)}
                      placeholder="Tên việc…"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.freq}
                      onChange={(e) => handleUpdateRow(index, 'freq', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.min}
                      onChange={(e) => handleUpdateRow(index, 'min', e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      value={row.ease}
                      onChange={(e) => handleUpdateRow(index, 'ease', e.target.value)}
                    >
                      {Object.entries(EASE_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.worksheetRoi} style={{ color: 'var(--hb-muted)' }}>
                    {hours.toFixed(1)}
                  </td>
                  <td className={styles.worksheetRoi}>
                    <span className={styles.worksheetPill} style={{ background: roiColor }}>
                      {roi}
                    </span>
                  </td>
                  <td className={styles.worksheetDel}>
                    <button onClick={() => handleDeleteRow(index)} title="Xóa">
                      ✕
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.worksheetFooter}>
        <button className={`${styles.btn} ${styles.btnSmall}`} onClick={handleAddRow}>
          + Thêm việc
        </button>
        <button className={`${styles.btn} ${styles.btnSmall}`} onClick={handleSort}>
          ↓ Xếp theo ROI
        </button>
        <span className={styles.worksheetSum}>
          Tổng tiết kiệm tiềm năng: <strong>{totalHours.toFixed(1)} giờ/tuần</strong>
        </span>
      </div>
    </div>
  )
}

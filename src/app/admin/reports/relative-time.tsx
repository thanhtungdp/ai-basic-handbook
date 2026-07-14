'use client'

import { useEffect, useState } from 'react'

interface RelativeTimeProps {
  isoDate: string | null
}

function formatRelativeTime(input: string): string {
  const now = Date.now()
  const then = new Date(input).getTime()

  if (Number.isNaN(then)) return '—'

  const diffMs = now - then
  const diffSec = Math.max(0, Math.floor(diffMs / 1000))

  if (diffSec < 10) return 'vừa xong'
  if (diffSec < 60) return `${diffSec} giây trước`

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} phút trước`

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} giờ trước`

  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 30) return `${diffDay} ngày trước`

  return new Date(input).toLocaleString('vi-VN')
}

export function RelativeTime({ isoDate }: RelativeTimeProps) {
  const [label, setLabel] = useState('—')

  useEffect(() => {
    if (!isoDate) {
      setLabel('—')
      return
    }

    const update = () => setLabel(formatRelativeTime(isoDate))
    update()

    const timer = window.setInterval(update, 30_000)
    return () => window.clearInterval(timer)
  }, [isoDate])

  if (!isoDate) return <span>—</span>

  return <span title={new Date(isoDate).toLocaleString('vi-VN')}>{label}</span>
}

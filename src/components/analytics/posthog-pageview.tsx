'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import posthog from 'posthog-js'

let initialized = false

export function markPostHogInitialized() {
  initialized = true
}

export default function PostHogPageView() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !initialized) return
    posthog.capture('$pageview', { path: pathname })
  }, [pathname, mounted])

  return null
}
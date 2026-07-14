'use client'

import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PostHogNextProvider } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { markPostHogInitialized } from '@/components/analytics/posthog-pageview'

// PostHog provider without Clerk dependency
export function PostHogAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (typeof window !== 'undefined') {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
      if (key) {
        posthog.init(key, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
          loaded: () => {},
        })
        markPostHogInitialized()
      }
    }
  }, [mounted])

  return <PostHogNextProvider client={posthog}>{children}</PostHogNextProvider>
}
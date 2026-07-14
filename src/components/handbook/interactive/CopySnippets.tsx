'use client'

import React, { useState } from 'react'
import styles from '../handbook.module.css'

export interface Snippet {
  title: string
  code: string
}

interface CopySnippetsProps {
  snippets: Snippet[]
}

function CopySnippetsInner({ snippets }: CopySnippetsProps) {
  const [copied, setCopied] = useState<number | null>(null)

  const copy = (i: number, text: string) => {
    try {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(i)
        setTimeout(() => setCopied((c) => (c === i ? null : c)), 1600)
      })
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {snippets.map((s, i) => (
        <div key={i} className={styles.snip}>
          <div className={styles.snipHead}>
            <span className={styles.snipDot} />
            {s.title}
            <button
              className={`${styles.snipCopy} ${copied === i ? styles.snipCopyDone : ''}`}
              onClick={() => copy(i, s.code)}
              type="button"
            >
              {copied === i ? 'Đã copy ✓' : 'Copy'}
            </button>
          </div>
          <pre className={styles.snipPre}>{s.code}</pre>
        </div>
      ))}
    </>
  )
}

export const CopySnippets = CopySnippetsInner
'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../handbook.module.css'

type LineKind = 'out' | 'ok' | 'warn' | ''

interface Cmd {
  n: string
  label: string
  cmd: string
  out: [LineKind, string][]
}

const CMDS: Cmd[] = [
  {
    n: '1',
    label: 'curl … install.sh',
    cmd: 'curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash',
    out: [
      ['out', '▸ Tải Hermes Agent…'],
      ['out', '▸ Giải nén & cài dependencies…'],
      ['ok', '✓ Hermes installed → /usr/local/bin/hermes'],
    ],
  },
  {
    n: '2',
    label: 'hermes setup',
    cmd: 'hermes setup',
    out: [
      ['out', '? Chọn provider:  ▸ LLMGate   OpenRouter'],
      ['out', '? API key:  ••••••••••••'],
      ['out', '? Model chính:  GPT 5.5'],
      ['out', '? Model backup: GLM 5.2'],
      ['ok', '✓ Cấu hình đã lưu → ~/.hermes/config.toml'],
    ],
  },
  {
    n: '3',
    label: 'hermes',
    cmd: 'hermes',
    out: [
      ['ok', '✓ Hermes đang chạy — model: GPT 5.5 (LLMGate)'],
      ['out', '  Gõ việc của bạn, hoặc /help để xem lệnh.'],
    ],
  },
  {
    n: '4',
    label: 'hermes chat -q "…"',
    cmd: 'hermes chat -q "Chào Hermes, hãy trả lời bằng tiếng Việt và giới thiệu ngắn bạn giúp CEO việc gì."',
    out: [
      ['out', 'Chào anh 👋 Em là Hermes — trợ lý vận hành AI.'],
      ['out', 'Em giúp anh biến việc lặp (báo giá, follow-up,'],
      ['out', 'báo cáo, content) thành agent tự chạy và báo lại'],
      ['ok', 'để anh duyệt. Anh muốn bắt đầu với việc nào?'],
    ],
  },
]

interface TermLine {
  id: number
  kind: LineKind | 'cmd'
  text?: string
  prompt?: boolean
}

export function TerminalPlayground() {
  const nextLineId = useRef(0)
  const runToken = useRef(0)
  const [lines, setLines] = useState<TermLine[]>(() => [
    { id: nextLineId.current++, kind: 'out', text: '# Bấm một lệnh ở trên để chạy thử. Gợi ý: theo thứ tự 1 → 4.' },
  ])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'READY' | 'RUNNING'>('READY')
  const [doneCmds, setDoneCmds] = useState<Set<number>>(new Set())
  const [typingCmdId, setTypingCmdId] = useState<number | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  const addLine = useCallback(
    (line: Omit<TermLine, 'id'>) => {
      const id = nextLineId.current++
      setLines((prev) => [...prev, { ...line, id }])
    },
    [],
  )

  const runCmd = (i: number) => {
    if (busy) return
    const myToken = ++runToken.current
    setBusy(true)
    setStatus('RUNNING')

    const cmdId = nextLineId.current++
    setTypingCmdId(cmdId)
    setLines((prev) => [
      ...prev,
      { id: cmdId, kind: 'cmd', prompt: true, text: '' },
    ])

    const full = CMDS[i].cmd
    let ci = 0
    const speed = 16

    const type = () => {
      if (runToken.current !== myToken) return
      ci++
      const slice = full.slice(0, ci)
      setLines((prev) =>
        prev.map((l) => (l.id === cmdId ? { ...l, text: slice } : l)),
      )
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
      if (ci <= full.length) {
        setTimeout(type, speed)
      } else {
        setTypingCmdId(null)
        emitOut(i)
      }
    }
    type()
  }

  const emitOut = (i: number) => {
    const outs = CMDS[i].out
    let oi = 0
    const myToken = runToken.current
    const step = () => {
      if (runToken.current !== myToken) return
      if (oi < outs.length) {
        addLine({ kind: outs[oi][0], text: outs[oi][1] })
        oi++
        setTimeout(step, 260)
      } else {
        addLine({ kind: '', text: '' })
        setBusy(false)
        setStatus('READY')
        setDoneCmds((prev) => new Set(prev).add(i))
      }
    }
    step()
  }

  return (
    <>
      <div className={styles.termCmds}>
        {CMDS.map((c, i) => (
          <div
            key={i}
            className={`${styles.termCmd} ${doneCmds.has(i) ? styles.termCmdDone : ''}`}
            onClick={() => runCmd(i)}
            role="button"
            tabIndex={0}
          >
            <span className={styles.termCmdN}>{c.n}</span>
            {c.label}
          </div>
        ))}
      </div>
      <div className={styles.term}>
        <div className={styles.termBar}>
          <span className={styles.termLights}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.termTitle}>ceo@hermes — bash</span>
          <span
            className={`${styles.termStat} ${status === 'RUNNING' ? styles.termStatOn : ''}`}
          >
            ● {status}
          </span>
        </div>
        <div className={styles.termBody} ref={bodyRef}>
          {lines.map((l) =>
            l.kind === 'cmd' ? (
              <div key={l.id} className={styles.termLine}>
                <span className={styles.termPrompt}>ceo@hermes:~$ </span>
                <span className={styles.termCmdText}>{l.text}</span>
                {typingCmdId === l.id && <span className={styles.termCursor} />}
              </div>
            ) : (
              <div
                key={l.id}
                className={`${styles.termLine} ${l.kind ? styles[`termLine${l.kind.charAt(0).toUpperCase() + l.kind.slice(1)}`] || '' : ''}`}
              >
                {l.text}
              </div>
            ),
          )}
        </div>
      </div>
    </>
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { profiles, lessonProgress, studySessions, lessonsMeta } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { render } from '@react-email/render'
import AdminWeeklyReportEmail from '@/emails/admin-weekly-report'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  })
  return transporter
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

function formatDateTime(date: Date | null): string {
  if (!date) return '—'
  return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
}

function getCurrentWeek() {
  const fs = require('fs')
  const path = require('path')
  const schedulePath = path.join(process.cwd(), 'content/course-schedule.json')
  const schedule = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'))
  const now = new Date()

  let currentWeek = null
  for (const w of schedule.weeks) {
    const unlock = new Date(w.unlockDate)
    if (now >= unlock) currentWeek = w
  }
  if (!currentWeek) return null
  return currentWeek as { week: number; label: string }
}

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  const authHeader = req.headers.get('x-cron-secret')
  if (authHeader !== cronSecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const currentWeek = getCurrentWeek()
    if (!currentWeek) return NextResponse.json({ error: 'No active week found' }, { status: 400 })

    const adminEmail = 'thanhtung@simplamo.com'
    const emailFrom = process.env.EMAIL_FROM || 'hi@davidtung.net'
    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://handbook-dev.davidtung.net'}/admin/reports`

    const allStudents = await db.select().from(profiles).where(eq(profiles.role, 'student')).orderBy(desc(profiles.createdAt))
    const allLessons = await db.select().from(lessonsMeta)

    const studentSummaries = await Promise.all(allStudents.map(async (student) => {
      const studentProgress = await db.select().from(lessonProgress).where(eq(lessonProgress.userId, student.id))
      const lessonsDone = studentProgress.filter(p => p.status === 'done').length
      const totalTime = studentProgress.reduce((sum, p) => sum + p.totalTimeSeconds, 0)
      const totalVideoTime = studentProgress.reduce((sum, p) => sum + p.videoWatchTimeSeconds, 0)
      const lastVisited = studentProgress.map(p => p.lastVisitedAt).filter(Boolean).sort((a, b) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0))[0]
      const lastSession = await db.select({ startedAt: studySessions.startedAt }).from(studySessions).where(eq(studySessions.userId, student.id)).orderBy(desc(studySessions.startedAt)).limit(1)
      const lastActive = lastSession[0]?.startedAt ?? lastVisited ?? null
      return {
        id: student.id,
        email: student.email,
        fullName: student.fullName ?? student.email,
        lessonsDone,
        totalLessons: allLessons.length,
        progressPercent: allLessons.length > 0 ? Math.round((lessonsDone / allLessons.length) * 100) : 0,
        totalTimeSeconds: totalTime,
        videoWatchTimeSeconds: totalVideoTime,
        lastActiveAt: lastActive,
      }
    }))

    studentSummaries.sort((a, b) => {
      const progressDelta = b.progressPercent - a.progressPercent
      if (progressDelta !== 0) return progressDelta
      return b.totalTimeSeconds - a.totalTimeSeconds
    })

    const totalStudents = studentSummaries.length
    const activeStudents = studentSummaries.filter(s => s.lastActiveAt !== null).length
    const totalCompletedLessons = studentSummaries.reduce((sum, s) => sum + s.lessonsDone, 0)
    const totalStudyTimeSeconds = studentSummaries.reduce((sum, s) => sum + s.totalTimeSeconds, 0)
    const totalVideoTimeSeconds = studentSummaries.reduce((sum, s) => sum + s.videoWatchTimeSeconds, 0)

    const emailHtml = await render(
      AdminWeeklyReportEmail({
        weekNumber: currentWeek.week,
        weekLabel: currentWeek.label,
        totalStudents,
        activeStudents,
        totalLessons: allLessons.length,
        totalCompletedLessons,
        totalStudyTime: formatDuration(totalStudyTimeSeconds),
        totalVideoTime: formatDuration(totalVideoTimeSeconds),
        topStudents: studentSummaries.slice(0, 10).map((student) => ({
          fullName: student.fullName ?? student.email ?? 'Học viên',
          email: student.email ?? '—',
          progressPercent: student.progressPercent,
          lessonsDone: student.lessonsDone,
          totalTime: formatDuration(student.totalTimeSeconds),
          lastActive: formatDateTime(student.lastActiveAt),
        })),
        reportUrl,
      })
    )

    const transport = getTransporter()
    await transport.sendMail({
      from: emailFrom,
      to: adminEmail,
      subject: `Admin report tuần ${currentWeek.week} — Hermes Handbook`,
      html: emailHtml,
    })

    return NextResponse.json({ ok: true, to: adminEmail, week: currentWeek.week, students: totalStudents })
  } catch (error) {
    console.error('Admin weekly report cron failed:', error)
    return NextResponse.json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'unknown' }, { status: 500 })
  }
}

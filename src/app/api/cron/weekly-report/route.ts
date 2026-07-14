import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { profiles, lessonProgress, studySessions, lessonsMeta, weeklyReports } from '@/db/schema'
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm'
import { render } from '@react-email/render'
import { WeeklyReportEmail } from '@/emails/weekly-report'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

// SMTP transporter — lazy init
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

// Determine current week from course-schedule.json
function getCurrentWeek(): { weekNumber: number; weekLabel: string; weekStart: Date; weekEnd: Date } | null {
  // Read schedule data via fs (server-side only)
  const fs = require('fs')
  const path = require('path')
  const schedulePath = path.join(process.cwd(), 'content/course-schedule.json')
  const schedule = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'))
  const now = new Date()

  let currentWeek = null
  for (const w of schedule.weeks) {
    const unlock = new Date(w.unlockDate)
    if (now >= unlock) {
      currentWeek = w
    }
  }

  if (!currentWeek) return null

  // Week start = unlock date, week end = next week unlock or +7 days
  const weekStart = new Date(currentWeek.unlockDate)
  const nextWeek = schedule.weeks.find((w: any) => w.week === currentWeek.week + 1)
  const weekEnd = nextWeek ? new Date(nextWeek.unlockDate) : new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

  return {
    weekNumber: currentWeek.week,
    weekLabel: currentWeek.label,
    weekStart,
    weekEnd,
  }
}

export async function POST(req: NextRequest) {
  // Validate cron secret
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  const authHeader = req.headers.get('x-cron-secret')
  if (authHeader !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const currentWeek = getCurrentWeek()
    if (!currentWeek) {
      return NextResponse.json({ error: 'No active week found' }, { status: 400 })
    }

    const { weekNumber, weekLabel, weekStart, weekEnd } = currentWeek

    // Get all students
    const allStudents = await db
      .select()
      .from(profiles)
      .where(eq(profiles.role, 'student'))

    // Get all lessons meta
    const allLessons = await db.select().from(lessonsMeta)

    // Get report recipients — student email + admin email
    const adminEmails = (process.env.EMAIL_REPORT_TO || process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean)
    const emailFrom = process.env.EMAIL_FROM || 'hi@davidtung.net'
    const handbookBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hermes-handbook.davidtung.net'

    const results: Array<{ email: string; status: string }> = []

    for (const student of allStudents) {
      try {
        // Get student's progress
        const studentProgress = await db
          .select()
          .from(lessonProgress)
          .where(eq(lessonProgress.userId, student.id))

        // Get student's sessions in this week
        const weekSessions = await db
          .select()
          .from(studySessions)
          .where(and(
            eq(studySessions.userId, student.id),
            gte(studySessions.startedAt, weekStart),
            lte(studySessions.startedAt, weekEnd)
          ))

        // Calculate stats for the week
        const lessonsCompleted = studentProgress.filter(p => {
          if (p.status !== 'done') return false
          if (!p.completedAt) return false
          return p.completedAt >= weekStart && p.completedAt <= weekEnd
        }).length

        const lessonsInProgress = studentProgress.filter(p => p.status === 'in_progress').length

        const totalTimeSeconds = weekSessions.reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0)
        const videoWatchTimeSeconds = studentProgress
          .filter(p => p.lastVisitedAt && p.lastVisitedAt >= weekStart && p.lastVisitedAt <= weekEnd)
          .reduce((sum, p) => sum + (p.videoWatchTimeSeconds ?? 0), 0)

        const totalDone = studentProgress.filter(p => p.status === 'done').length
        const courseProgressPercent = allLessons.length > 0
          ? Math.round((totalDone / allLessons.length) * 100)
          : 0

        // Build lessons list for email
        const lessonsWithEmail = allLessons.map(lesson => {
          const progress = studentProgress.find(p => p.slug === lesson.slug)
          return {
            title: lesson.title,
            status: (progress?.status ?? 'not_started') as 'not_started' | 'in_progress' | 'done',
            totalTimeSeconds: progress?.totalTimeSeconds ?? 0,
            videoWatchTimeSeconds: progress?.videoWatchTimeSeconds ?? 0,
          }
        })

        // Render email HTML
        const emailHtml = await render(
          WeeklyReportEmail({
            userName: student.fullName ?? student.email ?? 'Học viên',
            weekNumber,
            weekLabel,
            lessonsCompleted,
            lessonsInProgress,
            totalLessons: allLessons.length,
            totalTimeSeconds,
            videoWatchTimeSeconds,
            courseProgressPercent,
            lessons: lessonsWithEmail.map(l => ({
            ...l,
            title: l.title ?? 'Untitled',
          })),
            handbookUrl: `${handbookBaseUrl}/docs`,
          })
        )

        // Save/update weekly report in DB
        await db
          .insert(weeklyReports)
          .values({
            userId: student.id,
            weekNumber,
            weekStart,
            weekEnd,
            lessonsCompleted,
            lessonsInProgress,
            totalTimeSeconds,
            videoWatchTimeSeconds,
            reportText: emailHtml,
            emailedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [weeklyReports.userId, weeklyReports.weekNumber],
            set: {
              lessonsCompleted,
              lessonsInProgress,
              totalTimeSeconds,
              videoWatchTimeSeconds,
              reportText: emailHtml,
              emailedAt: new Date(),
            },
          })

        // Send email
        const transport = getTransporter()
        await transport.sendMail({
          from: emailFrom,
          to: student.email!,
          cc: adminEmails,
          subject: `Báo cáo học tập tuần ${weekNumber} — Hermes Handbook`,
          html: emailHtml,
        })

        results.push({ email: student.email ?? 'unknown', status: 'sent' })
      } catch (err) {
        console.error(`Failed to send report to ${student.email}:`, err)
        results.push({ email: student.email ?? 'unknown', status: `error: ${err instanceof Error ? err.message : 'unknown'}` })
      }
    }

    return NextResponse.json({
      ok: true,
      week: weekNumber,
      weekLabel,
      total: allStudents.length,
      sent: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status !== 'sent').length,
      details: results,
    })
  } catch (error) {
    console.error('Weekly report cron failed:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'unknown' },
      { status: 500 }
    )
  }
}
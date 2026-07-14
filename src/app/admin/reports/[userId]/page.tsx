import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db'
import { lessonProgress, lessonsMeta, profiles, studySessions } from '@/db/schema'
import { and, desc, eq, gte, sql } from 'drizzle-orm'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Flame, PlayCircle, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin — Chi tiết học viên',
  description: 'Theo dõi tiến độ học tập chi tiết của một học viên',
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m ${seconds % 60}s`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Chưa học', color: '#a1a1aa', bg: '#f4f4f5' },
  in_progress: { label: 'Đang học', color: '#f59e0b', bg: '#fef3c7' },
  done: { label: 'Đã xong', color: '#10b981', bg: '#d1fae5' },
}

async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/admin/reports')
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(s => s.trim().toLowerCase())
  const userEmail = (user.primaryEmailAddress?.emailAddress ?? '').toLowerCase()
  if (!adminEmails.includes(userEmail)) return null
  return user
}

export default async function AdminStudentDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const adminUser = await requireAdmin()
  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Không có quyền</h1>
          <p className="text-zinc-500 mb-6">Bạn không có quyền truy cập trang admin.</p>
          <Link href="/docs" className="inline-block px-6 py-3 rounded-xl bg-primary text-white font-medium">
            Về trang học
          </Link>
        </div>
      </div>
    )
  }

  const { userId } = await params

  const student = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1)

  const profile = student[0]
  if (!profile) notFound()

  const allProgress = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, profile.id))

  const allLessons = await db.select().from(lessonsMeta)

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentSessions = await db
    .select({ startedAt: studySessions.startedAt, durationSeconds: studySessions.durationSeconds })
    .from(studySessions)
    .where(and(eq(studySessions.userId, profile.id), gte(studySessions.startedAt, thirtyDaysAgo), sql`${studySessions.durationSeconds} > 0`))
    .orderBy(desc(studySessions.startedAt))

  const activeDates = new Set(recentSessions.map(s => new Date(s.startedAt).toISOString().split('T')[0]))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = checkDate.toISOString().split('T')[0]
    if (activeDates.has(dateStr)) streak++
    else if (i > 0) break
  }

  const totalDone = allProgress.filter(p => p.status === 'done').length
  const totalInProgress = allProgress.filter(p => p.status === 'in_progress').length
  const totalTimeSeconds = allProgress.reduce((sum, p) => sum + p.totalTimeSeconds, 0)
  const totalVideoTime = allProgress.reduce((sum, p) => sum + p.videoWatchTimeSeconds, 0)
  const progressPercent = allLessons.length > 0 ? Math.round((totalDone / allLessons.length) * 100) : 0

  const lessonsByWeek = new Map<number, typeof allLessons>()
  for (const lesson of allLessons) {
    const week = lesson.week ?? 0
    if (!lessonsByWeek.has(week)) lessonsByWeek.set(week, [])
    lessonsByWeek.get(week)!.push(lesson)
  }
  const sortedWeeks = [...lessonsByWeek.entries()].sort((a, b) => a[0] - b[0])

  const last7Days: { date: string; label: string; time: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const dayTime = recentSessions
      .filter(s => new Date(s.startedAt).toISOString().split('T')[0] === dateStr)
      .reduce((sum, s) => sum + s.durationSeconds, 0)
    last7Days.push({ date: dateStr, label: date.toLocaleDateString('vi-VN', { weekday: 'short' }), time: dayTime })
  }
  const maxDayTime = Math.max(...last7Days.map(d => d.time), 1)

  const progressMap = new Map(allProgress.map(p => [p.slug, p]))

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/admin/reports" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-4">
            <ArrowLeft className="size-4" />
            Về danh sách học viên
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900">Chi tiết học viên</h1>
          <p className="text-sm text-zinc-500 mt-1">{profile.fullName ?? profile.email} · {profile.email}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="size-4 text-green-500" /><span className="text-xs text-zinc-500 font-medium">BÀI ĐÃ XONG</span></div>
            <div className="text-3xl font-bold text-zinc-900">{totalDone}</div>
            <div className="text-xs text-zinc-400 mt-1">/ {allLessons.length} bài</div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="size-4 text-indigo-500" /><span className="text-xs text-zinc-500 font-medium">TIẾN ĐỘ</span></div>
            <div className="text-3xl font-bold text-zinc-900">{progressPercent}%</div>
            <div className="mt-2 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-center gap-2 mb-2"><Clock className="size-4 text-zinc-600" /><span className="text-xs text-zinc-500 font-medium">THỜI GIAN HỌC</span></div>
            <div className="text-3xl font-bold text-zinc-900">{formatDuration(totalTimeSeconds)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-center gap-2 mb-2"><Flame className="size-4 text-orange-500" /><span className="text-xs text-zinc-500 font-medium">STREAK</span></div>
            <div className="text-3xl font-bold text-zinc-900">{streak}</div>
            <div className="text-xs text-zinc-400 mt-1">ngày liên tục</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4"><PlayCircle className="size-5 text-red-500" /><h2 className="text-lg font-semibold text-zinc-900">Thời gian xem video</h2></div>
          <div className="text-2xl font-bold text-zinc-900">{formatDuration(totalVideoTime)}</div>
          <div className="text-sm text-zinc-400 mt-2">Đang học: {totalInProgress} bài</div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Hoạt động 7 ngày qua</h2>
          <div className="flex items-end gap-2 h-40">
            {last7Days.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs text-zinc-400 font-medium">{day.time > 0 ? formatDuration(day.time) : ''}</div>
                <div className="w-full bg-indigo-500 rounded-t-lg transition-all min-h-[4px]" style={{ height: `${(day.time / maxDayTime) * 100}%` }} />
                <div className="text-xs text-zinc-500">{day.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-200"><h2 className="text-lg font-semibold text-zinc-900">Tiến độ bài học</h2></div>
          <div className="divide-y divide-zinc-100">
            {sortedWeeks.map(([week, lessons]) => (
              <div key={week} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-zinc-700">{lessons[0]?.weekLabel ?? `Tuần ${week}`}</h3>
                  <span className="text-xs text-zinc-400">{lessons.filter(l => progressMap.get(l.slug)?.status === 'done').length}/{lessons.length} xong</span>
                </div>
                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const progress = progressMap.get(lesson.slug)
                    const status = progress?.status ?? 'not_started'
                    const config = statusConfig[status]
                    return (
                      <div key={lesson.slug} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: config.color, backgroundColor: config.bg }}>{config.label}</span>
                          <span className="text-sm text-zinc-700 truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-400 whitespace-nowrap">
                          {progress && progress.totalTimeSeconds > 0 && <span className="flex items-center gap-1"><Clock className="size-3" />{formatDuration(progress.totalTimeSeconds)}</span>}
                          {progress && progress.videoWatchTimeSeconds > 0 && <span className="flex items-center gap-1"><PlayCircle className="size-3 text-red-400" />{formatDuration(progress.videoWatchTimeSeconds)}</span>}
                          <Link href={`/docs/${lesson.slug}`} className="text-indigo-500 hover:text-indigo-700 font-medium">Học →</Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db'
import { profiles, lessonProgress, studySessions, lessonsMeta } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminExportCsvButton } from './admin-export-csv-button'
import { RelativeTime } from './relative-time'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin — Báo cáo học tập',
  description: 'Tổng quan tiến độ học viên',
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

function formatDate(date: Date | null): string {
  if (!date) return '—'
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/admin/reports')
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(s => s.trim().toLowerCase())
  const userEmail = (user.primaryEmailAddress?.emailAddress ?? '').toLowerCase()
  if (!adminEmails.includes(userEmail)) {
    return null
  }
  return user
}

export default async function AdminReportsPage() {
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

  const allStudents = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, 'student'))
    .orderBy(desc(profiles.createdAt))

  const allLessons = await db.select().from(lessonsMeta)

  const studentSummaries = await Promise.all(
    allStudents.map(async (student) => {
      const studentProgress = await db
        .select()
        .from(lessonProgress)
        .where(eq(lessonProgress.userId, student.id))

      const lessonsDone = studentProgress.filter(p => p.status === 'done').length
      const totalTime = studentProgress.reduce((sum, p) => sum + p.totalTimeSeconds, 0)
      const totalVideoTime = studentProgress.reduce((sum, p) => sum + p.videoWatchTimeSeconds, 0)
      const lastVisited = studentProgress
        .map(p => p.lastVisitedAt)
        .filter(Boolean)
        .sort((a, b) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0))[0]

      const lastSession = await db
        .select({ startedAt: studySessions.startedAt })
        .from(studySessions)
        .where(eq(studySessions.userId, student.id))
        .orderBy(desc(studySessions.startedAt))
        .limit(1)

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
    })
  )

  studentSummaries.sort((a, b) => {
    const aTime = a.lastActiveAt?.getTime() ?? 0
    const bTime = b.lastActiveAt?.getTime() ?? 0
    return bTime - aTime
  })

  const totalStudents = studentSummaries.length
  const activeStudents = studentSummaries.filter(s => s.lastActiveAt !== null).length
  const totalCompletedLessons = studentSummaries.reduce((sum, s) => sum + s.lessonsDone, 0)
  const totalStudyTime = studentSummaries.reduce((sum, s) => sum + s.totalTimeSeconds, 0)

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="size-4" />
            Về trang học
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900">Admin — Báo cáo học tập</h1>
          <p className="text-sm text-zinc-500 mt-1">Tổng quan tiến độ tất cả học viên</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="text-xs text-zinc-500 font-medium mb-2">TỔNG HỌC VIÊN</div>
            <div className="text-3xl font-bold text-zinc-900">{totalStudents}</div>
            <div className="text-xs text-zinc-400 mt-1">{activeStudents} đang hoạt động</div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="text-xs text-zinc-500 font-medium mb-2">TỔNG BÀI ĐÃ XONG</div>
            <div className="text-3xl font-bold text-green-600">{totalCompletedLessons}</div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="text-xs text-zinc-500 font-medium mb-2">TỔNG THỜI GIAN HỌC</div>
            <div className="text-3xl font-bold text-zinc-900">{formatDuration(totalStudyTime)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <div className="text-xs text-zinc-500 font-medium mb-2">TỔNG BÀI TRONG KHÓA</div>
            <div className="text-3xl font-bold text-zinc-900">{allLessons.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Danh sách học viên</h2>
            <AdminExportCsvButton
              rows={studentSummaries.map((s) => ({
                email: s.email,
                fullName: s.fullName,
                lessonsDone: s.lessonsDone,
                totalLessons: s.totalLessons,
                progressPercent: s.progressPercent,
                totalTimeSeconds: s.totalTimeSeconds,
                videoWatchTimeSeconds: s.videoWatchTimeSeconds,
                lastActiveAt: s.lastActiveAt ? formatDate(s.lastActiveAt) : '—',
              }))}
            />
          </div>

          {studentSummaries.length === 0 ? (
            <div className="p-12 text-center text-zinc-400">
              Chưa có học viên nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="text-left text-xs font-medium text-zinc-500 uppercase px-6 py-3">Học viên</th>
                    <th className="text-center text-xs font-medium text-zinc-500 uppercase px-4 py-3">Tiến độ</th>
                    <th className="text-center text-xs font-medium text-zinc-500 uppercase px-4 py-3">Bài đã xong</th>
                    <th className="text-center text-xs font-medium text-zinc-500 uppercase px-4 py-3">Thời gian học</th>
                    <th className="text-center text-xs font-medium text-zinc-500 uppercase px-4 py-3">Video</th>
                    <th className="text-center text-xs font-medium text-zinc-500 uppercase px-4 py-3">Hoạt động cuối</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {studentSummaries.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4">
                        <Link href={`/admin/reports/${s.id}`} className="block group">
                          <div className="text-sm font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors">
                            {s.fullName}
                          </div>
                          <div className="text-xs text-zinc-400">{s.email}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${s.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-zinc-600">{s.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-zinc-700">
                        {s.lessonsDone}/{s.totalLessons}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-zinc-600">
                        {formatDuration(s.totalTimeSeconds)}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-zinc-600">
                        {s.videoWatchTimeSeconds > 0 ? formatDuration(s.videoWatchTimeSeconds) : '—'}
                      </td>
                      <td className="px-4 py-4 text-center text-xs text-zinc-400">
                        <RelativeTime isoDate={s.lastActiveAt ? s.lastActiveAt.toISOString() : null} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

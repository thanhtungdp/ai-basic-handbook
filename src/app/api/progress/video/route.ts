import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { lessonProgress } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { videoProgressSchema } from '@/lib/schemas'
import { requireAuth } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  const { error: authError, userId, profile } = await requireAuth()
  if (authError) return authError
  if (!userId || !profile) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = videoProgressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 })
    }

    const { slug, videoWatchTimeDelta, videoPositionSeconds, videoWatched } = parsed.data

    const profileId = profile.id

    // Upsert lesson_progress with video tracking
    await db
      .insert(lessonProgress)
      .values({
        userId: profileId,
        slug,
        status: 'in_progress',
        videoWatched: videoWatched ?? true,
        videoWatchTimeSeconds: videoWatchTimeDelta,
        videoPositionSeconds,
        lastVisitedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.slug],
        set: {
          videoWatched: sql`COALESCE(${videoWatched !== undefined ? videoWatched : true}, ${lessonProgress.videoWatched})`,
          videoWatchTimeSeconds: sql`${lessonProgress.videoWatchTimeSeconds} + ${videoWatchTimeDelta}`,
          videoPositionSeconds: videoPositionSeconds,
          lastVisitedAt: new Date(),
          updatedAt: new Date(),
        },
      })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Video progress PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
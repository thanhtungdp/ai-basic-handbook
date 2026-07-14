import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { lessonProgress, studySessions } from '@/db/schema';
import { requireAuth } from '@/lib/admin';
import { heartbeatSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { error: authError, userId, profile } = await requireAuth();
    if (authError) return authError;
    if (!userId || !profile) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = heartbeatSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    const { slug, sessionId } = parsed.data;

    const profileId = profile.id;

    const now = new Date();

    // 1. Handle study session: find existing or insert new
    const existingSessions = await db
      .select()
      .from(studySessions)
      .where(and(eq(studySessions.userId, profileId), eq(studySessions.sessionId, sessionId)));

    const existingSession = existingSessions[0];
    if (existingSession) {
      const durationSeconds = Math.max(
        0,
        Math.floor((now.getTime() - existingSession.startedAt.getTime()) / 1000),
      );
      await db
        .update(studySessions)
        .set({
          endedAt: now,
          durationSeconds,
        })
        .where(eq(studySessions.id, existingSession.id));
    } else {
      await db.insert(studySessions).values({
        userId: profileId,
        slug,
        sessionId,
        startedAt: now,
        endedAt: now,
        durationSeconds: 0,
      });
    }

    // 2. Upsert lesson_progress
    const existingProgress = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, profileId), eq(lessonProgress.slug, slug)));

    if (existingProgress.length > 0) {
      const row = existingProgress[0];
      await db
        .update(lessonProgress)
        .set({
          lastVisitedAt: now,
          status: row.status === 'not_started' ? 'in_progress' : row.status,
          totalTimeSeconds: (row.totalTimeSeconds ?? 0) + 30,
        })
        .where(eq(lessonProgress.id, row.id));
    } else {
      await db.insert(lessonProgress).values({
        userId: profileId,
        slug,
        status: 'in_progress',
        lastVisitedAt: now,
        totalTimeSeconds: 30,
        videoWatchTimeSeconds: 0,
        videoPositionSeconds: 0,
        videoWatched: false,
      });
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
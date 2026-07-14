import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { lessonProgress } from '@/db/schema';
import { requireAuth } from '@/lib/admin';
import { doneSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { error: authError, userId, profile } = await requireAuth();
    if (authError) return authError;
    if (!userId || !profile) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = doneSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    const { slug } = parsed.data;

    const profileId = profile.id;
    const now = new Date();

    const existingProgress = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, profileId), eq(lessonProgress.slug, slug)));

    if (existingProgress.length > 0) {
      await db
        .update(lessonProgress)
        .set({
          status: 'done',
          completedAt: now,
        })
        .where(eq(lessonProgress.id, existingProgress[0].id));
    } else {
      await db.insert(lessonProgress).values({
        userId: profileId,
        slug,
        status: 'done',
        completedAt: now,
        lastVisitedAt: now,
        totalTimeSeconds: 0,
        videoWatchTimeSeconds: 0,
        videoPositionSeconds: 0,
        videoWatched: false,
      });
    }

    return Response.json({ ok: true, status: 'done' }, { status: 200 });
  } catch (error) {
    console.error('Done error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
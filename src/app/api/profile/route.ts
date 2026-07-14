import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { lessonProgress, lessonsMeta, studySessions } from '@/db/schema';
import { requireAuth } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request) {
  try {
    const { error: authError, userId, profile } = await requireAuth();
    if (authError) return authError;
    if (!userId || !profile) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const profileId = profile.id;

    const [allProgress, allSessions, allLessons] = await Promise.all([
      db.select().from(lessonProgress).where(eq(lessonProgress.userId, profileId)),
      db.select().from(studySessions).where(eq(studySessions.userId, profileId)),
      db.select().from(lessonsMeta),
    ]);

    const totalLessons = allLessons.length;
    const totalDone = allProgress.filter((p) => p.status === 'done').length;
    const totalInProgress = allProgress.filter((p) => p.status === 'in_progress').length;
    const totalNotStarted = Math.max(0, totalLessons - totalDone - totalInProgress);

    const totalTimeSeconds = allProgress.reduce((sum, p) => sum + (p.totalTimeSeconds ?? 0), 0);
    const totalVideoTime = allProgress.reduce((sum, p) => sum + (p.videoWatchTimeSeconds ?? 0), 0);

    // Streak: count distinct dates from study_sessions where durationSeconds > 0, check consecutive days
    const activeDates = new Set<string>(
      allSessions
        .filter((s) => (s.durationSeconds ?? 0) > 0)
        .map((s) => {
          const d = new Date(s.startedAt);
          return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        }),
    );
    const streak = computeStreak(activeDates);

    return Response.json(
      {
        totalLessons,
        totalDone,
        totalInProgress,
        totalNotStarted,
        totalTimeSeconds,
        totalVideoTimeSeconds: totalVideoTime,
        streak,
        progress: allProgress,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Profile error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function computeStreak(dates: Set<string>): number {
  if (dates.size === 0) return 0;

  const toKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let streak = 0;
  const cursor = new Date();
  // Walk backwards day-by-day from today; stop at first gap (allow today to be absent)
  // If today not in set, start from yesterday so the streak isn't broken by an in-progress day.
  if (!dates.has(toKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(toKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
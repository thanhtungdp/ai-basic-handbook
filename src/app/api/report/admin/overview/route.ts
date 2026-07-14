import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '@/db';
import { lessonProgress, profiles, studySessions } from '@/db/schema';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// Simple in-memory cache with 5-minute TTL
type AdminOverviewCache = { data: unknown; expiresAt: number; week: string };
let cache: AdminOverviewCache | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET(req: Request) {
  try {
    const { error: adminError, user } = await requireAdmin();
    if (adminError) return adminError;
    if (!user) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const url = new URL(req.url);
    const weekParam = url.searchParams.get('week');
    const weekOffset = weekParam ? Number.parseInt(weekParam, 10) : 0;
    if (Number.isNaN(weekOffset)) {
      return Response.json({ error: 'Invalid week parameter' }, { status: 400 });
    }

    const cacheKey = String(weekOffset);
    if (cache && cache.expiresAt > Date.now() && cache.data) {
      // Cache is keyed on the single weekOffset param; only valid if it matches
      if (cache.week === cacheKey) {
        return Response.json(cache.data, { status: 200 });
      }
    }

    // Compute the week range (ISO week, Monday-based) for the given offset (0 = current week)
    const { start, end } = getWeekRange(weekOffset);

    const students = await db.select().from(profiles).where(eq(profiles.role, 'student'));

    const overview = await Promise.all(
      students.map(async (student) => {
        const [progressRows, sessionRows] = await Promise.all([
          db
            .select()
            .from(lessonProgress)
            .where(
              and(
                eq(lessonProgress.userId, student.id),
                gte(lessonProgress.completedAt, start),
                lte(lessonProgress.completedAt, end),
              ),
            ),
          db
            .select()
            .from(studySessions)
            .where(
              and(
                eq(studySessions.userId, student.id),
                gte(studySessions.startedAt, start),
                lte(studySessions.startedAt, end),
              ),
            ),
        ]);

        const lessonsCompleted = progressRows.filter((p) => p.status === 'done').length;
        const totalTimeSeconds = sessionRows.reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0);
        const videoWatchTimeSeconds = progressRows.reduce(
          (sum, p) => sum + (p.videoWatchTimeSeconds ?? 0),
          0,
        );
        const lastActiveAt = sessionRows
          .map((s) => s.endedAt ?? s.startedAt)
          .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

        return {
          userId: student.id,
          email: student.email,
          fullName: student.fullName,
          lessonsCompleted,
          totalTimeSeconds,
          videoWatchTimeSeconds,
          lastActiveAt,
        };
      }),
    );

    const payload = overview;

    cache = { data: payload, expiresAt: Date.now() + CACHE_TTL_MS, week: cacheKey };

    return Response.json(payload, { status: 200 });
  } catch (error) {
    console.error('Admin overview error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getWeekRange(weekOffset: number): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day; // days since Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
}
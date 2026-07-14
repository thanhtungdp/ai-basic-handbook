import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { lessonProgress } from '@/db/schema';
import { requireAuth } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { error: authError, userId, profile } = await requireAuth();
    if (authError) return authError;
    if (!userId || !profile) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug } = await params;

    const profileId = profile.id;

    const rows = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, profileId), eq(lessonProgress.slug, slug)));

    if (rows.length === 0) {
      return Response.json({ status: 'not_started' }, { status: 200 });
    }

    return Response.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Get progress error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
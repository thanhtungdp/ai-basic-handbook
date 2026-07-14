import { auth } from '@clerk/nextjs/server';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { annotateTreeWithStatus } from '@/lib/tree-lock';
import { db } from '@/db';
import { lessonProgress, profiles } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export default async function Layout({ children }: LayoutProps<'/docs'>) {
  const { userId } = await auth();

  let completedSlugs = new Set<string>();

  if (userId) {
    const profileRow = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.clerkUserId, userId))
      .limit(1);

    const profileId = profileRow[0]?.id;

    if (profileId) {
      const doneRows = await db
        .select({ slug: lessonProgress.slug })
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, profileId),
            eq(lessonProgress.status, 'done'),
          ),
        );

      completedSlugs = new Set(doneRows.map((row) => row.slug));
    }
  }

  const tree = annotateTreeWithStatus(source.getPageTree(), completedSlugs);
  return (
    <DocsLayout tree={tree} {...baseOptions()}>
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: 'secondary',
              className: 'text-fd-muted-foreground rounded-2xl',
            }),
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>

      {children}
    </DocsLayout>
  );
}

import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { ProgressBar } from '@/components/handbook/shared'
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonMeta } from "@/components/handbook/interactive";
import { getMDXComponents } from "@/components/mdx";
import { DoneButton, LessonTracker } from "@/components/tracking";
import { checkAdminUnlock, getLockStatus } from "@/lib/course-schedule";
import { gitConfig } from "@/lib/shared";
import { getPageImage, getPageMarkdownUrl, source } from "@/lib/source";

const DEFAULT_COURSE_LABEL = "KADA · TRAINING PROGRAM";

type LessonFrontmatter = NonNullable<
  NonNullable<ReturnType<typeof source.getPage>>["data"]["lesson"]
>;

function formatLessonNumber(number?: string) {
  if (!number) return undefined;

  return `BÀI ${String(number).padStart(2, "0")}`;
}

function buildLessonMeta(lesson: LessonFrontmatter) {
  return [
    { label: formatLessonNumber(lesson.number), value: "", strong: true },
    { label: "", value: lesson.course ?? DEFAULT_COURSE_LABEL },
    lesson.duration
      ? { label: "⏱", value: `${lesson.duration} PHÚT` }
      : undefined,
    typeof lesson.interactions === "number"
      ? { label: "", value: `${lesson.interactions} KHỐI TƯƠNG TÁC` }
      : undefined,
  ].filter((item): item is { label: string; value: string; strong?: boolean } =>
    Boolean(item?.label || item?.value),
  );
}

export const dynamic = "force-dynamic";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  // Build slug string for schedule lookup
  const slug = params.slug?.join("/") ?? "";

  // Check admin unlock via query params
  const searchParams = await props.searchParams;
  const adminUnlocked = checkAdminUnlock(
    searchParams as Record<string, string | string[] | undefined>,
    slug,
  );

  // Check lock status
  const lockStatus = getLockStatus(slug);

  // Determine if we should show locked view
  const isLocked = lockStatus.locked && !adminUnlocked;

  // KADA Program: all pages are public, no auth required

  const lesson = page.data.lesson;
  const showLessonMeta = Boolean(lesson && !lesson.hideMeta);

  // Extract teaser: first 2-3 sentences from structured data
  const fullText = page.data.description || "";
  const teaser = fullText.length > 20 ? fullText : undefined;

  // Find hero image from the page (first Image src)
  const pageImage = getPageImage(page);

  const copyAddons = <div className="flex flex-row gap-2 items-center">
    <MarkdownCopyButton markdownUrl={markdownUrl} />
    <ViewOptionsPopover
      markdownUrl={markdownUrl}
      githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
    />
  </div>

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {lesson && showLessonMeta && (
          <LessonMeta
            eyebrow={lesson.eyebrow ?? ""}
            title={page.data.title}
            goal={page.data.description}
            meta={buildLessonMeta(lesson)}
            addons={copyAddons}
          />
        )}
      {!showLessonMeta && <DocsTitle>{page.data.title}</DocsTitle>}
      {!showLessonMeta && <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>}
      {!showLessonMeta && copyAddons}
      <DocsBody>
        <ProgressBar />
        <LessonTracker slug={slug} isLocked={isLocked}>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </LessonTracker>
        {!isLocked && lesson && <DoneButton slug={slug} />}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

import { NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { getLockStatus, checkAdminUnlock } from '@/lib/course-schedule';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

const isProtectedRoute = createRouteMatcher(['/docs(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    const slug = request.nextUrl.pathname.replace(/^\/docs\/?/, '');
    const unlockParam = request.nextUrl.searchParams.get('unlock');
    const adminUnlocked = checkAdminUnlock(
      unlockParam ? { unlock: unlockParam } : undefined,
      slug,
    );
    const lockStatus = getLockStatus(slug);

    // Locked pages are public (show lock UI with countdown/blur)
    // Admin unlock bypass: skip auth entirely
    // Unlocked content: require auth
    if (adminUnlocked) {
      // Admin unlock (?unlock=all) — skip auth, show content directly
      return NextResponse.next();
    }

    // In dev mode, skip auth on tunnel domains (Clerk dev-browser cookies don't work)
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev && !lockStatus.locked) {
      const { userId } = await auth();
      if (!userId) {
        const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
        const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
        const origin = `${forwardedProto}://${forwardedHost}`;
        const currentUrl = `${origin}${request.nextUrl.pathname}${request.nextUrl.search}`;
        const signInUrl = new URL('/sign-in', origin);
        signInUrl.searchParams.set('redirect_url', currentUrl);
        return NextResponse.redirect(signInUrl);
      }
    }
  }

  // Fumadocs markdown negotiation
  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const markdownResult = rewriteDocs(request.nextUrl.pathname);
    if (markdownResult) {
      return NextResponse.rewrite(new URL(markdownResult, request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/docs(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
};
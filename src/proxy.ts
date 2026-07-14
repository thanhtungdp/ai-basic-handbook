import { NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Fumadocs markdown negotiation
  const result = rewriteSuffix(url.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, url));
  }

  if (isMarkdownPreferred(request)) {
    const markdownResult = rewriteDocs(url.pathname);
    if (markdownResult) {
      return NextResponse.rewrite(new URL(markdownResult, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/docs(.*)',
  ],
};
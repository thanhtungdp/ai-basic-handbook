# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A documentation site built with [Fumadocs](https://fumadocs.dev) on Next.js 16 (App Router, React 19). Content is authored in MDX; the site also exposes LLM-friendly endpoints and an AI chat/search assistant grounded in the docs.

The package manager is **Bun** (`bun.lock`). Use `bun` / `bunx` rather than npm/pnpm/yarn despite README examples.

## Commands

```bash
bun run dev            # start dev server at http://localhost:3000
bun run build          # production build
bun run start          # serve production build
bun run types:check    # fumadocs-mdx + next typegen + tsc --noEmit (full type check)
bun run lint           # biome check (lint)
bun run format         # biome format --write
```

There is no test runner configured. `bun run types:check` is the closest thing to a verification gate — run it after non-trivial changes.

## Architecture

### Content pipeline (`fumadocs-mdx`)
- MDX content lives in `content/docs/`. `meta.json` files (validated by `metaSchema`) control sidebar order/structure.
- `source.config.ts` defines collections via `defineDocs` and frontmatter/meta schemas. `includeProcessedMarkdown: true` is what makes the processed-markdown LLM endpoints work.
- `fumadocs-mdx` generates the `.source/` directory (gitignored, regenerated on `postinstall` and by `types:check`). It is imported via the `collections/*` path alias (e.g. `collections/server`). **Never edit `.source/` by hand.**
- `src/lib/source.ts` wraps the generated collection with `loader()` to produce `source`, the central interface for accessing pages/slugs/text. Helpers here (`getPageImage`, `getPageMarkdownUrl`, `getLLMText`) derive the various per-page URLs.

### Routes (`src/app/`)
- `(home)/` — landing page route group; `docs/[[...slug]]/` — docs pages; `docs/layout.tsx` + `src/lib/layout.shared.tsx` — layout config.
- `api/search/route.ts` — built-in Fumadocs search (`createFromSource`).
- `api/chat/route.ts` — AI assistant. Builds an in-memory FlexSearch index over all pages' processed markdown at module load, exposes it as a `search` tool, and streams responses via the Vercel AI SDK through LLM Gateway. UI counterpart is `src/components/ai/search.tsx` (shares the `ChatUIMessage`/`SearchTool` types).
- `llms.txt`, `llms-full.txt`, `llms.mdx/docs/[[...slug]]` — machine-readable endpoints serving page content as plain markdown for LLMs.
- `og/docs/[...slug]` — dynamic Open Graph image generation.

### Markdown content negotiation (`proxy.ts`)
`proxy.ts` rewrites requests for docs pages to their `.md` content endpoint — either when the path ends in `.md` or when the client signals markdown is preferred (`isMarkdownPreferred`). This is how the same doc URL can serve HTML to browsers and raw markdown to agents.

### Shared config (`src/lib/shared.ts`)
Central constants: `appName`, route prefixes (`docsRoute`, `docsContentRoute`, `docsImageRoute`), and `gitConfig`. **These still hold Fumadocs template placeholders** (`appName = 'My App'`, `gitConfig` points at `fuma-nama/fumadocs`) — update them for real branding/links.

## Conventions
- **Biome** handles lint + format (2-space indent, organize-imports on). Next.js and React lint domains are enabled.
- Import alias: `@/*` → `src/*`; `collections/*` → `.source/*`.
- The AI chat route requires `LLM_GATEWAY_API_KEY` (in `.env.local`, empty by default) and optionally `LLM_GATEWAY_MODEL` (defaults to `anthropic/claude-3.5-sonnet`).

# Hermes Handbook — Xây đội AI tự chủ cho Solo CEO

Handbook thực chiến giúp Solo CEO xây đội AI tự chủ: ra lệnh qua Telegram, biến việc lặp thành agent tự chạy, và trong 4 tuần có 1–2 agent làm việc thật mỗi ngày.

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **Fumadocs** — MDX content pipeline + docs UI
- **Clerk** — authentication
- **PostHog** — product analytics
- **Supabase Postgres** + **Drizzle ORM** — study tracking database
- **Tailwind CSS v4** + **Biome** — styling + linting
- **Bun** — package manager

## Quick Start

```bash
# Install dependencies
bun install

# Copy env template and fill in real values
cp .env.example .env.local

# Generate Drizzle migration (if schema changed)
bun x drizzle-kit generate

# Apply migration to Supabase
bun x drizzle-kit migrate

# Seed lessons metadata (reads MDX frontmatter + course-schedule.json)
bun run scripts/seed-lessons.ts

# Start dev server (fixed port 3101)
bun run dev
```

Open http://localhost:3101 or the configured dev domain `https://handbook-dev.davidtung.net`.

> Dev server uses fixed port **3101**. Nginx proxies `handbook-dev.davidtung.net` → `127.0.0.1:3101`.

## Commands

```bash
bun run dev            # start dev server at http://localhost:3101
bun run dev:3101       # same as dev, explicit fixed port
bun run build          # production build
bun run start          # serve production build
bun run start:3101     # serve production build at http://localhost:3101
bun run types:check    # fumadocs-mdx + next typegen + tsc --noEmit (full type check)
bun run lint           # biome check (lint)
bun run format         # biome format --write
```

## Architecture

### Content Pipeline (`fumadocs-mdx`)
- MDX content lives in `content/docs/`. `meta.json` files control sidebar order/structure.
- `source.config.ts` defines collections via `defineDocs` and frontmatter/meta schemas.
- `src/lib/source.ts` wraps the generated collection with `loader()` to produce `source`.

### Routes (`src/app/`)
| Route | Description |
|---|---|
| `(home)/` | Landing page |
| `docs/[[...slug]]` | Documentation pages (MDX) with course lock + tracking |
| `profile` | Student learning profile (progress, streak, time) |
| `admin/reports` | Admin dashboard (all students overview) |
| `api/progress/*` | Tracking endpoints (heartbeat, done, video) |
| `api/profile` | Aggregate profile data |
| `api/report/admin/overview` | Admin overview data (cached 5 min) |
| `api/webhook/clerk` | Clerk webhook → sync profiles to DB |
| `api/cron/weekly-report` | Cron: generate + email weekly reports (Sundays 23:00 VN) |
| `api/cron/backup` | Cron: pg_dump backup (daily 02:00 VN) |
| `api/search` | Fumadocs search |
| `api/chat` | AI assistant (Vercel AI SDK + custom OpenAI-compatible provider) |
| `llms.txt`, `llms-full.txt`, `llms.mdx/*` | LLM-friendly endpoints |

### Study Tracking System

The handbook includes a full study tracking system:

- **Tracking**: heartbeat 30s (reading time), video watch time (YouTube IFrame API, aggregate only), "Done" button
- **Profile**: `/profile` — progress overview, streak, 7-day activity chart, lessons by week
- **Admin**: `/admin/reports` — all students overview, CSV export
- **Weekly report**: cron sends email via SMTP (nodemailer + react-email) to students + admin
- **Backup**: daily `pg_dump` cron with S3/R2/B2 upload + 7-day retention

See `docs/plans/STUDY-TRACKING-SYSTEM.md` for full architecture and `docs/plans/USER-STORIES.md` for user stories.

### Database (Supabase + Drizzle)

5 tables: `profiles`, `lessons_meta`, `lesson_progress`, `study_sessions`, `weekly_reports`

- **Schema**: `src/db/schema.ts`
- **Client**: `src/db/index.ts` (Supavisor pooler, IPv4)
- **Migrations**: `drizzle/` folder
- **Seed**: `scripts/seed-lessons.ts` — reads MDX frontmatter + `course-schedule.json`

```bash
# After changing schema
bun x drizzle-kit generate   # create migration SQL
bun x drizzle-kit migrate    # apply to Supabase

# Re-seed lessons metadata
bun run scripts/seed-lessons.ts
```

### Client Components
| Component | Purpose |
|---|---|
| `LessonTracker` | Wraps doc content, sends heartbeat 30s + pagehide |
| `VideoTracker` | Replaces raw iframe, YouTube IFrame API, PATCH 30s |
| `DoneButton` | "Đánh dấu đã học xong" button at end of lesson |

### Conventions
- **Biome** handles lint + format (2-space indent, organize-imports on).
- Import alias: `@/*` → `src/*`; `collections/*` → `.source/*`.
- Package manager: **Bun** (`bun.lock`).

## Environment Variables

See `.env.example` for full reference. Key groups:

| Group | Variables | Required? |
|---|---|---|
| Clerk Auth | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | ✅ |
| PostHog | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Optional |
| Database | `DATABASE_URL`, `SUPABASE_PROJECT_REF` | ✅ |
| Admin | `ADMIN_EMAILS` | ✅ |
| Email SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_REPORT_TO` | ✅ for weekly report |
| Cron | `CRON_SECRET` | ✅ for cron endpoints |
| Clerk Webhook | `CLERK_WEBHOOK_SECRET` | Optional (auto-sync profiles) |
| Backup S3 | `BACKUP_S3_BUCKET`, `BACKUP_S3_ACCESS_KEY`, `BACKUP_S3_SECRET_KEY`, `BACKUP_S3_ENDPOINT` | Optional |
| Ask AI provider | `OPENAI_COMPAT_BASE_URL`, `OPENAI_COMPAT_API_KEY`, `OPENAI_COMPAT_MODEL` | ✅ for Ask AI |

## Deployment (Vercel)

1. Push to GitHub → import project in Vercel
2. Add all environment variables (see `.env.example`)
3. **IMPORTANT**: `DATABASE_URL` must use Supavisor pooler URL (port 6543, IPv4), not direct URL (port 5432)
4. **Clerk domains**: add both production and dev domains in Clerk Dashboard → Configure → Domains / Allowed origins / Authorized parties:
   - `https://handbook-dev.davidtung.net`
   - production domain (e.g. `https://hermes-handbook.davidtung.net`)
5. Vercel Cron is configured in `vercel.json`:
   - Weekly report: Sundays 23:00 VN (16:00 UTC)
   - Backup: Daily 02:00 VN (19:00 UTC)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs](https://fumadocs.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Clerk](https://clerk.com/docs)
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['student', 'admin'])

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  role: userRole('role').notNull().default('student'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const lessonsMeta = pgTable('lessons_meta', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  lessonNumber: text('lesson_number'),
  durationMinutes: integer('duration_minutes'),
  interactionsCount: integer('interactions_count'),
  videoId: text('video_id'),
  week: integer('week'),
  weekLabel: text('week_label'),
  unlockDate: timestamp('unlock_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    slug: text('slug')
      .notNull()
      .references(() => lessonsMeta.slug, { onDelete: 'cascade' }),
    status: text('status').notNull().default('not_started'),
    totalTimeSeconds: integer('total_time_seconds').notNull().default(0),
    lastVisitedAt: timestamp('last_visited_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    videoWatched: boolean('video_watched').notNull().default(false),
    videoWatchTimeSeconds: integer('video_watch_time_seconds').notNull().default(0),
    videoPositionSeconds: integer('video_position_seconds').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('lesson_progress_user_id_slug_idx').on(table.userId, table.slug),
    index('lesson_progress_user_id_idx').on(table.userId),
  ],
)

export const studySessions = pgTable(
  'study_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    sessionId: text('session_id').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    durationSeconds: integer('duration_seconds').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('study_sessions_user_id_started_at_idx').on(table.userId, table.startedAt),
    index('study_sessions_created_at_idx').on(table.createdAt),
  ],
)

export const weeklyReports = pgTable(
  'weekly_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    weekNumber: integer('week_number').notNull(),
    weekStart: timestamp('week_start', { withTimezone: true }).notNull(),
    weekEnd: timestamp('week_end', { withTimezone: true }).notNull(),
    lessonsCompleted: integer('lessons_completed').notNull().default(0),
    lessonsInProgress: integer('lessons_in_progress').notNull().default(0),
    totalTimeSeconds: integer('total_time_seconds').notNull().default(0),
    videoWatchTimeSeconds: integer('video_watch_time_seconds').notNull().default(0),
    reportText: text('report_text'),
    emailedAt: timestamp('emailed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('weekly_reports_user_id_week_number_idx').on(table.userId, table.weekNumber),
  ],
)

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type LessonMeta = typeof lessonsMeta.$inferSelect
export type NewLessonMeta = typeof lessonsMeta.$inferInsert
export type LessonProgress = typeof lessonProgress.$inferSelect
export type NewLessonProgress = typeof lessonProgress.$inferInsert
export type StudySession = typeof studySessions.$inferSelect
export type NewStudySession = typeof studySessions.$inferInsert
export type WeeklyReport = typeof weeklyReports.$inferSelect
export type NewWeeklyReport = typeof weeklyReports.$inferInsert
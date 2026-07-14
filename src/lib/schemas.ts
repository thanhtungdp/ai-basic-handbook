import { z } from 'zod';

export const heartbeatSchema = z.object({
  slug: z.string().min(1),
  sessionId: z.string().uuid(),
});

export const doneSchema = z.object({
  slug: z.string().min(1),
});

export const videoProgressSchema = z.object({
  slug: z.string().min(1),
  videoWatchTimeDelta: z.number().int().nonnegative(),
  videoPositionSeconds: z.number().int().nonnegative(),
  videoWatched: z.boolean().optional(),
});

export const profileSchema = z.object({
  slug: z.string().min(1),
  status: z.enum(['not_started', 'in_progress', 'done']).optional(),
  totalTimeSeconds: z.number().int().nonnegative().optional(),
});
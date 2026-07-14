import scheduleData from '../../content/course-schedule.json';

export interface CourseWeek {
  week: number;
  label: string;
  unlockDate: string;
  pages: string[];
}

export interface CourseSchedule {
  startDate: string;
  title: string;
  weeks: CourseWeek[];
  alwaysAccessible: string[];
}

const schedule = scheduleData as CourseSchedule;

/**
 * Get the current time (server-side, UTC).
 * For SSR/SSG we compare against build time.
 * For client-side countdown we pass the unlockDate to the component.
 */
function now(): Date {
  return new Date();
}

/**
 * Find which week a page slug belongs to.
 * Returns undefined if the page is not in any scheduled week.
 */
export function findWeekForPage(slug: string): CourseWeek | undefined {
  // Normalize: remove leading "docs/" if present, trailing slashes
  const normalized = slug.replace(/^docs\//, '').replace(/\/$/, '');

  // Check each week
  for (const week of schedule.weeks) {
    if (week.pages.includes(normalized)) {
      return week;
    }
  }
  return undefined;
}

/**
 * Check if a page is always accessible (not locked behind schedule).
 */
export function isAlwaysAccessible(slug: string): boolean {
  const normalized = slug.replace(/^docs\//, '').replace(/\/$/, '');
  return schedule.alwaysAccessible.includes(normalized);
}

/**
 * Check if a page should be locked.
 * Returns lock status + week info if locked.
 */
export function getLockStatus(slug: string): {
  locked: boolean;
  unlockDate?: string;
  week?: number;
  weekLabel?: string;
} {
  const normalized = slug.replace(/^docs\//, '').replace(/\/$/, '');

  // Always accessible pages are never locked
  if (isAlwaysAccessible(normalized)) {
    return { locked: false };
  }

  // Find which week this page belongs to
  const week = findWeekForPage(normalized);

  // If not in any week, it's not managed by schedule — don't lock
  if (!week) {
    return { locked: false };
  }

  // Check if unlock date has passed
  const unlock = new Date(week.unlockDate);
  const current = now();

  if (current >= unlock) {
    return { locked: false };
  }

  return {
    locked: true,
    unlockDate: week.unlockDate,
    week: week.week,
    weekLabel: week.label,
  };
}

/**
 * Check for admin unlock override via query param.
 * ?unlock=all → unlock everything
 * ?unlock=<slug> → unlock specific page
 */
export function checkAdminUnlock(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  slug: string,
): boolean {
  if (!searchParams) return false;
  const unlock = searchParams.unlock;
  if (!unlock) return false;
  const value = Array.isArray(unlock) ? unlock[0] : unlock;
  if (value === 'all') return true;
  const normalized = slug.replace(/^docs\//, '').replace(/\/$/, '');
  return value === normalized;
}

export { schedule };
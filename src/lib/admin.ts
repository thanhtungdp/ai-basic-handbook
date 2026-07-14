import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function ensureProfileForClerkUser(clerkUserId: string) {
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.clerkUserId, clerkUserId))
    .limit(1)

  if (existing[0]) {
    return existing[0]
  }

  const client = await clerkClient()
  const user = await client.users.getUser(clerkUserId)
  const email = user.primaryEmailAddress?.emailAddress

  if (!email) {
    throw new Error('Authenticated Clerk user has no primary email address')
  }

  const fullName = user.fullName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || email

  const inserted = await db
    .insert(profiles)
    .values({
      clerkUserId,
      email,
      fullName,
    })
    .onConflictDoUpdate({
      target: profiles.clerkUserId,
      set: {
        email,
        fullName,
      },
    })
    .returning()

  return inserted[0]
}

export async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) {
    return {
      error: Response.json({ error: 'Unauthorized' }, { status: 401 }) as Response,
      user: null,
      profile: null,
    }
  }

  const profile = await ensureProfileForClerkUser(userId)

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((s) => s.trim().toLowerCase())
  const userEmail = (user.primaryEmailAddress?.emailAddress ?? '').toLowerCase()

  if (!adminEmails.includes(userEmail)) {
    return {
      error: Response.json({ error: 'Forbidden' }, { status: 403 }) as Response,
      user: null,
      profile: null,
    }
  }

  return { error: null as Response | null, user, profile }
}

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    return {
      error: Response.json({ error: 'Unauthorized' }, { status: 401 }) as Response,
      userId: null,
      profile: null,
    }
  }

  const profile = await ensureProfileForClerkUser(userId)
  return { error: null as Response | null, userId, profile }
}

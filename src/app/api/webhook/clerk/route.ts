import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 400 })
  }

  // Get headers
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Verify signature
  const body = await req.text()
  const wh = new Webhook(webhookSecret)

  let payload: Record<string, unknown>
  try {
    payload = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  const eventType = payload['type'] as string
  const data = payload['data'] as Record<string, unknown>

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const clerkUserId = data['id'] as string
      const emailAddresses = data['email_addresses'] as Array<{ email_address: string }>
      const primaryEmail = emailAddresses?.[0]?.email_address ?? ''
      const firstName = (data['first_name'] as string) ?? ''
      const lastName = (data['last_name'] as string) ?? ''
      const fullName = `${firstName} ${lastName}`.trim() || primaryEmail

      await db
        .insert(profiles)
        .values({
          clerkUserId,
          email: primaryEmail,
          fullName,
        })
        .onConflictDoUpdate({
          target: profiles.clerkUserId,
          set: {
            email: primaryEmail,
            fullName,
            updatedAt: new Date(),
          },
        })
    } else if (eventType === 'user.deleted') {
      const clerkUserId = data['id'] as string
      await db.delete(profiles).where(eq(profiles.clerkUserId, clerkUserId))
    }

    return NextResponse.json({ ok: true, eventType })
  } catch (error) {
    console.error('Clerk webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
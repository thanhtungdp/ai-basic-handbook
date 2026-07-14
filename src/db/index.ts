import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

// Lazy init — only connect when DATABASE_URL is set
const client = databaseUrl
  ? postgres(databaseUrl, { max: 10 })
  : null

export const db = client
  ? drizzle(client, { schema })
  : null as unknown as ReturnType<typeof drizzle<typeof schema>>
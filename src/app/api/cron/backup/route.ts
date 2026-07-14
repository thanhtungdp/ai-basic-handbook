import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const BACKUP_DIR = '/tmp/hermes-backups'
const RETENTION_DAYS = 7

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  const authHeader = req.headers.get('x-cron-secret')
  if (authHeader !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = path.join(BACKUP_DIR, `db-${timestamp}.dump`)

  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true })

    execSync(
      `pg_dump "${databaseUrl}" --no-owner --no-acls --format=custom --file="${backupFile}"`,
      { timeout: 120000 }
    )

    const stats = await fs.stat(backupFile)
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)

    let s3Status = 'skipped'
    const s3Bucket = process.env.BACKUP_S3_BUCKET
    const s3AccessKey = process.env.BACKUP_S3_ACCESS_KEY
    const s3SecretKey = process.env.BACKUP_S3_SECRET_KEY

    if (s3Bucket && s3AccessKey && s3SecretKey) {
      try {
        const s3Endpoint = process.env.BACKUP_S3_ENDPOINT || 'https://s3.amazonaws.com'
        const s3Key = `hermes-handbook/${path.basename(backupFile)}`
        execSync(
          `AWS_ACCESS_KEY_ID="${s3AccessKey}" AWS_SECRET_ACCESS_KEY="${s3SecretKey}" ` +
          `aws s3 cp "${backupFile}" "s3://${s3Bucket}/${s3Key}" --endpoint-url "${s3Endpoint}"`,
          { timeout: 120000 }
        )
        s3Status = `uploaded to s3://${s3Bucket}/${s3Key}`
      } catch (s3Err) {
        s3Status = `upload failed: ${s3Err instanceof Error ? s3Err.message : 'unknown'}`
      }
    }

    // Cleanup old backups
    const files = await fs.readdir(BACKUP_DIR)
    const now = Date.now()
    for (const file of files) {
      if (!file.startsWith('db-') || !file.endsWith('.dump')) continue
      const filePath = path.join(BACKUP_DIR, file)
      const fileStats = await fs.stat(filePath)
      const ageDays = (now - fileStats.mtimeMs) / (1000 * 60 * 60 * 24)
      if (ageDays > RETENTION_DAYS) {
        await fs.unlink(filePath)
      }
    }

    const remainingFiles = (await fs.readdir(BACKUP_DIR))
      .filter(f => f.startsWith('db-') && f.endsWith('.dump'))
      .sort()
      .reverse()

    return NextResponse.json({
      ok: true,
      backup: { file: path.basename(backupFile), sizeMB: `${sizeMB} MB`, s3: s3Status },
      retention: { days: RETENTION_DAYS, remainingBackups: remainingFiles.length },
    })
  } catch (error) {
    console.error('Backup failed:', error)
    return NextResponse.json(
      { error: 'Backup failed', message: error instanceof Error ? error.message : 'unknown' },
      { status: 500 }
    )
  }
}
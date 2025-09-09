import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

// Robustly attempt to load env files from several likely locations so Prisma can
// read DATABASE_URL during build/prerender in Turbopack worker processes.
const tryPaths = [
  path.resolve(__dirname, '../../.env.local'), // project root from src/lib
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env.local'), // if code moved in build
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'eyelux-next/.env.local'),
  path.resolve(process.cwd(), 'eyelux-next/.env'),
]

for (const p of tryPaths) {
  try {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p })
      if (process.env.DATABASE_URL) break
    }
  } catch (e) {
    // ignore
  }
}

// If DATABASE_URL still isn't set, provide a safe absolute fallback to the local
// SQLite DB shipped with the project (prisma/dev.db). Use forward slashes for the
// file URL to be compatible across platforms.
if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(__dirname, '../../prisma/dev.db')
  const dbUrl = 'file:' + dbPath.split(path.sep).join('/')
  process.env.DATABASE_URL = dbUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientOptions: any = {}
if (process.env.DATABASE_URL) {
  prismaClientOptions.datasources = { db: { url: process.env.DATABASE_URL } }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

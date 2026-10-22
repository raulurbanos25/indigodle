import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_DB = fileURLToPath(new URL('../data/community-stats.json', import.meta.url))
const DB_PATH = resolve(process.env.INDIGODLE_DB_PATH || DEFAULT_DB)
const EMPTY_DB = { visits: 0, likes: 0, visitedSessions: [], likedSessions: [] }

let queue = Promise.resolve()

function serialized(operation) {
  const result = queue.then(operation)
  queue = result.catch(() => {})
  return result
}

async function readDatabase() {
  try {
    const db = JSON.parse(await readFile(DB_PATH, 'utf8'))
    return {
      visits: Number.isFinite(db.visits) ? db.visits : 0,
      likes: Number.isFinite(db.likes) ? db.likes : 0,
      visitedSessions: Array.isArray(db.visitedSessions) ? db.visitedSessions : [],
      likedSessions: Array.isArray(db.likedSessions) ? db.likedSessions : [],
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return { ...EMPTY_DB }
  }
}

async function writeDatabase(db) {
  await mkdir(dirname(DB_PATH), { recursive: true })
  const temporaryPath = `${DB_PATH}.${process.pid}.tmp`
  await writeFile(temporaryPath, `${JSON.stringify(db, null, 2)}\n`, 'utf8')
  await rename(temporaryPath, DB_PATH)
}

function sessionHash(value) {
  if (typeof value !== 'string' || value.length < 16 || value.length > 100) return null
  return createHash('sha256').update(value).digest('hex')
}

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(body))
}

async function readBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 2048) throw new Error('Request body too large')
  }
  return JSON.parse(body || '{}')
}

export async function handleCommunityApi(request, response, next = () => {}) {
  const url = new URL(request.url, 'http://localhost')
  if (!url.pathname.startsWith('/api/community')) return next()

  try {
    if (request.method === 'GET' && url.pathname === '/api/community') {
      const db = await serialized(readDatabase)
      const session = sessionHash(url.searchParams.get('sessionId'))
      return sendJson(response, 200, {
        visits: db.visits,
        likes: db.likes,
        liked: session ? db.likedSessions.includes(session) : false,
      })
    }

    if (request.method !== 'POST' || !['/api/community/visit', '/api/community/like'].includes(url.pathname)) {
      return sendJson(response, 404, { error: 'Not found' })
    }

    const body = await readBody(request)
    const session = sessionHash(body.sessionId)
    if (!session) return sendJson(response, 400, { error: 'Invalid session' })

    const result = await serialized(async () => {
      const db = await readDatabase()
      if (url.pathname.endsWith('/visit') && !db.visitedSessions.includes(session)) {
        db.visitedSessions.push(session)
        db.visits += 1
      }
      if (url.pathname.endsWith('/like') && !db.likedSessions.includes(session)) {
        db.likedSessions.push(session)
        db.likes += 1
      }
      await writeDatabase(db)
      return {
        visits: db.visits,
        likes: db.likes,
        liked: db.likedSessions.includes(session),
      }
    })

    return sendJson(response, 200, result)
  } catch (error) {
    console.error('[community-api]', error)
    return sendJson(response, 500, { error: 'Could not update community stats' })
  }
}

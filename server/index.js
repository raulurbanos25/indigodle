import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleCommunityApi } from './communityApi.js'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const PORT = Number(process.env.PORT) || 4173
const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

async function serveStatic(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end()
    return
  }

  let requestedPath
  try {
    requestedPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  } catch {
    response.writeHead(400).end('Bad request')
    return
  }

  let target = resolve(DIST, `.${requestedPath}`)
  if (target !== DIST && !target.startsWith(`${DIST}${sep}`)) {
    response.writeHead(403).end('Forbidden')
    return
  }

  try {
    const info = await stat(target)
    if (info.isDirectory()) target = resolve(target, 'index.html')
  } catch {
    target = resolve(DIST, 'index.html')
  }

  try {
    const info = await stat(target)
    response.writeHead(200, {
      'Content-Length': info.size,
      'Content-Type': CONTENT_TYPES[extname(target).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    })
    if (request.method === 'HEAD') response.end()
    else createReadStream(target).pipe(response)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found')
  }
}

createServer((request, response) => {
  handleCommunityApi(request, response, () => serveStatic(request, response))
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Indigodle server listening on port ${PORT}`)
})

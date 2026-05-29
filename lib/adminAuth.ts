import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.ADMIN_JWT_SECRET || 'change-this-secret-in-production'

export function signAdminToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, iat: Date.now(), exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url')
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const sig = createHmac('sha256', SECRET).update(`${header}.${payload}`).digest('base64url')
  return `${header}.${payload}.${sig}`
}

export function verifyAdminToken(token: string): { email: string } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, payload, sig] = parts
    const expected = createHmac('sha256', SECRET).update(`${header}.${payload}`).digest('base64url')
    const sigBuf = Buffer.from(sig)
    const expBuf = Buffer.from(expected)
    if (sigBuf.length !== expBuf.length) return null
    if (!timingSafeEqual(sigBuf, expBuf)) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (data.exp < Date.now()) return null
    return { email: data.email }
  } catch {
    return null
  }
}

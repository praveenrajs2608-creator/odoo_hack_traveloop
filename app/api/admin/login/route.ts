import { NextResponse } from 'next/server'
import { signAdminToken } from '@/lib/adminAuth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured in environment variables')
      return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 })
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 })
    }

    const token = signAdminToken(email)
    return NextResponse.json({ success: true, token })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}

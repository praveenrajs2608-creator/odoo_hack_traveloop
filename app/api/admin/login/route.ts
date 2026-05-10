import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@traveloop.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (email === adminEmail && password === adminPassword) {
    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${adminEmail}:${Date.now()}`).toString('base64')
    return NextResponse.json({ success: true, token })
  }

  return NextResponse.json(
    { success: false, error: 'Invalid admin credentials' },
    { status: 401 }
  )
}

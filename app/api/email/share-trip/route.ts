import { NextResponse } from 'next/server'
import { sendTripShareEmail } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const { toEmail, senderName, tripName, shareUrl } = await request.json()

    if (!toEmail || !tripName || !shareUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sendTripShareEmail(toEmail, senderName || 'A Traveloop user', tripName, shareUrl)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Share email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

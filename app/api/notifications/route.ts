import { NextResponse } from 'next/server'
import { sendTripReminder } from '@/lib/onesignal'

export async function POST(request: Request) {
  try {
    const { playerId, tripName, daysLeft } = await request.json()

    if (!playerId || !tripName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await sendTripReminder(playerId, tripName, daysLeft || 3)
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('Push notification error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}

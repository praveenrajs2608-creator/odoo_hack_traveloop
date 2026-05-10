import { NextResponse } from 'next/server'
import { suggestActivities } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { city, country, preferences } = await request.json()

    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 })
    }

    const activities = await suggestActivities(city, country || '', preferences)
    return NextResponse.json({ activities })
  } catch (error: any) {
    console.error('Activity suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to get activity suggestions' },
      { status: 500 }
    )
  }
}

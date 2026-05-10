import { NextResponse } from 'next/server'
import { generateItinerary } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env.local' },
        { status: 500 }
      )
    }

    const itinerary = await generateItinerary(prompt)
    return NextResponse.json({ itinerary })
  } catch (error: any) {
    console.error('AI generation error:', error?.message || error)
    return NextResponse.json(
      { error: error?.message || 'AI generation failed. Please try again.' },
      { status: 500 }
    )
  }
}

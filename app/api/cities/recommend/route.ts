import { NextResponse } from 'next/server'
import { geminiModel } from '@/lib/gemini'

interface Answers {
  vibe: string
  group: string
  budget: string
  duration: string
  season: string
}

const DESTINATION_PROMPT = `
You are an expert travel advisor. Based on the user's travel preferences, recommend exactly 6 real travel destinations.

Return ONLY valid JSON — no markdown, no explanation — with this exact structure:
{
  "destinations": [
    {
      "id": "unique-slug",
      "name": "City Name",
      "country": "Country",
      "latitude": 0.0,
      "longitude": 0.0,
      "image_url": "https://images.unsplash.com/photo-<photo-id>?w=800&q=80",
      "tags": ["tag1", "tag2", "tag3"],
      "cost_index": 5,
      "popularity_score": 85,
      "budget_level": "moderate",
      "best_season": ["winter", "spring"],
      "group_suitability": ["couple", "solo"],
      "estimated_cost_inr": "45,000",
      "match_score": 8
    }
  ]
}

Rules:
- Recommend REAL places that genuinely match the preferences
- match_score should be 1-10 based on how well the destination fits ALL preferences
- At least 2 destinations should have match_score >= 8
- estimated_cost_inr must be a realistic per-person trip cost in Indian Rupees with Indian number formatting (commas)
- cost_index is 1-10 (1=cheapest, 10=most expensive)
- image_url should use the pattern: https://source.unsplash.com/800x600/?<city-name-url-encoded>+travel
- tags should include the vibe preference and other relevant tags
- budget_level must be one of: budget, moderate, premium, luxury
- best_season values must be from: summer, monsoon, winter, spring
- group_suitability values must be from: solo, couple, friends, family
- Sort by match_score descending
- Include a diverse mix — some domestic (India) and some international destinations
- latitude and longitude must be accurate real coordinates
`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const answers: Answers = body.answers

    if (!answers || !answers.vibe) {
      return NextResponse.json({ error: 'Missing answers' }, { status: 400 })
    }

    const userPrompt = `
User preferences:
- Vibe: ${answers.vibe}
- Travel group: ${answers.group}
- Budget: ${answers.budget}
- Duration: ${answers.duration}
- Season: ${answers.season}

Recommend 6 destinations that best match these preferences.`

    const result = await geminiModel.generateContent(
      `${DESTINATION_PROMPT}\n\n${userPrompt}`
    )

    const text = result.response.text()

    // Extract JSON from response
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')

    if (start === -1 || end === -1) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(cleaned.slice(start, end + 1))

    // Validate structure
    if (!parsed.destinations || !Array.isArray(parsed.destinations)) {
      throw new Error('Invalid response structure')
    }

    // Ensure all destinations have required fields
    const destinations = parsed.destinations.slice(0, 6).map((d: Record<string, unknown>, i: number) => ({
      id: (d.id as string) || `ai-${i}`,
      name: (d.name as string) || 'Unknown',
      country: (d.country as string) || 'Unknown',
      region: null,
      latitude: (d.latitude as number) || null,
      longitude: (d.longitude as number) || null,
      cost_index: (d.cost_index as number) || 5,
      popularity_score: (d.popularity_score as number) || 80,
      image_url: (d.image_url as string) || null,
      tags: (d.tags as string[]) || [],
      budget_level: (d.budget_level as string) || answers.budget,
      best_season: (d.best_season as string[]) || [answers.season],
      group_suitability: (d.group_suitability as string[]) || [answers.group],
      estimated_cost_inr: (d.estimated_cost_inr as string) || null,
      match_score: (d.match_score as number) || 5,
    }))

    // Sort by match_score descending
    destinations.sort((a: { match_score: number }, b: { match_score: number }) => b.match_score - a.match_score)

    return NextResponse.json({ destinations })
  } catch (err) {
    console.error('Recommendation error:', err)
    return NextResponse.json(
      { error: 'Failed to get AI recommendations', details: String(err) },
      { status: 500 }
    )
  }
}

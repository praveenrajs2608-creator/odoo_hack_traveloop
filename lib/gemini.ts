import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

export const ITINERARY_SYSTEM_PROMPT = `
You are an expert travel planner. Generate a complete travel itinerary as JSON.
Return ONLY valid JSON with this exact structure:
{
  "trip_name": "string",
  "duration_days": number,
  "stops": [
    {
      "city": "string",
      "country": "string",
      "days": number,
      "latitude": number,
      "longitude": number,
      "activities": [
        {
          "name": "string",
          "type": "sightseeing|food|adventure|culture|shopping|nightlife",
          "estimated_cost": number,
          "duration_hours": number,
          "time_of_day": "morning|afternoon|evening|night",
          "description": "string",
          "day_number": number
        }
      ]
    }
  ],
  "estimated_total_budget": number,
  "budget_breakdown": {
    "transport": number,
    "stay": number,
    "activities": number,
    "meals": number
  }
}

Budget currency: INR
Be realistic with costs. Include 3-5 activities per city per day.
`

export const ACTIVITY_SUGGESTION_PROMPT = `
You are an expert travel advisor. Suggest activities for a traveler visiting a specific city.
Return ONLY valid JSON array:
[
  {
    "name": "string",
    "type": "sightseeing|food|adventure|culture|shopping|nightlife",
    "estimated_cost": number,
    "duration_hours": number,
    "time_of_day": "morning|afternoon|evening|night",
    "description": "string"
  }
]

Budget currency: INR. Be realistic. Suggest 5-8 diverse activities.
`

export async function generateItinerary(prompt: string) {
  const result = await geminiModel.generateContent(
    `${ITINERARY_SYSTEM_PROMPT}\n\nUser request: ${prompt}`
  )
  const text = result.response.text()
  // Extract JSON — handle both raw JSON and markdown code blocks
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
  // Find the JSON object boundaries
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON found in AI response')
  return JSON.parse(cleaned.slice(start, end + 1))
}

export async function suggestActivities(city: string, country: string, preferences?: string) {
  const prompt = `${ACTIVITY_SUGGESTION_PROMPT}\n\nCity: ${city}, ${country}${
    preferences ? `\nPreferences: ${preferences}` : ''
  }`
  const result = await geminiModel.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
  const start = cleaned.indexOf('[')
  const end = cleaned.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('No JSON array in AI response')
  return JSON.parse(cleaned.slice(start, end + 1))
}

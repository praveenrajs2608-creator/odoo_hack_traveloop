import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const activitySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['sightseeing', 'food', 'adventure', 'shopping', 'culture', 'nightlife', 'transport', 'stay']),
  description: z.string().optional(),
  estimated_cost: z.number().min(0).optional().default(0),
  duration_hours: z.number().positive().optional(),
  time_of_day: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  day_number: z.number().int().positive().optional(),
  is_ai_suggested: z.boolean().optional().default(false),
})

async function verifyStopOwnership(supabase: ReturnType<typeof createRouteHandlerClient>, stopId: string, userId: string) {
  const { data } = await supabase
    .from('stops')
    .select('id, trips(user_id)')
    .eq('id', stopId)
    .single()
  if (!data) return false
  const trip = data.trips as { user_id: string } | null
  return trip?.user_id === userId
}

export async function GET(
  request: Request,
  { params }: { params: { stopId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await verifyStopOwnership(supabase, params.stopId, session.user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('stop_id', params.stopId)
    .order('day_number', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ activities: data })
}

export async function POST(
  request: Request,
  { params }: { params: { stopId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await verifyStopOwnership(supabase, params.stopId, session.user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const parsed = activitySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({ ...parsed.data, stop_id: params.stopId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ activity: data }, { status: 201 })
}

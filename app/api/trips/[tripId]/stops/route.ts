import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function verifyTripOwnership(supabase: ReturnType<typeof createRouteHandlerClient>, tripId: string, userId: string) {
  const { data } = await supabase.from('trips').select('id, user_id').eq('id', tripId).single()
  return data?.user_id === userId
}

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await verifyTripOwnership(supabase, params.tripId, session.user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('stops')
    .select('*, activities(*)')
    .eq('trip_id', params.tripId)
    .order('order_index', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ stops: data })
}

export async function POST(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await verifyTripOwnership(supabase, params.tripId, session.user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()

  const { data, error } = await supabase
    .from('stops')
    .insert({ ...body, trip_id: params.tripId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ stop: data }, { status: 201 })
}

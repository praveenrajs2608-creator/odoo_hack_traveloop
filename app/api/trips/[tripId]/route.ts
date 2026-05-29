import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function getAuthorizedTrip(supabase: ReturnType<typeof createRouteHandlerClient>, tripId: string, userId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('id, user_id')
    .eq('id', tripId)
    .single()
  if (error || !data) return null
  if (data.user_id !== userId) return null
  return data
}

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await getAuthorizedTrip(supabase, params.tripId, session.user.id)
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('trips')
    .select('*, stops(*, activities(*)), budget_items(*)')
    .eq('id', params.tripId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trip: data })
}

export async function PUT(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await getAuthorizedTrip(supabase, params.tripId, session.user.id)
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()

  const { data, error } = await supabase
    .from('trips')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.tripId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trip: data })
}

export async function DELETE(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await getAuthorizedTrip(supabase, params.tripId, session.user.id)
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', params.tripId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

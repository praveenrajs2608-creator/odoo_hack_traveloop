import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

export async function PUT(
  request: Request,
  { params }: { params: { stopId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await verifyStopOwnership(supabase, params.stopId, session.user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()

  const { data, error } = await supabase
    .from('stops')
    .update(body)
    .eq('id', params.stopId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ stop: data })
}

export async function DELETE(
  request: Request,
  { params }: { params: { stopId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await verifyStopOwnership(supabase, params.stopId, session.user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase
    .from('stops')
    .delete()
    .eq('id', params.stopId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

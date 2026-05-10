import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

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
  const body = await request.json()

  const { data, error } = await supabase
    .from('stops')
    .insert({ ...body, trip_id: params.tripId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ stop: data }, { status: 201 })
}

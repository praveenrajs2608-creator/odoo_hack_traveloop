import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const region = searchParams.get('region')

  const supabase = createRouteHandlerClient({ cookies })

  let dbQuery = supabase
    .from('cities')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('popularity_score', { ascending: false })
    .limit(20)

  if (region) {
    dbQuery = dbQuery.eq('region', region)
  }

  const { data, error } = await dbQuery

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ cities: data || [] })
}

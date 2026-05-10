import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PublicTripView } from '@/components/shared/PublicTripView'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

async function getPublicTrip(tripId: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  if (!trip) return null

  const { data: stops } = await supabase
    .from('stops')
    .select('*, activities(*)')
    .eq('trip_id', tripId)
    .order('order_index', { ascending: true })

  return { trip, stops: stops || [] }
}

export async function generateMetadata({ params }: { params: { tripId: string } }): Promise<Metadata> {
  const data = await getPublicTrip(params.tripId)
  if (!data) return { title: 'Trip Not Found — Traveloop' }

  return {
    title: `${data.trip.name} — Traveloop`,
    description: `Check out this trip itinerary on Traveloop`,
    openGraph: {
      title: `${data.trip.name} — Traveloop`,
      description: `View the full itinerary for ${data.trip.name}`,
      images: data.trip.cover_photo_url ? [data.trip.cover_photo_url] : [],
    },
  }
}

export default async function SharePage({ params }: { params: { tripId: string } }) {
  const data = await getPublicTrip(params.tripId)
  if (!data) notFound()

  return <PublicTripView trip={data.trip} stops={data.stops} />
}

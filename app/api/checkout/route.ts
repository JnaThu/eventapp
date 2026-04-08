import type { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { eventId } = await request.json()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: event } = await supabase
    .from('events')
    .select('id, title, price')
    .eq('id', eventId)
    .single()

  if (!event) {
    return Response.json({ error: 'Event not found' }, { status: 404 })
  }

  const origin = request.headers.get('origin') ?? ''

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'nok',
          product_data: { name: event.title },
          unit_amount: Math.round((event.price ?? 0) * 100), // øre
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/events/${event.id}`,
    metadata: {
      event_id: event.id,
      attendee_id: user.id,
    },
  })

  return Response.json({ url: session.url })
}

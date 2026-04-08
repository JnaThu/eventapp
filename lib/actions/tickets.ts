'use server'

import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export type TicketState = { error: string } | undefined

export async function registerFreeTicket(
  _state: TicketState,
  formData: FormData
): Promise<TicketState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const eventId = formData.get('event_id') as string

  const { data: existing } = await createAdminClient()
    .from('tickets')
    .select('id')
    .eq('event_id', eventId)
    .eq('attendee_id', user.id)
    .maybeSingle()

  if (existing) return { error: 'You are already registered for this event.' }

  await createAdminClient().from('tickets').insert({
    event_id: eventId,
    attendee_id: user.id,
    status: 'confirmed',
  })

  redirect(`/tickets/success?event_id=${eventId}`)
}

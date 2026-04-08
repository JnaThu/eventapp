'use server'

import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function registerFreeTicket(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const eventId = formData.get('event_id') as string

  await createAdminClient().from('tickets').insert({
    event_id: eventId,
    attendee_id: user.id,
    status: 'confirmed',
  })

  redirect(`/tickets/success?event_id=${eventId}`)
}

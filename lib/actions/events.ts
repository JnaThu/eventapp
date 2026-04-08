'use server'

import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export type EventFormState = { error: string } | undefined

export async function createEvent(
  _state: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'You must be logged in to post an event.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'organiser') {
    return { error: 'Only organisers can post events.' }
  }

  const date = formData.get('date') as string // YYYY-MM-DD
  const time = formData.get('time') as string // HH:MM
  const datetime = new Date(`${date}T${time}:00`).toISOString()

  const isFree = formData.get('is_free') === 'on'
  const price = isFree ? 0 : Number(formData.get('price') ?? 0)

  const { data: event, error } = await createAdminClient()
    .from('events')
    .insert({
      title: formData.get('title') as string,
      dance_style: formData.get('dance_style') as string,
      date: datetime,
      location: formData.get('location') as string,
      price,
      description: formData.get('description') as string,
      organiser_id: user.id,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  redirect(`/events/${event.id}`)
}

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'

type SearchParams = {
  session_id?: string
  event_id?: string
}

type EventDetails = {
  id: string
  title: string
  date: string
  location: string
}

async function getEventById(id: string): Promise<EventDetails | null> {
  const { data } = await createAdminClient()
    .from('events')
    .select('id, title, date, location')
    .eq('id', id)
    .single()
  return data
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function TicketSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { session_id, event_id } = await searchParams

  let event: EventDetails | null = null

  if (session_id) {
    // Paid event — verify Stripe session and create ticket
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') redirect('/')

    const eventId = session.metadata?.event_id
    const attendeeId = session.metadata?.attendee_id

    if (!eventId || !attendeeId) redirect('/')

    // Upsert is idempotent — safe if user refreshes the page
    await createAdminClient()
      .from('tickets')
      .upsert(
        {
          event_id: eventId,
          attendee_id: attendeeId,
          stripe_session_id: session_id,
          status: 'confirmed',
        },
        { onConflict: 'stripe_session_id' }
      )

    event = await getEventById(eventId)
  } else if (event_id) {
    // Free event — ticket already created by server action, just show confirmation
    event = await getEventById(event_id)
  } else {
    redirect('/')
  }

  if (!event) redirect('/')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-8 text-center">
          {/* Checkmark */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-7 w-7 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            You&apos;re registered!
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your ticket has been confirmed.
          </p>

          <div className="mt-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4 text-left space-y-2">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {event.title}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {formatDate(event.date)} at {formatTime(event.date)}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {event.location}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/events/${event.id}`}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Back to event
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              Browse more events
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

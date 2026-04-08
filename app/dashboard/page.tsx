import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deleteEvent } from '@/lib/actions/events'
import type { Event } from '@/lib/supabase'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number | null) {
  if (price === null || price === 0) return 'Free'
  return `${price} kr`
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'organiser') redirect('/sign-in')

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organiser_id', user.id)
    .order('date', { ascending: true })

  const myEvents: Event[] = events ?? []

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Events
          </h1>
          <Link
            href="/events/new"
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            Post an event
          </Link>
        </div>

        {/* Empty state */}
        {myEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              You haven&apos;t posted any events yet.
            </p>
            <Link
              href="/events/new"
              className="mt-4 inline-block rounded-full bg-zinc-900 dark:bg-zinc-50 px-5 py-2 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              Post your first event
            </Link>
          </div>
        ) : (
          /* Events table */
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                    <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      Style
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      Date &amp; time
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                      Attendees
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {myEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/events/${event.id}`}
                          className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
                        >
                          {event.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {event.dance_style}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {formatDate(event.date)}
                        <span className="ml-1.5 text-zinc-400 dark:text-zinc-500">
                          {formatTime(event.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {formatPrice(event.price)}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        0
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="rounded-lg border border-zinc-200 dark:border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                          >
                            Edit
                          </Link>
                          <form action={deleteEvent}>
                            <input type="hidden" name="id" value={event.id} />
                            <button
                              type="submit"
                              className="rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

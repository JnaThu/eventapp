import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase, type Event } from '@/lib/supabase'

async function getEvent(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
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

function formatPrice(price: number | null) {
  if (price === null || price === 0) return 'Free'
  return `${price} kr`
}

export default async function EventPage(props: PageProps<'/events/[id]'>) {
  const { id } = await props.params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-8"
        >
          <span aria-hidden>←</span> Back to all events
        </Link>

        <article className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="inline-block rounded-full bg-zinc-100 dark:bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-3">
                  {event.dance_style}
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {event.title}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {formatPrice(event.price)}
                </p>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Date
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200 capitalize">
                  {formatDate(event.date)}
                </dd>
              </div>

              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Time
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {formatTime(event.date)}
                </dd>
              </div>

              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4 sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Location
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {event.location}
                </dd>
              </div>
            </dl>

            {event.description && (
              <div className="mt-8">
                <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-3">
                  About this event
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}

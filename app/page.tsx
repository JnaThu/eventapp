import Link from 'next/link'
import { supabase, type Event } from '@/lib/supabase'

async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error.message)
    return []
  }

  return data ?? []
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatPrice(price: number | null) {
  if (price === null || price === 0) return 'Free'
  return `${price} kr`
}

export default async function Home() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dance Events in Bergen
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Find dance classes, socials and competitions near you.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {events.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            No events found.
          </p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.id}`}
                  className="block bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-md transition-all"
                >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {event.title}
                      </h2>
                      <span className="inline-block rounded-full bg-zinc-100 dark:bg-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                        {event.dance_style}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                      <span>{formatDate(event.date)}</span>
                      <span>{event.location}</span>
                    </div>

                    {event.description && (
                      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatPrice(event.price)}
                    </span>
                  </div>
                </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TicketCard from './TicketCard'

type Profile = {
  full_name: string
  email: string
  role: string
}

type TicketWithEvent = {
  id: string
  event_id: string
  attendee_id: string
  status: string
  created_at: string
  events: {
    id: string
    title: string
    date: string
    location: string
    price: number | null
  }
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab = tab === 'details' ? 'details' : 'tickets'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null

  const { data: ticketsData } = await supabase
    .from('tickets')
    .select('id, event_id, attendee_id, status, created_at, events(id, title, date, location, price)')
    .eq('attendee_id', user.id)

  const tickets = ((ticketsData ?? []) as TicketWithEvent[]).sort(
    (a, b) => new Date(b.events.date).getTime() - new Date(a.events.date).getTime()
  )

  const tabLinkClass = (t: string) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
      activeTab === t
        ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
    }`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Profile
          </h1>
          {profile && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {profile.full_name}
            </p>
          )}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8">
          <Link href="/profile?tab=tickets" className={tabLinkClass('tickets')}>
            My Tickets
          </Link>
          <Link href="/profile?tab=details" className={tabLinkClass('details')}>
            My Details
          </Link>
        </div>

        {/* My Tickets tab */}
        {activeTab === 'tickets' && (
          <>
            {profile?.role === 'organiser' ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-10 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Switch to an attendee account to purchase tickets.
                </p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-10 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No tickets yet — browse events to get started.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block rounded-full bg-zinc-900 dark:bg-zinc-50 px-5 py-2 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                >
                  Browse events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </>
        )}

        {/* My Details tab */}
        {activeTab === 'details' && (
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm divide-y divide-zinc-100 dark:divide-zinc-700">
            {[
              { label: 'Full name', value: profile?.full_name },
              { label: 'Email', value: profile?.email },
              {
                label: 'Role',
                value: profile?.role
                  ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                  : undefined,
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {label}
                </span>
                <span className="text-sm text-zinc-900 dark:text-zinc-50">
                  {value ?? '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

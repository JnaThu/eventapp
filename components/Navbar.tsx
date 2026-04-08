import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let displayName: string | null = null
  let role: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single()
    displayName = profile?.full_name ?? user.email ?? 'User'
    role = profile?.role ?? null
  }

  return (
    <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base font-semibold text-zinc-900 dark:text-zinc-50 hover:opacity-75 transition-opacity shrink-0"
        >
          Dance Events Bergen
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            {role === 'organiser' && (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-zinc-300 dark:border-zinc-600 px-4 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <Link
                  href="/events/new"
                  className="rounded-full bg-zinc-900 dark:bg-zinc-50 px-4 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
                >
                  Post an event
                </Link>
              </>
            )}
            <span className="text-sm text-zinc-600 dark:text-zinc-300 truncate max-w-[160px]">
              {displayName}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-zinc-300 dark:border-zinc-600 px-4 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
              >
                Log out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/sign-up/attendee"
              className="rounded-full border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
            >
              Attendee sign up
            </Link>
            <Link
              href="/sign-up/organiser"
              className="rounded-full border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
            >
              Organiser sign up
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 px-4 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

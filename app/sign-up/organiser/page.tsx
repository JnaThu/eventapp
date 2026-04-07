'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signUpOrganiser } from '@/lib/actions/auth'

export default function OrganiserSignUpPage() {
  const [state, action, pending] = useActionState(signUpOrganiser, undefined)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-8">
          <div className="mb-6">
            <span className="inline-block rounded-full bg-zinc-100 dark:bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-3">
              Organiser
            </span>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Create an account
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Sign up to list and manage dance events in Bergen.
            </p>
          </div>

          <form action={action} className="space-y-4">
            {state?.error && (
              <p className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {state.error}
              </p>
            )}

            <div className="space-y-1">
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>
              Looking for events?{' '}
              <Link
                href="/sign-up/attendee"
                className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                Sign up as attendee
              </Link>
            </p>
            <p>
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

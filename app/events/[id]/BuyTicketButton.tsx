'use client'

import { useState } from 'react'
import { registerFreeTicket } from '@/lib/actions/tickets'

type Props = {
  eventId: string
  price: number | null
}

export default function BuyTicketButton({ eventId, price }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFree = !price || price === 0

  if (isFree) {
    return (
      <form action={registerFreeTicket}>
        <input type="hidden" name="event_id" value={eventId} />
        <button
          type="submit"
          className="w-full rounded-xl bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        >
          Free — Register
        </button>
      </form>
    )
  }

  async function handleBuy() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full rounded-xl bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Redirecting to checkout…' : `Buy Ticket — ${price} kr`}
      </button>
    </div>
  )
}

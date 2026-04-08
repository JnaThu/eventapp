'use client'

import { useActionState, useState } from 'react'
import { registerFreeTicket } from '@/lib/actions/tickets'

type Props = {
  eventId: string
  price: number | null
}

const errorClass =
  'rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400'

const btnClass =
  'w-full rounded-xl bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors'

export default function BuyTicketButton({ eventId, price }: Props) {
  // useActionState must be called unconditionally — used for the free path
  const [freeState, freeAction, freePending] = useActionState(registerFreeTicket, undefined)
  const [paidError, setPaidError] = useState<string | null>(null)
  const [paidLoading, setPaidLoading] = useState(false)

  const isFree = !price || price === 0

  if (isFree) {
    return (
      <div className="space-y-2">
        {freeState?.error && <p className={errorClass}>{freeState.error}</p>}
        <form action={freeAction}>
          <input type="hidden" name="event_id" value={eventId} />
          <button type="submit" disabled={freePending} className={btnClass}>
            {freePending ? 'Registering…' : 'Free — Register'}
          </button>
        </form>
      </div>
    )
  }

  async function handleBuy() {
    setPaidLoading(true)
    setPaidError(null)
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
        setPaidError(data.error ?? 'Something went wrong.')
        setPaidLoading(false)
      }
    } catch {
      setPaidError('Something went wrong. Please try again.')
      setPaidLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {paidError && <p className={errorClass}>{paidError}</p>}
      <button onClick={handleBuy} disabled={paidLoading} className={btnClass}>
        {paidLoading ? 'Redirecting to checkout…' : `Buy Ticket — ${price} kr`}
      </button>
    </div>
  )
}

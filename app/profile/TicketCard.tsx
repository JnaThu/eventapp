'use client'

import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

type Props = {
  ticket: {
    id: string
    event_id: string
    attendee_id: string
    status: string
    events: {
      id: string
      title: string
      date: string
      location: string
      price: number | null
    }
  }
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

export default function TicketCard({ ticket }: Props) {
  const { events: event } = ticket
  const qrValue = `TICKET-${ticket.id}-${ticket.event_id}-${ticket.attendee_id}`

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Event details */}
        <div className="flex-1 p-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/events/${event.id}`}
              className="text-base font-semibold text-zinc-900 dark:text-zinc-50 hover:underline leading-snug"
            >
              {event.title}
            </Link>
            <span className="shrink-0 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              Confirmed
            </span>
          </div>

          <div className="space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
            <p>{formatDate(event.date)} at {formatTime(event.date)}</p>
            <p>{event.location}</p>
          </div>

          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {formatPrice(event.price)}
          </p>
        </div>

        {/* QR code */}
        <div className="flex items-center justify-center border-t sm:border-t-0 sm:border-l border-dashed border-zinc-200 dark:border-zinc-700 p-6">
          <div className="rounded-xl bg-white p-2">
            <QRCodeSVG value={qrValue} size={96} />
          </div>
        </div>
      </div>
    </div>
  )
}

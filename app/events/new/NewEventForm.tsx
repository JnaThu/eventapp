'use client'

import { useActionState, useState } from 'react'
import { createEvent } from '@/lib/actions/events'

const DANCE_STYLES = [
  'Salsa',
  'Bachata',
  'Kizomba',
  'West Coast Swing',
  'Lindy Hop',
  'Tango',
  'Contemporary',
  'Other',
]

const inputClass =
  'w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed'

const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'

export default function NewEventForm() {
  const [state, action, pending] = useActionState(createEvent, undefined)
  const [isFree, setIsFree] = useState(false)
  const [price, setPrice] = useState('0')

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {state.error}
        </p>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Saturday Salsa Social"
          className={inputClass}
        />
      </div>

      {/* Dance style */}
      <div>
        <label htmlFor="dance_style" className={labelClass}>
          Dance style
        </label>
        <select
          id="dance_style"
          name="dance_style"
          required
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>
            Select a style…
          </option>
          {DANCE_STYLES.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input id="date" name="date" type="date" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="time" className={labelClass}>
            Time
          </label>
          <input id="time" name="time" type="time" required className={inputClass} />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className={labelClass}>
          Location / venue name
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          placeholder="e.g. Dansestudio Bergen, Strandgaten 12"
          className={inputClass}
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className={labelClass}>
          Price (kr)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          disabled={isFree}
          value={isFree ? '0' : price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
          <input
            type="checkbox"
            name="is_free"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="rounded border-zinc-300 dark:border-zinc-600"
          />
          Free event
        </label>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Tell people what to expect…"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
      >
        {pending ? 'Posting event…' : 'Post event'}
      </button>
    </form>
  )
}

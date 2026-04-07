import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold text-zinc-900 dark:text-zinc-50 hover:opacity-75 transition-opacity"
        >
          Danseapp Bergen
        </Link>
        <Link
          href="/sign-in"
          className="rounded-full border border-zinc-300 dark:border-zinc-600 px-4 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        >
          Logg inn
        </Link>
      </div>
    </nav>
  )
}

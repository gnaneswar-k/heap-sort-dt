'use client' // Error components must be Client Components.

import { useEffect } from 'react'
import '../../globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service.
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <header
          id='headerBlock'
          className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600  shadow-lg'}
        >
          <span className={"px-4 font-sans text-2xl font-bold text-slate-50 col-span-4 justify-self-center"}>
            Driving Test - Heap Sort
          </span>
        </header>
        <div className={inter.className + " h-screen overflow-hidden flex flex-col justify-center items-center bg-slate-50 space-y-8"}>
          <span className={"px-4 font-sans text-3xl font-bold text-gray-950 col-span-4 justify-self-center"}>
            Something went wrong while loading the experiment.
          </span>
          <button
            type="button"
            className={"flex m-2 p-3 justify-center items-center rounded-md shadow-md bg-amber-300"}
            onClick={
              // Attempt to recover by trying to re-render the segment.
              () => reset()
            }
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}

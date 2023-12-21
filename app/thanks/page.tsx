"use client" // Client-side Component to allow for store changes and routing.

import Layout from '../layout'
import ActionButton from '../_components/_buttons/actionButton'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/lib/hooks'
import { updateUserId } from '@/lib/features/userData/userDataSlice'

export default function Home() {
  // Router for navigation between pages.
  const router = useRouter()

  // Function to update the userId.
  const dispatch = useAppDispatch();
  const handleUpdateUserId = (id: string) => {
    dispatch(updateUserId(id))
  }

  // Function to reset userId and return to homepage.
  function handleHome() {
    handleUpdateUserId("")
    router.push('/')
  }

  return (
    <Layout >
      <header
        id='headerBlock'
        className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600  shadow-lg'}
      >
        <div className={"px-4 font-sans text-2xl font-bold text-slate-50 col-span-4 justify-self-center"}>
          Driving Test - Heap Sort Algorithm
        </div>
      </header>
      <div className="flex flex-grow justify-center items-center overflow-y-auto">
        <div className="container flex-grow flex flex-col justify-around p-10 text-gray-900 px-24 h-1/4">
          <div className='flex text-3xl justify-center font-semibold'>
            Thank you for your participation.
          </div>
          <div className='flex justify-center items-center'>
            <ActionButton handler={handleHome}>Return to Homepage</ActionButton>
          </div>
        </div>
      </div>
    </Layout>
  )
}

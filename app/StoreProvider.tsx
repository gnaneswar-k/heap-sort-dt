"use client" // Client-side Component to allow for store.

import { Provider } from 'react-redux'
import { userIdStore } from '../lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={userIdStore}>
      {children}
    </Provider>
  )
}

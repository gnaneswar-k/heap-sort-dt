import { configureStore } from "@reduxjs/toolkit"
import userDataReducer from './features/userData/userDataSlice'

export const userIdStore = configureStore({
  reducer: {
    userData: userDataReducer
  },
  devTools: true
})

// Infer the type of userIdStore.
export type AppStore = typeof userIdStore
// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
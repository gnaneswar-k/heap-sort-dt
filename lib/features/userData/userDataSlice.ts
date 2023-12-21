import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// Heap Sort State Interface.
export interface HeapSortState {
  array: number[],
  index: number,
  heapData: number[],
  node: number | null,
}

// Define a type for the slice state
export interface UserDataState {
  userId: string,
  runId: string,
  heapState: HeapSortState
}

// Define the initial state using that type
const initialState: UserDataState = {
  userId: "",
  runId: "",
  heapState: {} as HeapSortState
}

export const userDataSlice = createSlice({
  name: 'userData',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    // Update the userId
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    // Update the runId
    updateRunId: (state, action: PayloadAction<string>) => {
      state.runId = action.payload
    },
    // Update the heapArray
    updateHeapState: (state, action: PayloadAction<HeapSortState>) => {
      state.heapState = action.payload
    }
  }
})

export const { updateUserId, updateRunId, updateHeapState } = userDataSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUserId = (state: RootState) => state.userData.userId
export const selectRunId = (state: RootState) => state.userData.runId
export const selectHeapState = (state: RootState) => state.userData.heapState

export default userDataSlice.reducer

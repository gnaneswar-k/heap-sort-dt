"use client" // Client-side Component to allow for state changes and routing.

import Layout from "@/app/layout"
import Instructions from "./instructions"
import ActionButton from "@/app/_components/_buttons/actionButton"
import CreateTree from "@/app/_components/_functions/createTree"
import CreateArray from "@/app/_components/_functions/createArray"
import { useEffect, useState } from "react"
import API from "@/app/api"
import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { selectHeapState, selectRunId, selectUserId } from "@/lib/features/userData/userDataSlice"

// Heap Sort State Interface.
interface SortingState {
  finalArray: number[],
  heapData: number[],
  node: number | null,
}

// API Function Calls

/**
 * API call to update the Run parameters.
 * @param payload Payload for the API.
 * @param runId The runId of the current run.
 * @param type The action performed.
 * @param preState The state before the action.
 * @param postState The state after the action.
 */
const updateRun = async (
  payload: any,
  runId: string,
  type: string,
  preState: SortingState,
  postState: SortingState
) => {
  // If runId is undefined, then the user has not been initialised.
  if (runId === "") {
    return
  }
  // Log the current state into the browser console.
  console.log(JSON.stringify({
    id: runId,
    payload: payload === undefined ? {} : payload,
    type: type,
    preState: preState === undefined ? {} : preState,
    postState: postState === undefined ? {} : postState,
    timestamp: Date.now()
  }))
  // If API Gateway is defined.
  if (API.getUri() !== undefined) {
    // API call.
    await API
      .post(
        `/updateRun`, JSON.stringify({
          id: runId,
          payload: payload === undefined ? {} : payload,
          type: type,
          preState: preState === undefined ? {} : preState,
          postState: postState === undefined ? {} : postState,
          timestamp: Date.now()
        })
      )
      .then(response => {
        console.log(response)
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }
}

/**
 * API call to update that the run is completed.
 * @param id The userId of the user of the current run.
 * @param setCompleted Function to set the status to completed.
 */
const complete = async (id: string, setCompleted: React.Dispatch<React.SetStateAction<boolean>>) => {
  let endpoint = `/complete/` + id
  // If API Gateway is defined.
  if (API.getUri() !== undefined) {
    // API call.
    await API
      .get(endpoint)
      .then(response => {
        console.log(response)
        console.log(response.data)
        setCompleted(true)
        // window.alert("Thank you for your participation.")
      })
      .catch(error => {
        console.log(error)
      })
  }
  else { setCompleted(true) }
}

// List of Actions
const Action = Object.freeze({
  Init: 'InitSort',
  Undo: 'Undo',
  Redo: 'Redo',
  Reset: 'Reset',
  Submit: 'Submit',
  CancelSubmit: 'CancelSubmit',
  ConfirmSubmit: 'ConfirmSubmit',
  SwapRootAndEnd: 'SwapRootAndEnd',
  PushEndAndDelete: 'PushEndAndDelete',
  Heapify: 'Heapify'
})

// List of Prompts
const Prompts = Object.freeze({
  Init: "Experiment Initialised.",
  Undo: "Undo successful.",
  Redo: "Redo successful.",
  Reset: "Experiment reset to initial state.",
  Submit: "Confirm submission?",
  CancelSubmit: "Submission cancelled.",
  ConfirmSubmit: "Submission confirmed!",
  SwapRootAndEnd: "Root node swapped with the end node.",
  SwapRootAndEndFail: "Could not swap root node with end node.",
  PushEndAndDelete: "End node added to final array and removed from heap.",
  PushEndAndDeleteFail: "Failed to add end node to final array and delete from heap.",
  Heapify: "Performed heapify on the heap.",
  HeapifyFail: "Failed to perform heapify.",
})

/**
 * Function that creates an instance of a Heap Sort State.
 * @param finalArray Array of numbers.
 * @param heapData Array of elements in heap.
 * @param node Index of selected node in heapData.
 * @returns SortingState instance.
 */
function createState(finalArray: number[], heapData: number[], node: number): SortingState {
  let state: SortingState = {} as SortingState

  state.finalArray = finalArray
  state.heapData = heapData
  state.node = node

  return state
}

/**
 * Function to perform heapify on a heap.
 * @param array Array containing heap data.
 * @returns Heapified array.
 */
function heapify(array: number[]) {
  let oldArray: number[] = array.slice(), newArray: number[] = array.slice()
  let index = 0
  while (index < array.length) {
    const left = 2 * index + 1, right = 2 * index + 2
    newArray = oldArray.slice()
    // If greater than left child.
    if (left < array.length && oldArray[index] > oldArray[left] && (array.length === 2 || oldArray[left] < oldArray[right])) {
      newArray[left] = oldArray[index]
      newArray[index] = oldArray[left]
      oldArray = newArray.slice()
      index = left
    }
    // If greater than right child.
    else if (right < array.length && oldArray[index] > oldArray[right]) {
      newArray[right] = oldArray[index]
      newArray[index] = oldArray[right]
      oldArray = newArray.slice()
      index = right
    }
    // If not greater than child nodes or index is a leaf node.
    else { break }
  }
  // Return heap after performing heapify.
  return newArray
}

/**
 * Function to update the array containing list of previous states.
 * @param pastStates Array with list of previous states.
 * @param state State to be added.
 * @returns Updated past states array.
 */
function handlePastStateUpdate(pastStates: SortingState[], state: SortingState) {
  let newPastStateArray = pastStates.slice()
  newPastStateArray.push({ ...state })
  return newPastStateArray
}

/**
 * Function to update the array containing list of future states.
 * @param futureStates Array with list of future states.
 * @param state State to be added.
 * @returns Updated future states array.
 */
function handleFutureStateUpdate(futureStates: SortingState[], state: SortingState) {
  let newFutureStateArray = futureStates.slice()
  newFutureStateArray.unshift({ ...state })
  return newFutureStateArray
}

// const initialState: SortingState = {
//   finalArray: [],
//   heapData: [0, 89, 567, 1234],
//   node: 0
// }

// const prompt = "Experiment Initialised."

export default function Experiment() {
  // Router for navigation between pages.
  const router = useRouter()
  // Final state in heapify part of experiment.
  const heapifyState = useAppSelector(selectHeapState)
  // Initial State for Sort Experiment.
  const initialState: SortingState = {
    finalArray: [],
    heapData: heapifyState.heapData,
    node: heapifyState.node === null || heapifyState.heapData.length === 0 ? null : 0
  }
  // Initialisation.
  const userId = useAppSelector(selectUserId)
  const runId = useAppSelector(selectRunId)
  const [preState, setPreState] = useState<SortingState>({} as SortingState)
  const [state, setState] = useState<SortingState>(initialState)
  const [pastStates, setPastStates] = useState<SortingState[]>([])
  const [futureStates, setFutureStates] = useState<SortingState[]>([])
  const [type, setType] = useState<string>(Action.Init)
  const [prompt, setPrompt] = useState<string>(Prompts.Init)
  const [completed, setCompleted] = useState<boolean>(false)

  // Handlers.
  function handleSwapRootAndEnd() {
    if (state.heapData.length > 0) {
      let newHeapData = state.heapData.slice()
      newHeapData[0] = state.heapData[state.heapData.length - 1]
      newHeapData[newHeapData.length - 1] = state.heapData[0]
      setPreState({ ...state })
      setPastStates(handlePastStateUpdate(pastStates, state))
      setFutureStates([])
      setState(createState(state.finalArray, newHeapData, newHeapData.length - 1))
      setType(Action.SwapRootAndEnd)
      setPrompt(Prompts.SwapRootAndEnd)
    }
    else { setPrompt(Prompts.SwapRootAndEndFail) }
  }

  function handlePushEndAndDelete() {
    if (state.heapData.length > 0) {
      let newFinalArray = state.finalArray.slice()
      newFinalArray.push(state.heapData[state.heapData.length - 1])
      let newHeapData = state.heapData.slice()
      newHeapData.pop()
      setPreState({ ...state })
      setPastStates(handlePastStateUpdate(pastStates, state))
      setFutureStates([])
      setState(createState(newFinalArray, newHeapData, 0))
      setType(Action.PushEndAndDelete)
      setPrompt(Prompts.PushEndAndDelete)
    }
    else { setPrompt(Prompts.PushEndAndDeleteFail) }
  }

  function handleHeapify() {
    if (state.heapData.length > 0) {
      setPreState({ ...state })
      setPastStates(handlePastStateUpdate(pastStates, state))
      setFutureStates([])
      setState(createState(state.finalArray, heapify(state.heapData), 0))
      setType(Action.Heapify)
      setPrompt(Prompts.Heapify)
    }
    else { setPrompt(Prompts.HeapifyFail) }
  }

  function handleUndo() {
    let newPastStates = pastStates.slice()
    newPastStates.pop()
    setPreState({ ...state })
    setPastStates(newPastStates)
    setFutureStates(handleFutureStateUpdate(futureStates, state))
    setState(pastStates[pastStates.length - 1])
    setType(Action.Undo)
    setPrompt(Prompts.Undo)
  }

  function handleRedo() {
    let newFutureStates = futureStates.slice()
    newFutureStates.shift()
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates(newFutureStates)
    setState(futureStates[0])
    setType(Action.Redo)
    setPrompt(Prompts.Redo)
  }

  function handleReset() {
    setPreState({ ...state })
    setPastStates([])
    setFutureStates([])
    setState(initialState)
    setType(Action.Reset)
    setPrompt(Prompts.Reset)
  }

  function handleSubmit() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(state)
    setType(Action.Submit)
    setPrompt(Prompts.Submit)
  }

  function handleConfirmSubmit() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState({ ...state })
    setType(Action.ConfirmSubmit)
    setPrompt(Prompts.ConfirmSubmit)
    if (runId !== "") { complete(runId, setCompleted) }
  }

  function handleCancelSubmit() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState({ ...state })
    setType(Action.CancelSubmit)
    setPrompt(Prompts.CancelSubmit)
  }

  // Log actions.
  // console.log(createTreeData(state.heapData, 0))
  useEffect(() => {
    // Log the userID
    // console.log(userId)
    // Log run actions.
    if (runId !== "") {
      updateRun({}, runId, type, preState, state)
    }
    // Redirect upon completion.
    if (completed) {
      router.push('/thanks')
    }
  }, [router, userId, runId, type, preState, state, completed])

  return (
    <Layout >
      {/* Header */}
      <header
        id='headerBlock'
        className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-blue-600 from-25% to-sky-600  shadow-lg'}
      >
        <span className={"px-4 font-sans text-2xl font-bold text-slate-50 col-span-3 justify-self-start"}>
          Driving Test - Heap Sort
        </span>
        <div className='col-span-1 flex justify-center items-center'>
          {/* Submit Button */}
          <button
            type='button'
            className='transition ease-out hover:scale-110 hover:duration-400
                px-2 py-1 border-2 border-white/75 hover:border-white hover:bg-slate-50/10 rounded-full
                text-xl font-semibold text-slate-50'
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      </header>
      {/* Experiment */}
      <div className="flex-grow flex overflow-hidden">
        {/* Information */}
        <div className="w-1/3 overflow-y-auto shadow-md p-6 text-lg">
          <Instructions />
        </div>
        {/* Activity */}
        <div className="w-full text-lg overflow-x-auto">
          <div className="relative h-full w-full">
            {/* Submit Window */}
            <div
              className={"absolute z-10 justify-center items-center align-middle flex flex-col w-full h-full "
                + (type == Action.Submit ? "backdrop-blur-md" : "hidden")}
            >
              <div className="flex flex-col justify-center items-center align-middle bg-slate-50 text-lg w-1/3 h-1/3 shadow-lg p-2 rounded-md border-black border-2">
                <span className="flex text-center">Comfirm Submission?</span>
                <div className="flex flex-row justify-between p-2">
                  <ActionButton
                    id="confirm"
                    type="primary"
                    handler={() => handleConfirmSubmit()}
                  >
                    Confirm
                  </ActionButton>
                  <ActionButton
                    id="cancel"
                    type="secondary"
                    handler={() => handleCancelSubmit()}
                  >
                    Cancel
                  </ActionButton>
                </div>
              </div>
            </div>
            {/* Controls */}
            <div className={"flex flex-col justify-evenly items-center w-full h-full "}>
              {/* Prompt */}
              <div className="w-full">
                <div
                  className={"text-center m-4 p-2 rounded-md border-2 "
                    + ((prompt === Prompts.HeapifyFail || prompt === Prompts.SwapRootAndEndFail)
                      ? "bg-red-300 border-red-400"
                      : (prompt === Prompts.SwapRootAndEnd || prompt === Prompts.Heapify || prompt === Prompts.PushEndAndDelete || prompt === Prompts.ConfirmSubmit)
                        ? "bg-green-300 border-green-400"
                        : "bg-blue-300 border-blue-400"
                    )
                  }
                >
                  {prompt}
                </div>
              </div>
              {/* Variables */}
              <div className="flex flex-col w-full items-center justify-between h-1/2 space-y-4">
                {/* Node selected in the heap */}
                <div className="flex text-center p-1 text-purple-600">
                  Selected Node = {
                    state.node === null
                      ? "None"
                      : state.node === 0
                        ? "Root"
                        : state.node === state.heapData.length - 1
                          ? "End"
                          : state.heapData[state.node].toString()
                  }
                </div>
                {/* Heap Tree */}
                {state.heapData.length ? <CreateTree array={state.heapData} selected={state.heapData.length === 0 ? null : state.node} /> : null}
                {/* Sorted Array */}
                {state.finalArray.length ? <CreateArray array={state.finalArray} /> : null}
              </div>
              {/* Buttons */}
              <div className="flex flex-col items-center space-y-2 p-2">
                {/* Specific Actions */}
                <div className="flex justify-between">
                  <ActionButton
                    id="inc"
                    type="primary"
                    disabled={state.heapData.length < 1}
                    handler={() => handleSwapRootAndEnd()}
                  >
                    Swap Root Node and End Node
                  </ActionButton>
                  <ActionButton
                    id="update"
                    type="primary"
                    disabled={state.heapData.length < 1}
                    handler={() => handlePushEndAndDelete()}
                  >
                    Add End Node to Array and Delete from Heap
                  </ActionButton>
                  <ActionButton
                    id="swap"
                    type="primary"
                    disabled={state.heapData.length < 1}
                    handler={() => handleHeapify()}
                  >
                    Heapify
                  </ActionButton>
                </div>
                {/* Generic Actions */}
                <div className="flex justify-between">
                  <ActionButton
                    id="undo"
                    type="secondary"
                    disabled={pastStates.length === 0}
                    handler={() => handleUndo()}
                  >
                    Undo
                  </ActionButton>
                  <ActionButton
                    id="redo"
                    type="secondary"
                    disabled={futureStates.length === 0}
                    handler={() => handleRedo()}
                  >
                    Redo
                  </ActionButton>
                  <ActionButton
                    id="reset"
                    type="secondary"
                    handler={() => handleReset()}
                  >
                    Reset
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center p-2 border-black border-t-2">Copyright &copy; 2023 Algodynamics.</div>
    </Layout >
  )
}

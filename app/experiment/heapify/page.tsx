"use client" // Client-side Component to allow for state changes and routing.

import Layout from "@/app/layout"
import Instructions from "./instructions"
import ActionButton from "@/app/_components/_buttons/actionButton"
import CreateTree from "@/app/_components/_functions/createTree"
import CreateArray from "@/app/_components/_functions/createArray"
import { useEffect, useState } from "react"
import API from "@/app/api"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { HeapSortState, selectUserId, updateHeapArray, updateRunId } from "@/lib/features/userData/userDataSlice"

// API Function Calls

/**
 * API call to create a run for a userId and set the runId.
 * @param userId The userId of the user.
 * @param setRunId Function to set the runId.
 */
const createRun = async (userId: string, setRunId: React.Dispatch<React.SetStateAction<string>>) => {
  console.log("Creating runId.")
  // If API Gateway is defined.
  if (API.getUri() !== undefined) {
    // API call.
    await API
      .post(
        `/createRun`, JSON.stringify({
          id: userId,
          machineId: "heapSort",
        })
      )
      .then((response: any) => {
        // Set the runId.
        setRunId(response.data.id)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }
  // If testing.
  else { setRunId("testRunID") }
}

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
  preState: HeapSortState,
  postState: HeapSortState
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

// List of Actions
const Action = Object.freeze({
  Init: 'InitHeapify',
  Undo: 'Undo',
  Redo: 'Redo',
  Reset: 'Reset',
  Continue: 'Continue',
  CancelContinue: 'CancelContinue',
  ConfirmContinue: 'ConfirmContinue',
  IncrementIndex: 'IncrementIndex',
  AddNode: 'AddNode',
  SwapWithParent: 'SwapWithParent',
})

// List of Prompts
const Prompts = Object.freeze({
  Init: "Experiment Initialised.",
  Undo: "Undo successful.",
  Redo: "Redo successful.",
  Reset: "Experiment reset to initial state.",
  Continue: "Continue to next part of the experiment?",
  CancelContinue: "",
  ConfirmContinue: "Moving to next part of the experiment!",
  IncrementIndex: "Value of 'index' increased by 1.",
  IncrementIndexFail: "Value of 'index' cannot be increased anymore.",
  AddNode: "Element added to heap.",
  SwapWithParent: "Swapped child node with parent node.",
  SwapWithParentFail: "Child node could not be swapped with parent node.",
})

/**
 * Function that creates an instance of a Heap Sort State.
 * @param array Array of numbers.
 * @param index Current index.
 * @param heapData Array of elements in heap.
 * @param node Index of selected node in heapData.
 * @returns HeapSortState instance
 */
function createState(array: number[], index: number, heapData: number[], node: number | null): HeapSortState {
  let state: HeapSortState = {} as HeapSortState

  state.array = array
  state.index = index
  state.heapData = heapData
  state.node = node

  return state
}

const arrayLength = 6

/**
 * Function to create a random array without duplicates.
 * @returns Array containing arrayLength numbers.
 */
function createRandomArray() {
  let array: number[] = []
  let count = arrayLength

  while (count > 0) {
    const number = Math.round(Math.random() * 10)
    let noDuplicates = true

    // Checking for duplicates.
    for (let index = 0; index < array.length && noDuplicates; index++) {
      if (array[index] === number)
        noDuplicates = false
    }

    // If no duplicates are present.
    if (noDuplicates) {
      array.push(number)
      count -= 1
    }
  }

  return array
}

/**
 * Function to update the array containing list of previous states.
 * @param pastStates Array with list of previous states.
 * @param state State to be added.
 * @returns Updated past states array.
 */
function handlePastStateUpdate(pastStates: HeapSortState[], state: HeapSortState) {
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
function handleFutureStateUpdate(futureStates: HeapSortState[], state: HeapSortState) {
  let newFutureStateArray = futureStates.slice()
  newFutureStateArray.unshift({ ...state })
  return newFutureStateArray
}

// const initialState: HeapSortState = {
//   array: [1234, 567, 89, 0],
//   index: 0,
//   heapData: [],
//   node: null
// }

// const prompt = "Experiment Initialised."

const initialArray = createRandomArray()
const initialState = createState(initialArray, 0, [], null)

export default function Experiment() {
  // Router for navigation between pages.
  const router = useRouter()
  // Store Reducer dispatcher.
  const dispatch = useAppDispatch()
  // Initialisation.
  const userId = useAppSelector(selectUserId)
  const [runId, setRunId] = useState<string>("")
  const [preState, setPreState] = useState<HeapSortState>({} as HeapSortState)
  const [state, setState] = useState<HeapSortState>(initialState)
  const [pastStates, setPastStates] = useState<HeapSortState[]>([])
  const [futureStates, setFutureStates] = useState<HeapSortState[]>([])
  const [type, setType] = useState<string>(Action.Init)
  const [prompt, setPrompt] = useState<string>(Prompts.Init)
  const [completed, setCompleted] = useState<boolean>(false)

  // Handlers.
  function handleIncrementIndex() {
    if (state.index < arrayLength - 1) {
      setPreState({ ...state })
      setPastStates(handlePastStateUpdate(pastStates, state))
      setFutureStates([])
      setState(createState(state.array, state.index + 1, state.heapData, null))
      setType(Action.IncrementIndex)
      setPrompt(Prompts.IncrementIndex)
    }
    else { setPrompt(Prompts.IncrementIndexFail) }
  }

  function handleAddNode() {
    let newHeapData = state.heapData.slice()
    newHeapData.push(state.array[state.index])
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(createState(state.array, state.index, newHeapData, newHeapData.length - 1))
    setType(Action.AddNode)
    setPrompt(Prompts.AddNode)
  }

  function handleSwapWithParent() {
    if (state.node !== null && Math.floor((state.node - 1) / 2) >= 0) {
      let parentNode = Math.floor((state.node - 1) / 2)
      let newHeapData = state.heapData.slice()
      newHeapData[state.node] = state.heapData[parentNode]
      newHeapData[parentNode] = state.heapData[state.node]
      setPreState({ ...state })
      setPastStates(handlePastStateUpdate(pastStates, state))
      setFutureStates([])
      setState(createState(state.array, state.index, newHeapData, parentNode))
      setType(Action.SwapWithParent)
      setPrompt(Prompts.SwapWithParent)
    }
    else { setPrompt(Prompts.SwapWithParentFail) }
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

  function handleContinue() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(state)
    setType(Action.Continue)
    setPrompt(Prompts.Continue)
  }

  function handleConfirmContinue() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(createState(state.array, state.index, state.heapData, 0))
    setType(Action.ConfirmContinue)
    setPrompt(Prompts.ConfirmContinue)
    setCompleted(true)
  }

  function handleCancelContinue() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState({ ...state })
    setType(Action.CancelContinue)
    setPrompt(Prompts.CancelContinue)
  }

  // Log actions.
  // console.log(createTreeData(state.heapData, 0))
  useEffect(() => {
    // Log the userID
    // console.log(userId)
    // Generating Run ID
    if (userId !== "" && runId === "") {
      // console.log(userId)
      createRun(userId, setRunId)
    }
    // Log run actions.
    else if (runId !== "") {
      updateRun({}, runId, type, preState, state)
    }
    // Redirect upon completion.
    if (completed) {
      dispatch(updateHeapArray(state.heapData.slice()))
      dispatch(updateRunId(runId))
      router.push('/experiment/sort')
    }
  }, [router, userId, runId, type, preState, state, completed, dispatch])

  return (
    <Layout >
      {/* Header */}
      <header
        id='headerBlock'
        className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-blue-600 from-25% to-sky-600  shadow-lg'}
      >
        <span className={"px-4 font-sans text-2xl font-bold text-slate-50 col-span-3 justify-self-start"}>
          Driving Test - Heapify
        </span>
        <div className='col-span-1 flex justify-center items-center'>
          {/* Continue Button */}
          <button
            type='button'
            className='transition ease-out hover:scale-110 hover:duration-400
                px-2 py-1 border-2 border-white/75 hover:border-white hover:bg-slate-50/10 rounded-full
                text-xl font-semibold text-slate-50'
            onClick={() => handleContinue()}
          >
            Continue
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
            {/* Continue Window */}
            <div
              className={"absolute z-10 justify-center items-center align-middle flex flex-col w-full h-full "
                + (type == Action.Continue ? "backdrop-blur-md" : "hidden")}
            >
              <div className="flex flex-col justify-center items-center align-middle bg-slate-50 text-lg w-1/2 h-1/3 shadow-lg p-2 rounded-md border-black border-2">
                <span className="flex flex-col text-center">
                  Continue to next part of the experiment?
                  <br />
                  <strong>&nbsp;You cannot return back to this part of the experiment upon confirmation.</strong>
                  <em>To retry, you will have to start the experiment again.</em>
                </span>
                <div className="flex flex-row justify-between p-2">
                  <ActionButton
                    id="confirm"
                    type="primary"
                    handler={() => handleConfirmContinue()}
                  >
                    Confirm
                  </ActionButton>
                  <ActionButton
                    id="cancel"
                    type="secondary"
                    handler={() => handleCancelContinue()}
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
                    + ((prompt === Prompts.SwapWithParentFail || prompt === Prompts.IncrementIndexFail)
                      ? "bg-red-300 border-red-400"
                      : (prompt === Prompts.IncrementIndex || prompt === Prompts.SwapWithParent || prompt === Prompts.AddNode || prompt === Prompts.ConfirmContinue)
                        ? "bg-green-300 border-green-400"
                        : "bg-blue-300 border-blue-400"
                    )
                  }
                >
                  {prompt}
                </div>
              </div>
              {/* Variables */}
              <div className="flex flex-col w-full items-center justify-center h-3/4 space-y-4">
                {/* Current index of the array */}
                <div className="flex text-center p-1 text-amber-600">
                  Current Index: {state.index}
                </div>
                {/* Array */}
                <CreateArray array={state.array} selected={state.index} />
                {/* Node selected in the heap */}
                <div className="flex text-center p-1 text-purple-600">
                  Selected Node = {state.node === null || state.heapData.length === 0 ? "None" : state.heapData[state.node].toString()}
                </div>
                {/* Heap Tree */}
                {state.heapData.length ? <CreateTree array={state.heapData} selected={state.heapData.length === 0 ? null : state.node} /> : null}
              </div>
              {/* Buttons */}
              <div className="flex flex-col items-center space-y-2 p-2">
                {/* Specific Actions */}
                <div className="flex justify-between">
                  <ActionButton
                    id="inc"
                    type="primary"
                    disabled={state.index >= arrayLength - 1}
                    handler={() => handleIncrementIndex()}
                  >
                    Increment Index
                  </ActionButton>
                  <ActionButton
                    id="update"
                    type="primary"
                    handler={() => handleAddNode()}
                  >
                    Add Array Element as Node
                  </ActionButton>
                  <ActionButton
                    id="swap"
                    type="primary"
                    disabled={state.node === null || state.node < 1}
                    handler={() => handleSwapWithParent()}
                  >
                    Swap Selected Node with Parent
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

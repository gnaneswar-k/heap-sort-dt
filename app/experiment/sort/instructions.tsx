export default function Information() {
  return (
    <div className="flex-col space-y-4">
      <h1 className="text-center font-bold text-lg">Objective</h1>
      <p>
        Apply Heap Sort Algorithm using the provided controls on the min heap constructed in the previous part of the experiment to generate a sorted array.
        <br />
        <em>Please note that:</em>
      </p>
      <ol className="list-decimal ps-5">
        <li>You are not supposed to apply any optimizations over the original heap sort algorithm.</li>
        <li>Sorting of the array is the secondary objective; The primary objective is the correct application of the heap sort algorithm.</li>
      </ol>
      <div className="text-center m-1 flex-col justify-center space-y-2">
        <h1 className="font-bold text-lg">Variables Description</h1>
        <table className="w-full" id="variables-table">
          <thead>
            <tr>
              <th className="border-2 border-black">Variable</th>
              <th className="border-2 border-black">Data Type</th>
              <th className="border-2 border-black">Valid values</th>
              <th className="border-2 border-black">Initialization</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 border-black">Selected Node</td>
              <td className="border-2 border-black">str</td>
              <td className="border-2 border-black">&quot;Root&quot;, &quot;End&quot;</td>
              <td className="border-2 border-black">&quot;Root&quot;</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center m-1 flex-col justify-center space-y-2">
        <h1 className="font-bold text-lg">Controls Description</h1>
        <table className="w-full" id="variables-table">
          <thead>
            <tr>
              <th className="border-2 border-black">Control</th>
              <th className="border-2 border-black">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 border-black">Swap Root Node and End Node</td>
              <td className="border-2 border-black">Swaps the Root Node of the heap with its End Node</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className="border-2 border-black">Add End Node to Array and Delete from Heap</td>
              <td className="border-2 border-black">Add the End Node of the heap to the Final Array, and remove it from the heap</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className="border-2 border-black">Heapify</td>
              <td className="border-2 border-black">Perform heapify on the heap to construct a min heap</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="m-1 space-y-2">
        <h1 className="text-center font-bold text-lg">Procedure</h1>
        <ol className="list-decimal ps-5">
          <li>Click on suitable control to simulate next step of heap sort algorithm.</li>
          <li>You can <em>Undo</em> and <em>Redo</em> actions or <em>Reset</em> the experiment by clicking on the respective buttons as per your need.</li>
          <li>Click on the <em>Submit Run</em> button when you are done.</li>
        </ol>
      </div>
    </div>
  )
}

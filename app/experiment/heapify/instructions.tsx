export default function Information() {
  return (
    <div className="flex-col space-y-4">
      <h1 className="text-center font-bold text-lg">Objective</h1>
      <p>
        Apply Heapify Algorithm on the given array to construct a <strong>Min Heap</strong> using the provided controls.
        <br />
        <em>Please note that:</em>
      </p>
      <ol className="list-decimal ps-5">
        <li>You are not supposed to apply any optimizations over the original heapify algorithm.</li>
        <li>Constructing the heap is the secondary objective; The primary objective is the correct application of the heapify algorithm.</li>
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
              <td className="border-2 border-black">Current Index</td>
              <td className="border-2 border-black">int</td>
              <td className="border-2 border-black">[0,n)</td>
              <td className="border-2 border-black">0</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className="border-2 border-black">Selected Node</td>
              <td className="border-2 border-black">int, str</td>
              <td className="border-2 border-black">Natural Numbers, "None"</td>
              <td className="border-2 border-black">"None"</td>
            </tr>
          </tbody>
        </table>
        <p>where n is the length of the array.</p>
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
              <td className="border-2 border-black">Increment Index</td>
              <td className="border-2 border-black">Increments Index by 1, if Index &lt; n - 1</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className="border-2 border-black">Add Array Element as Node</td>
              <td className="border-2 border-black">Adds the array element at the current Index to the heap</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className="border-2 border-black">Swap Selected Node with Parent</td>
              <td className="border-2 border-black">Swaps the selected Node with its parent Node</td>
            </tr>
          </tbody>
        </table>
        <p>where n is the length of the array.</p>
      </div>
      <div className="m-1 space-y-2">
        <h1 className="text-center font-bold text-lg">Procedure</h1>
        <ol className="list-decimal ps-5">
          <li>Click on suitable control to simulate next step of heapify algorithm.</li>
          <li>You can <em>Undo</em> and <em>Redo</em> actions or <em>Reset</em> the experiment by clicking on the respective buttons as per your need.</li>
          <li>Click on the <em>Submit Run</em> button when you are done.</li>
        </ol>
      </div>
    </div>
  )
}

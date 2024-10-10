import { useState } from 'react';

export default function Set({ setId }) {
  const [isChecked, setIsChecked] = useState(false);
  const [focusedInput, setFocusedInput] = useState(''); // State to track which input is focused

  const handleSubmit = () => {
    setIsChecked(!isChecked);
    // Logic for sending set to db
  };

  return (
    <>
      <div className="flex justify-between space-x-8 items-center">
        {/* Weight Input */}
        <input
          type="text"
          placeholder="Weight"
          className="w-[50%] mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setFocusedInput('weight')} // Set state when weight input is focused
          onBlur={() => setFocusedInput('')} // Reset state when input loses focus
        />

        {/* Reps Input */}
        <input
          type="text"
          placeholder="Reps"
          className="w-[50%] mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setFocusedInput('reps')} // Set state when reps input is focused
          onBlur={() => setFocusedInput('')} // Reset state when input loses focus
        />

        {/* Custom Checkbox */}
        <button
          onClick={handleSubmit}
          className={`w-8 h-8 rounded-sm border-2 ${
            isChecked ? 'bg-green-500 border-blue-500' : 'border-gray-300'
          } flex items-center justify-center transition-all duration-300`}
        >
          {isChecked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Smooth Height Transition for Recommendations */}
      <div
        className={`relative w-full mt-4 overflow-hidden transition-max-height duration-500 ease-in-out ${
          focusedInput ? 'max-h-20' : 'max-h-0'
        }`}
      >

<div className="w-full h-7 overflow-hidden text-center">
  {/* Weight Recommendation */}
  <div
    className={`transition-opacity transition-transform duration-500 ease-in-out ${
      focusedInput === 'weight'
        ? 'opacity-100 translate-y-0'
        : focusedInput === 'reps' 
        ? 'opacity -translate-y-full'
        : 'opacity translate-y-full'
    }`}
  >
    Recommended weight: 100kg
  </div>

  {/* Reps Recommendation */}
  <div
    className={`transition-opacity transition-transform duration-500 ease-in-out ${
      focusedInput === 'reps'
        ? 'opacity-100 -translate-y-full'
        : focusedInput === 'weight'
        ? 'opacity translate-y-0'
        : 'opacity translate-y-full'
    }`}
  >
    Recommended reps: 10
  </div>
</div>


      </div>
    </>
  );
}
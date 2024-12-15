"use client";

import LoggedFood from "./LoggedFood";
import { useState, useCallback, useRef, useEffect } from "react";
import NewFood from "./NewFood";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/navigation";
import BarcodeScanner from "./BarcodeScanner";
import Image from "next/image";

const adjustDate = (currentDateId, increment = true) => {
  const day = parseInt(currentDateId.slice(0, 2), 10);
  const month = parseInt(currentDateId.slice(2, 4), 10) - 1;
  const year = parseInt(currentDateId.slice(4, 8), 10);

  const currentDate = new Date(year, month, day);
  currentDate.setDate(currentDate.getDate() + (increment ? 1 : -1));

  const newDay = String(currentDate.getDate()).padStart(2, "0");
  const newMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const newYear = currentDate.getFullYear();

  return `${newDay}${newMonth}${newYear}`;
};

const formatDateId = (dateId) => {
  const day = parseInt(dateId.slice(0, 2), 10);
  const month = parseInt(dateId.slice(2, 4), 10) - 1;
  const year = parseInt(dateId.slice(4, 8), 10);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return `${day} ${months[month]} ${year}`;
};

export default function DailyLog({ foods, dateId, dailyLogId }) {
  const [foodList, setFoodList] = useState(foods);
  const [newShown, setNewShown] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);

  // Error state for scanning and fetching
  const [scannerError, setScannerError] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  // States for amount and unit selection
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedUnit, setSelectedUnit] = useState("g");

  // Processing state to debounce detections
  const [isProcessing, setIsProcessing] = useState(false);
  const detectionTimeout = useRef(null);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleStopScanning = useCallback(() => {
    setShowScanner(false);
  }, []);

  const handleDetected = useCallback(async (barcode) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Clear any existing timeout
    if (detectionTimeout.current) {
      clearTimeout(detectionTimeout.current);
    }

    // Set a timeout to reset processing state
    detectionTimeout.current = setTimeout(() => {
      setIsProcessing(false);
    }, 2000); // 2 seconds

    // Check cache first
    /*const cachedData = localStorage.getItem(`food_${barcode}`);
    if (cachedData) {
      setScannedFood(JSON.parse(cachedData));
      setShowConfirmation(true);
      return;
    }*/

    // Proceed with fetching data
    setShowScanner(false);
    setFetchingData(true);
    setScannerError(null);

    try {
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your connection and try again.");
      }

      const response = await fetch(`/api/nutrition/log/scan/${dailyLogId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upc: barcode })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Could not find food item for scanned code.');
      }

      const data = await response.json();
      console.log(data);
      setScannedFood(data);
      setShowConfirmation(true);

      // Cache the data
      localStorage.setItem(`food_${barcode}`, JSON.stringify(data.data));
    } catch (error) {
      console.error(error);
      setScannerError(error.message || 'An error occurred while fetching food data.');
    } finally {
      setFetchingData(false);
    }
  }, [dailyLogId, isProcessing]);

  const handleScannerError = useCallback((error) => {
    console.error("Scanner error:", error);

    if (error.message && error.message.includes("No MultiFormat Readers were able to detect the code")) {
      // Non-critical error: no barcode detected in this frame
      // Do not close the scanner; optionally, show a temporary message or ignore
      return;
    } else if (error.name === 'NotAllowedError') {
      // Critical error: camera access denied
      setScannerError("Camera access was denied. Please allow camera access and try again.");
      setShowScanner(false);
    } else {
      // Other critical errors
      setScannerError(error.message || 'An error occurred during scanning initialization.');
      setShowScanner(false);
    }
  }, []);

  const addFood = async (food) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nutrition/log/${dailyLogId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food)
      });

      if (response.ok) {
        const newFood = await response.json();
        setFoodList((prev) => [...prev, newFood]);
      } else {
        const errorData = await response.json();
        console.error('Failed to add food:', errorData.error);
        // Optionally, display error to user
      }
    } catch (error) {
      console.error('Error adding food:', error);
      // Optionally, display error to user
    }
    setNewShown(false);
  };

  const handleShowNewFood = () => {
    setNewShown((prev) => !prev);
  };

  const handleChangeDate = (increment) => {
    const newDateId = adjustDate(dateId, increment);
    router.push(`/nutrition/log/${newDateId}`);
  };

  const handleConfirmAddScannedFood = () => {
    if (scannedFood) {
      // Add the food with the selected amount and unit
      addFood({
        ...scannedFood,
        quantity: selectedAmount,
        unit: selectedUnit,
      });

      setScannedFood(null);
      setShowConfirmation(false);
      setSelectedAmount(100);
      setSelectedUnit("g");
    }
  };

  const handleCancelAddScannedFood = () => {
    setScannedFood(null);
    setShowConfirmation(false);
    setSelectedAmount(100);
    setSelectedUnit("g");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionTimeout.current) {
        clearTimeout(detectionTimeout.current);
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-background p-4 pb-24 rounded-lg shadow-md">
      {/* Header with Date and Navigation */}
      <div className="flex justify-between items-center w-full mb-4">
        <button onClick={() => handleChangeDate(false)}>
          <ChevronLeftIcon className="h-6 w-6 text-primary-text" />
        </button>
        <h2 className="text-xl font-bold text-primary-text">{formatDateId(dateId)}</h2>
        <button onClick={() => handleChangeDate(true)}>
          <ChevronRightIcon className="h-6 w-6 text-primary-text" />
        </button>
      </div>

      {/* Food List */}
      {foodList?.length === 0 ? (
        <div className="text-center text-secondary-text py-4">
          No foods have been logged for this day.
        </div>
      ) : (
        <div className="space-y-4">
          {foodList?.map((food, index) => (
            <LoggedFood key={index} food={food} />
          ))}
        </div>
      )}

      {/* Add Food Buttons */}
      <div className="mt-6 w-full flex justify-center space-x-4">
        <button
          onClick={handleShowNewFood}
          className="bg-background text-primary-text border-2 rounded border-border py-2 px-4 transition-all duration-300"
        >
          Add Food Manually
        </button>
        <button
          onClick={() => {
            setScannerError(null);
            setShowScanner(true);
          }}
          className="bg-background text-primary-text border-2 rounded border-border py-2 px-4 transition-all duration-300"
        >
          Scan Barcode
        </button>
      </div>

      {/* New Food Modal */}
      <NewFood visible={newShown} addFood={addFood} onClose={handleShowNewFood} />

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary-text">Scan Barcode</h3>
              <button onClick={handleStopScanning} aria-label="Stop Scanning">
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Instructions */}
            <div className="text-center mb-4">
              <p className="text-primary-text">Align the barcode within the frame for best results.</p>
            </div>

            {scannerError && (
              <div className="text-red-500 mb-4">
                {scannerError}
                <div className="mt-2 flex justify-center space-x-2">
                  <button
                    onClick={() => { setScannerError(null); setShowScanner(true); }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Retry
                  </button>
                  <button
                    onClick={handleShowNewFood}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Add Food Manually
                  </button>
                </div>
              </div>
            )}

            {!scannerError && (
              <BarcodeScanner
                onDetected={handleDetected}
                onError={handleScannerError}
                onStop={handleStopScanning}
              />
            )}
          </div>
        </div>
      )}

      {/* Fetching Data Modal */}
      {fetchingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-sm text-center">
            <p className="text-primary-text font-semibold">Fetching food data...</p>
            <div className="mt-4">
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && scannedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 md:w-1/3">
            <h3 className="text-lg font-semibold text-primary-text mb-4">Add Scanned Food</h3>
            <div className="space-y-2">
              {scannedFood?.image &&
              <Image 
                src={scannedFood.image}
                alt={scannedFood.name}
                height={200}
                width={200}/> }
              <p><strong>Food Item:</strong> {scannedFood?.name}</p>
              <p><strong>Calories:</strong> {scannedFood.caloriesPerServe * selectedAmount / 100}</p>
              <p><strong>Carbohydrates:</strong> {scannedFood.carbohydratesPerServe * selectedAmount / 100}g</p>
              <p><strong>Protein:</strong> {scannedFood.proteinPerServe * selectedAmount / 100}g</p>
              <p><strong>Fat:</strong> {scannedFood.fatPerServe * selectedAmount / 100}g</p>
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-primary-text font-semibold">Amount:</label>
              <input
                type="number"
                min="1"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(parseInt(e.target.value, 10))}
                className="border border-border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-primary-text font-semibold">Unit:</label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="border border-border rounded px-2 py-1 w-full"
              >
                <option value="g">Grams (g)</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelAddScannedFood}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddScannedFood}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add to Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
"use client";

import LoggedFood from "./LoggedFood";
import { useState } from "react";
import NewFood from "./NewFood";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/navigation";
import BarcodeScanner from "./BarcodeScanner";

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

  // Loading states
  const [scannerInitializing, setScannerInitializing] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Error state for scanning and fetching
  const [scannerError, setScannerError] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const addFood = async (food) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nutrition/log/${dailyLogId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(food)
    });

    if (response.ok) {
      setFoodList((prev) => [...prev, food]);
    } else {
      console.error('Failed to add food');
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

  const handleBarcodeDetected = async (barcode) => {
    // Barcode detected, close scanner and start fetching data
    setShowScanner(false);
    setFetchingData(true);
    setScannerError(null);

    try {
      const response = await fetch(`/api/nutrition/log/scan/${dailyLogId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upc: barcode })
      });

      if (!response.ok) {
        throw new Error('Could not find food item for scanned code.');
      }

      const data = await response.json();
      setScannedFood(data.data);
      setShowConfirmation(true);
    } catch (error) {
      console.error(error);
      setScannerError(error.message || 'An error occurred while fetching food data.');
    } finally {
      setFetchingData(false);
    }
  };

  const handleScannerError = (error) => {
    setScannerError(error.message || 'An error occurred during scanning initialization.');
  };

  const handleConfirmAddScannedFood = () => {
    if (scannedFood) {
      // The scanned food item is assumed to be logged by the API endpoint
      setFoodList((prev) => [...prev, scannedFood]);
      setScannedFood(null);
      setShowConfirmation(false);
    }
  };

  const handleCancelAddScannedFood = () => {
    setScannedFood(null);
    setShowConfirmation(false);
  };

  const onLoadingChange = (loading) => {
    // This is triggered by BarcodeScanner to indicate camera initialization state
    setScannerInitializing(loading);
  };

  return (
    <div className="max-w-3xl mx-auto bg-background p-4 rounded-lg shadow-md">
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
              <button onClick={() => setShowScanner(false)}>
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {scannerError && (
              <div className="text-red-500 mb-4">
                {scannerError}
              </div>
            )}

            {scannerInitializing && (
              <div className="text-center mb-4">Initializing camera, please wait...</div>
            )}

            {!scannerError && (
              <BarcodeScanner
                onDetected={handleBarcodeDetected}
                onError={handleScannerError}
                onLoadingChange={onLoadingChange}
              />
            )}
          </div>
        </div>
      )}

      {/* Fetching Data Modal (after scan detected but before confirmation) */}
      {fetchingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-sm text-center">
            <p className="text-primary-text font-semibold">Fetching food data...</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && scannedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 md:w-1/3">
            <h3 className="text-lg font-semibold text-primary-text mb-4">Add Scanned Food</h3>
            <div className="space-y-2">
              <p><strong>Food Item:</strong> {scannedFood.name}</p>
              <p><strong>Calories:</strong> {scannedFood.caloriesPerServe}</p>
              <p><strong>Carbohydrates:</strong> {scannedFood.carbohydratesPerServe}g</p>
              <p><strong>Protein:</strong> {scannedFood.proteinPerServe}g</p>
              <p><strong>Fat:</strong> {scannedFood.fatPerServe}g</p>
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
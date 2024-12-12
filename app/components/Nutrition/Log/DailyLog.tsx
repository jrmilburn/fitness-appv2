"use client";

import LoggedFood from "./LoggedFood";
import { useState } from "react";
import NewFood from "./NewFood";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/navigation";
import BarcodeScanner from "./BarcodeScanner";

// Utility function to increment or decrement dateId
const adjustDate = (currentDateId, increment = true) => {
  const day = parseInt(currentDateId.slice(0, 2), 10);
  const month = parseInt(currentDateId.slice(2, 4), 10) - 1; // JavaScript months are 0-indexed
  const year = parseInt(currentDateId.slice(4, 8), 10);

  const currentDate = new Date(year, month, day);
  currentDate.setDate(currentDate.getDate() + (increment ? 1 : -1)); // Increment or decrement by 1 day

  const newDay = String(currentDate.getDate()).padStart(2, "0");
  const newMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const newYear = currentDate.getFullYear();

  return `${newDay}${newMonth}${newYear}`;
};

// Utility function to convert dateId to a formatted date
const formatDateId = (dateId) => {
  const day = parseInt(dateId.slice(0, 2), 10);
  const month = parseInt(dateId.slice(2, 4), 10) - 1; // JavaScript months are 0-indexed
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
  const [loading, setLoading] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter(); // For navigating between routes

  // Function to add food to the log
  const addFood = async (food) => {
    const newFood = {
      name: food.product_name,
      carbohydratesPerServe: food.nutriments.carbohydrates,
      proteinPerServe: food.nutriments.proteins,
      fatPerServe: food.nutriments.fat,
      caloriesPerServe: food.nutriments.energy,
      quantity: food.quantity || 1, // Default quantity
      unit: food.unit || 'serving',
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nutrition/log/${dailyLogId}`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(newFood)
    });

    if(response.ok) {
      setFoodList((prev) => [...prev, newFood]);
    } else {
      // Handle error if needed
      console.error('Failed to add food');
    }
    setNewShown(false);
  };

  // Toggle the NewFood modal
  const handleShowNewFood = () => {
    setNewShown((prev) => !prev);
  };

  // Handle date change
  const handleChangeDate = (increment) => {
    const newDateId = adjustDate(dateId, increment); // Calculate new dateId
    router.push(`/nutrition/log/${newDateId}`); // Navigate to the new date route
  };

  // Handle barcode detection
  const handleBarcodeDetected = async (barcode) => {
    setShowScanner(false);
    setLoading(true);
    setScannerError(null);

    try {
      // Fetch food data via API route to protect API keys
      const response = await fetch(`/api/nutrition/log/scan/${dailyLogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ upc: barcode })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch food data.');
      }

      const data = await response.json();
      setScannedFood(data);
      setShowConfirmation(true);
    } catch (error) {
      console.error(error);
      setScannerError(error.message || 'An error occurred while fetching food data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle scanner errors
  const handleScannerError = (error) => {
    setScannerError(error.message || 'An error occurred during scanning.');
    setShowScanner(false);
  };

  // Confirm adding scanned food
  const handleConfirmAddScannedFood = () => {
    if (scannedFood) {
      const foodToAdd = {
        product_name: scannedFood.item_name,
        nutriments: {
          carbohydrates: scannedFood.nf_total_carbohydrate || scannedFood.nf_carbohydrates,
          proteins: scannedFood.nf_protein || scannedFood.nf_proteins,
          fat: scannedFood.nf_total_fat || scannedFood.nf_fat,
          energy: scannedFood.nf_calories,
        },
        quantity: 1, // Default quantity, can be customized
        unit: 'serving', // Default unit, can be customized
      };
      addFood(foodToAdd);
      setScannedFood(null);
      setShowConfirmation(false);
    }
  };

  // Cancel adding scanned food
  const handleCancelAddScannedFood = () => {
    setScannedFood(null);
    setShowConfirmation(false);
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
          onClick={() => setShowScanner(true)}
          className="bg-background text-primary-text border-2 rounded border-border py-2 px-4 transition-all duration-300"
        >
          Scan Barcode
        </button>
      </div>

      {/* New Food Modal */}
      <NewFood visible={newShown} addFood={addFood} onClose={handleShowNewFood} />

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-11/12 md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary-text">Scan Barcode</h3>
              <button onClick={() => setShowScanner(false)}>
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BarcodeScanner onDetected={handleBarcodeDetected} onError={handleScannerError} />
            {loading && <p className="mt-4 text-center">Fetching food data...</p>}
            {scannerError && <p className="mt-4 text-center text-red-500">{scannerError}</p>}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && scannedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 md:w-1/3">
            <h3 className="text-lg font-semibold text-primary-text mb-4">Add Scanned Food</h3>
            <div className="space-y-2">
              <p><strong>Food Item:</strong> {scannedFood.item_name}</p>
              <p><strong>Calories:</strong> {scannedFood.nf_calories}</p>
              <p><strong>Carbohydrates:</strong> {scannedFood.nf_total_carbohydrate || scannedFood.nf_carbohydrates}g</p>
              <p><strong>Protein:</strong> {scannedFood.nf_protein || scannedFood.nf_proteins}g</p>
              <p><strong>Fat:</strong> {scannedFood.nf_total_fat || scannedFood.nf_fat}g</p>
              {/* Add more details as needed */}
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
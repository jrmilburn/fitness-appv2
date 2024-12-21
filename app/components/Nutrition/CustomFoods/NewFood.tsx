"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function NewFood({ onClose, show }) {
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [name, setName] = useState("");
  
  // For mounting the modal cleanly if using Next.js or SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!show) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const food = {
      name,
      carbohydrates,
      protein,
      fat,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/foods/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(food),
      }
    );

    if (response.ok) {
      // handle success if needed
    }

    onClose();
  };

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div
        className="relative z-50 w-full max-w-md mx-4 sm:mx-auto transform transition-all duration-300 ease-out
        scale-95 opacity-0 animate-fadeInUp"
      >
        <div className="rounded-md bg-white shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Food</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <h3 className="mt-4 text-sm font-medium text-gray-700">
                <em>Per 100g Serving</em>
              </h3>

              <label htmlFor="carbs" className="text-sm font-medium text-gray-700">
                Carbohydrates
              </label>
              <input
                type="number"
                id="carbs"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={carbohydrates}
                onChange={(e) => setCarbohydrates(Number(e.target.value))}
              />

              <label htmlFor="protein" className="text-sm font-medium text-gray-700">
                Protein
              </label>
              <input
                type="number"
                id="protein"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
              />

              <label htmlFor="fat" className="text-sm font-medium text-gray-700">
                Fat
              </label>
              <input
                type="number"
                id="fat"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // If using Next.js/SSR, you might need a portal to ensure modals mount correctly
  // Otherwise, you can just return `content`.
  return typeof window !== "undefined"
    ? createPortal(content, document.body)
    : null;
}

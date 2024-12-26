"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/outline";

export default function SearchItem({ product, addFood }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDropdown = () => {
    setIsExpanded((prev) => !prev);
  };

  const nutriments = product.nutriments || {};

  const handleSelectFood = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/foods/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.product_name,
          protein: nutriments.proteins_100g,
          fat: nutriments.fat_100g,
          carbohydrates: nutriments.carbohydrates_100g
        })
      });
  
      if (!response.ok) {
        console.error('Failed to create food:', response.statusText);
        return;
      }
  
      const data = await response.json();
  
      if (!data) {
        console.error('No data returned from the API');
        return;
      }
  
      addFood(data);
    } catch (error) {
      console.error('Error creating food:', error);
    }
  };

  return (
    <li
      key={product.code}
      className="p-4 bg-background-secondary hover:bg-background transition-all duration-300 border-2 border-border cursor-pointer shadow-sm flex flex-col space-y-4"
    >
      <div className="flex items-center justify-between space-x-4">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.product_name || "Food Item"}
            width={64}
            height={64}
            className="rounded-lg"
          />
        )}
        <div>
          <h3 className="text-lg font-bold">{product.product_name || "No Name"}</h3>
          {product.brands && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Brand: {product.brands}
            </p>
          )}
          {product.nutrition_grade_fr && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Nutrition Grade: {product.nutrition_grade_fr.toUpperCase()}
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
        <button onClick={handleSelectFood}>
          <PlusCircleIcon className="h-6 w-6 text-primary-text" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click events
            toggleDropdown();
          }}
          className="ml-auto p-2 text-primary-text"
        >
          <ChevronUpIcon
            className={`h-6 w-6 transition-transform duration-300 ${
              isExpanded ? "" : "rotate-180"
            }`}
          />
        </button>
        </div>
      </div>

      {/* Dropdown for additional details */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
        } overflow-hidden`}
      >
        <div className="bg-background p-4 rounded shadow-inner mt-2">
          <h4 className="text-md font-bold mb-2">Additional Information</h4>
          {product.ingredients_text ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-bold">Ingredients:</span> {product.ingredients_text}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Ingredients information not available.</p>
          )}

          <h4 className="text-md font-bold mt-4">Macronutrients</h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300">
            <li>
              <span className="font-bold">Carbohydrates:</span>{" "}
              {nutriments.carbohydrates_100g
                ? `${nutriments.carbohydrates_100g} g`
                : "Not available"}
            </li>
            <li>
              <span className="font-bold">Proteins:</span>{" "}
              {nutriments.proteins_100g
                ? `${nutriments.proteins_100g} g`
                : "Not available"}
            </li>
            <li>
              <span className="font-bold">Fats:</span>{" "}
              {nutriments.fat_100g
                ? `${nutriments.fat_100g} g`
                : "Not available"}
            </li>
            <li>
              <span className="font-bold">Energy:</span>{" "}
              {nutriments.energy_kcal_100g
                ? `${nutriments.energy_kcal_100g} kcal`
                : "Not available"}
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
}
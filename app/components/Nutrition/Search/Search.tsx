"use client";

import React, { useState } from "react";
import SearchItem from "./SearchItem";
import { PlusCircleIcon } from "@heroicons/react/outline";


const FoodSearch = ( { addFood, filter } ) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm) return;
  
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          searchTerm
        )}&search_simple=1&json=1&tagtype_0=origins&tag_contains_0=contains&tag_0=Australia`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch data from Open Food Facts API");
      }
  
      const data = await response.json();
      setResults(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-search max-w-3xl mx-auto p-6 bg-background rounded-lg dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Search for Food
      </h1>
      <div className="search-bar flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Enter food name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      <button
          className="inter-bold border-2 p-2 hover:bg-background-secondary rounded flex gap-2 text-primary-text"
          onClick={handleSearch}
        >
          Search <PlusCircleIcon className="h-6 w-6 text-primary-text" />
        </button>
      </div>

      {loading && (
        <p className="text-center text-blue-500 font-semibold">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      <div className="results">
        {results.length > 0 ? (
          <ul className="">
            {results.map((product) => (
              <SearchItem 
                key={product.id}
                product={product}
                addFood={addFood}/>
            ))}
          </ul>
        ) : (
          !loading && (
            <p className="text-center text-gray-500">No results found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default FoodSearch;
import { useState } from "react";

export default function Quantity({ foodItem, addFood, setStage }) {
    const [quantity, setQuantity] = useState(1); // Default quantity to 1
    const [unit, setUnit] = useState("grams"); // Default unit to grams
  
    const handleAdd = () => {
      const updatedFood = {
        ...foodItem,
        quantity,
        unit,
      };
  
      addFood(updatedFood); // Pass the updated food item back
      setStage(1);
    };
  
    return (
      <div className="bg-background p-4 rounded space-y-4">
        <h2 className="text-xl font-bold text-primary-text">{foodItem.product_name}</h2>
        <div className="space-y-2">
          <label className="text-primary-text font-semibold block">
            Quantity:
            <input
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              className="w-full p-2 border border-border rounded-lg bg-background-secondary text-primary-text focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            />
          </label>
          <label className="text-primary-text font-semibold block">
            Unit:
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-2 border border-border rounded-lg bg-background-secondary text-primary-text focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            >
              <option value="grams">Grams</option>
              <option value="servings">Servings</option>
              <option value="cups">Cups</option>
              <option value="pieces">Pieces</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-background text-primary-text border-border border-2 rounded py-2 px-4 transition-all duration-300"
        >
          Add Food
        </button>
      </div>
    );
  }
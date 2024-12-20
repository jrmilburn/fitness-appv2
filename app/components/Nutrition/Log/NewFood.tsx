import Search from "@/app/components/Nutrition/Search/Search";
import Quantity from "./Quantity";
import { useState, useEffect } from "react";

export default function NewFood({ visible, addFood, onClose }) {
  const [stage, setStage] = useState(1);
  const [foodItem, setFoodItem] = useState(null);

  useEffect(() => {
    console.log(foodItem);
  }, [foodItem]);

  return (
    <>
      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <div className="bg-background max-w-[400px] max-h-[60%] h-[60%] overflow-y-auto absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] rounded-lg">
            <button className="absolute top-0 right-0" onClick={onClose}>
              X
            </button>
            {stage === 1 ? (
              <Search
                addFood={(selectedFood) => {
                  setFoodItem(selectedFood);
                  setStage(2);
                }}
              />
            ) : (
              <Quantity 
                foodItem={foodItem} 
                addFood={addFood}
                setStage={setStage} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
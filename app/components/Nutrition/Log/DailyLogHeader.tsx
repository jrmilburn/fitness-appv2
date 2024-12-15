// DailyLogHeader.jsx
import React from 'react';

const DailyLogHeader = ({ foods }) => {

    console.log(foods);

    const totals = foods.reduce(
        (accumulator, currentFood) => {
          accumulator.totalCalories += currentFood.caloriesPerServe;
          accumulator.totalProtein += currentFood.proteinPerServe;
          accumulator.totalCarbs += currentFood.carbohydratesPerServe;
          accumulator.totalFats += currentFood.fatPerServe;
          return accumulator;
        },
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
      );

  return (
    <div className="flex justify-around items-center border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 p-4 my-2">
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-600">Calories</span>
        <span className="text-lg font-semibold text-red-500">{Math.round(totals.totalCalories)} kcal</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-600">Protein</span>
        <span className="text-lg font-semibold text-blue-500">{Math.round(totals.totalProtein)}g</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-600">Carbs</span>
        <span className="text-lg font-semibold text-green-500">{Math.round(totals.totalCarbs)}g</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-600">Fats</span>
        <span className="text-lg font-semibold text-yellow-500">{Math.round(totals.totalFats)}g</span>
      </div>
    </div>
  );
};

export default DailyLogHeader;
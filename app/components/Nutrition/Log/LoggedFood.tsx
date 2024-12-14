import Image from "next/image";

export default function LoggedFood({ food }) {

    console.log(food);

    return (
      <div
        className={`w-full border-2 border-border p-4 relative bg-background-secondary hover:bg-background transition-all duration-300 rounded-lg shadow-sm`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl text-primary-text font-bold">{food?.name}</h2>
            <p className="text-sm text-secondary-text mt-2">
              <span className="font-semibold">Carbohydrates:</span> {food?.carbohydratesPerServe * food?.quantity / 100} g
            </p>
            <p className="text-sm text-secondary-text">
              <span className="font-semibold">Protein:</span> {food?.proteinPerServe * food?.quantity / 100} g
            </p>
            <p className="text-sm text-secondary-text">
              <span className="font-semibold">Fat:</span> {food?.fatPerServe * food?.quantity / 100} g
            </p>
            <p className="text-sm text-secondary-text">
              <span className="font-semibold">Calories:</span> {Math.round((food?.caloriesPerServe / 4.184) * food?.quantity / 100)} kcal
            </p>
            <p className="text-sm text-secondary-text mt-2">
              <span className="font-semibold">Amount Logged:</span> {food?.quantity} {food?.unit}
            </p>
          </div>
          {food?.image &&           
          <Image 
            src={food?.image}
            alt={food?.name}
            height={64}
            width={64}/>}
        </div>
      </div>
    );
  }
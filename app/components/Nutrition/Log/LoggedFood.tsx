import Image from "next/image";
import { TrashIcon } from "@heroicons/react/outline";

export default function LoggedFood({ food, onDelete }) {

    console.log(food);

    return (
      <div
        className={`w-full border-2 border-border p-4 relative bg-background-secondary hover:bg-background transition-all duration-300 rounded-lg shadow-sm`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl text-primary-text font-bold">{food?.name}</h2>
            <p className="text-sm text-secondary-text mt-2">
              <span className="font-semibold">Carbohydrates:</span> {food?.carbohydratesPer100 * food?.quantity / 100} g
            </p>
            <p className="text-sm text-secondary-text">
              <span className="font-semibold">Protein:</span> {food?.proteinPer100 * food?.quantity / 100} g
            </p>
            <p className="text-sm text-secondary-text">
              <span className="font-semibold">Fat:</span> {food?.fatPer100 * food?.quantity / 100} g
            </p>
            <p className="text-sm text-secondary-text">
              <span className="font-semibold">Energy:</span> {Math.round((food?.energyPer100) * food?.quantity / 100)} kj
            </p>
            <p className="text-sm text-secondary-text mt-2">
              <span className="font-semibold">Amount Logged:</span> {food?.quantity} {food?.unit}
            </p>
          </div>
          <div className="flex flex-col items-end justify-between h-full gap-8">
          <button onClick={onDelete}><TrashIcon className="h-7 w-7 text-primary-text hover:text-red-400 transition-all duration-300"/></button>

          {food?.image &&   
            <Image 
              src={food?.image}
              alt={food?.name}
              height={64}
              width={64}/>}
          </div>       
        </div>
      </div>
    );
  }
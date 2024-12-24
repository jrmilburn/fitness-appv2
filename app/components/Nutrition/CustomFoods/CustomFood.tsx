import { TrashIcon, PlusIcon } from "@heroicons/react/outline";

export default function CustomFood({ food, onAdd, onDelete, canDelete=false }) {

    console.log(food);

    return (
        <div className="w-full border-2 border-border p-4 flex justify-between gap-20 items-center bg-background-secondary">
            <div className="flex-grow">
                <h2 className="inter-bold text-xl text-primary-text">{food.name} <span className="opacity-60 text-sm text-secondary-text"><em>100g Serving</em></span></h2>
                <div className="flex flex-col w-full">
                    <p className="opacity-60 text-sm text-secondary-text flex justify-between">
                        <span>Carbohydrates:</span>
                        <span>{food.carbohydratesPer100}g</span>
                    </p>
                    <p className="opacity-60 text-sm text-secondary-text flex justify-between">
                        <span>Protein:</span>
                        <span>{food.proteinPer100}g</span>
                    </p>
                    <p className="opacity-60 text-sm text-secondary-text flex justify-between">
                        <span>Fat:</span>
                        <span>{food.fatPer100}g</span>
                    </p>
                    <p className="opacity-60 text-sm text-secondary-text flex justify-between">
                        <span>Calories:</span>
                        <span>{food.fatPer100 * 9 + food.proteinPer100 * 4 + food.carbohydratesPer100 * 4}</span>
                    </p>
                </div>
            </div>
            {!canDelete ? (
                <button onClick={onAdd}>
                    <PlusIcon className="h-7 w-7 text-primary-text hover:text-green-400 transition-all duration-300" />
                </button>
            ) : (
                <button onClick={onDelete}>
                    <TrashIcon className="h-7 w-7 text-primary-text hover:text-red-400 transition-all duration-300" />
                </button>
            )}
        </div>
    );
}
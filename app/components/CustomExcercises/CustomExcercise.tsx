import {
    TrashIcon
  } from "@heroicons/react/outline";

export default function CustomExcercise({ excercise, onDelete }) {

    console.log(excercise);

    return (
        <div className="w-full border-2 border-border p-4 flex justify-between items-center bg-background-secondary">
            <div className="">
                <h2 className="font-bold text-xl text-primary-text">{excercise.name}</h2>
                <p className="opacity-60 text-sm text-secondary-text">{excercise.muscleGroup.name}</p>
                <p className="opacity-60 text-sm text-secondary-text">{new Date(excercise.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="font-bold border-2 p-2 hover:bg-gray-100 rounded" onClick={onDelete}><TrashIcon className="h-6 w-6 text-primary-text" /></button>
        </div>
    )

}
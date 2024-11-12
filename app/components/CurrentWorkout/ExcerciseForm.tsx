export default function ExcerciseForm({ onDelete, onAdd, onReplace }) {

    return (

        <div className="flex flex-col bg-gray-50 border-2 z-50 w-full">

            <h2 className="text-lg px-2 py-2">Excercise</h2>
            <button className="text-lg bg-gray-100 w-full p-2 hover:bg-gray-200 text-left" onClick={onAdd}>Add Excercise</button>
            <button className="text-lg bg-gray-100 w-full p-2 hover:bg-gray-200 text-left" onClick={onReplace}>Replace Excercise</button>
            <button className="text-red-400 text-lg bg-gray-100 w-full p-2 hover:bg-gray-200 text-left" onClick={onDelete}>Remove Excercise</button>

        </div>

    )

}
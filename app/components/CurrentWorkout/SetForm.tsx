export default function SetForm({ onDelete, onAdd }) {

    return (

        <div className="flex flex-col bg-gray-50 border-2 z-50">

            <h2 className="text-lg px-2 py-2">Set</h2>
            <button className="text-lg bg-gray-100 w-full p-2 hover:bg-gray-200 text-left" onClick={onAdd}>Add Set</button>
            <button className="text-red-400 text-lg bg-gray-100 w-full p-2 hover:bg-gray-200 text-left" onClick={onDelete}>Remove Set</button>

        </div>

    )

}
export default function SetForm({ onDelete, onAdd }) {

    return (

        <div className="flex flex-col bg-background border-2 border-border text-primary-text z-50">

            <h2 className="text-lg px-2 py-2">Set</h2>
            <button className="text-lg bg-background w-full p-2 hover:bg-highlight text-left" onClick={onAdd}>Add Set</button>
            <button className="text-red-400 text-lg bg-background w-full p-2 hover:bg-highlight text-left" onClick={onDelete}>Remove Set</button>

        </div>

    )

}
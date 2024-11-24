export default function ExcerciseForm({ onDelete, onAdd, onReplace }) {

    return (

        <div className="flex flex-col bg-background border-2 border-border z-50 w-full text-primary-text">

            <h2 className="text-lg px-2 py-2">Excercise</h2>
            <button className="text-lg bg-background w-full p-2 hover:bg-highlight text-left" onClick={onAdd}>Add Excercise</button>
            <button className="text-lg bg-background w-full p-2 hover:bg-highlight text-left" onClick={onReplace}>Replace Excercise</button>
            <button className="text-red-400 text-lg bg-background w-full p-2 hover:bg-highlight text-left" onClick={onDelete}>Remove Excercise</button>

        </div>

    )

}
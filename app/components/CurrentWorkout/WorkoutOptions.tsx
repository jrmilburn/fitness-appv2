export default function WorkoutOptions({ onSkip }) {

    return (

        <div className="flex flex-col bg-gray-50 border-2 z-50 w-full">

            <h2 className="text-lg px-2 py-2">Workout</h2>
            <button className="text-lg bg-gray-100 w-full p-2 hover:bg-gray-200 text-left" onClick={onSkip}>Skip Workout</button>

        </div>

    )

}
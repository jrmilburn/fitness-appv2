export default function WorkoutOptions({ onSkip }) {

    return (

        <div className="flex flex-col bg-background border-2 border-border z-50 w-full">

            <h2 className="text-lg px-2 py-2 text-primary-text">Workout</h2>
            <button className="text-lg bg-background w-full p-2 hover:bg-highlight text-left text-primary-text" onClick={onSkip}>Skip Workout</button>

        </div>

    )

}
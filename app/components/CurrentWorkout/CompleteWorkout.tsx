export default function CompleteWorkout({ completed }) {

    console.log('COMPLETED: ', completed);

    return (
        <>
            {completed && (
                <button disabled={!completed} className={`w-full max-w-2xl text-lg font-bold text-background bg-foreground p-4 rounded hover:opacity-75 transition-all duration-300 fixed bottom-10`}>
                    Finish Workout
                </button> 
            )}
        </>

    )

}
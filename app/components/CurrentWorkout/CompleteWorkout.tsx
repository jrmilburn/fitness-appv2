export default function CompleteWorkout({ completed, workout, setWorkout }) {
    console.log('COMPLETED: ', completed);
    console.log('WORKOUT: ', workout);
    
    const handleFinish = async () => {  
        setWorkout({ ...workout, completed: true }); 
        const response = await fetch(`http://localhost:3000/api/workouts/finish/${workout.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify({
                weekId: workout.weekId
            })
        });
        console.log(response);
    }

    if (workout.completed) {
        return (
            <>
            <h2>Workout Completed</h2>
            <button className="w-full max-w-2xl text-lg font-bold text-background bg-foreground p-4 rounded hover:opacity-75 transition-all duration-300 fixed bottom-10">
                View Current Workout
            </button>
            </>
        )
    }

    return (
        <>
            {completed && ( 
                <button 
                    onClick={handleFinish} 
                    className="w-full max-w-2xl text-lg font-bold text-background bg-foreground p-4 rounded hover:opacity-75 transition-all duration-300 fixed bottom-10"
                >
                    Finish Workout
                </button> 
            )}
        </>
    );
}
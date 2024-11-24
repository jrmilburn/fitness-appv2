export default function Workouts({ shown, onClose, weeks, setProgram, setWorkout }) {

    console.log('WEEKS: ', weeks);

    const handleSetProgram = (weekId, workoutId) => {
        setProgram((prev) => {

          const updatedWeeks = prev.weeks.map((week) =>
            week.id === weekId
              ? { ...week, currentWorkoutId: workoutId }
              : week
          );
      
          // Find the week and the current workout object
          const currentWeek = updatedWeeks.find((week) => week.id === weekId);
          const currentWorkout = currentWeek.workouts.find((workout) => workout.id === workoutId);
      
          // Update the program and set the workout
          setWorkout(currentWorkout); // Set the workout state to the current workout object
      
          return {
            ...prev,
            currentWeekId: weekId,
            weeks: updatedWeeks
          };
        });
        onClose();
      };


    return (
        <>
            {shown && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-background rounded-lg shadow-lg flex flex-col p-6 items-center">
                    <h2 className="text-secondary-text">Week</h2>

                    <div className="space-x-2 flex">
                    {weeks
                        ?.sort((a, b) => a.weekNo - b.weekNo) // Sort weeks by weekNo from lowest to highest
                        .map((week) => (
                          <div key={week.id} className="flex flex-col space-y-2">
                            <h2 className="text-secondary-text text-center">{week.weekNo}</h2>
                        
                            {week.workouts?.sort((a,b) => a.workoutNo - b.workoutNo)
                            .map((workout) => (
                              <div key={workout.id} className="w-12 h-12 bg-background border-2 border-border flex items-center justify-center">
                                <button
                                  className="w-full h-full hover:bg-highlight transition-all duration-300"
                                  onClick={() => handleSetProgram(week.id, workout.id)}
                                >
                                  {workout.workoutNo}
                                </button>
                              </div>
                            ))}
                          </div>
                        ))}

                    </div>
                    <button onClick={onClose} className="mt-4 p-2 bg-secondary-text text-black rounded w-full hover:bg-gray-200">
                            Close
                    </button>
                    </div>
                </div>
            )}
        </>
    );
}
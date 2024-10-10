export default function WorkoutSelect({ handleSelect, workoutDay, workoutShown }) {
    return (
        <button 
            className={`px-6 py-3 rounded-full text-lg font-medium transition-all transform ${
                workoutShown === workoutDay - 1 
                    ? 'bg-foreground text-white scale-105 shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:scale-105'
            }`}
            onClick={() => handleSelect(workoutDay)}
        >
            Day {workoutDay}
        </button>
    );
}
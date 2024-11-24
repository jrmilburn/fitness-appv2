export default function ProgramExcercise({ excercise, muscleGroup }) {
    return (
        <div className="bg-background shadow rounded-lg p-4 w-full space-y-2">
            {/* Muscle Group Title */}
            <h2 className='text-sm font-semibold text-text-secondary'>{muscleGroup?.name}</h2>

            {/* Exercise Name */}
            <p className="text-lg font-medium text-text-primary">{excercise.name}</p>

            {/* Set Count */}
            <p className="text-sm text-text-secondary">Sets: {excercise.sets.length}</p>
        </div>
    );
}
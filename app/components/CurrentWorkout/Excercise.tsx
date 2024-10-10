import Set from './Set'

export default function Excercise( {excercise} ) {

    return (
        <div className="w-[100%] mx-auto bg-gray-200 p-8">
            <p className="opacity-50 p-1">{excercise.MuscleGroup.name}</p>
            <h2 className='font-bold text-xl p-1'>{excercise.name}</h2>
            <div className=' w-[60%] flex justify-between mx-8 my-2'>
                <h2>Weight</h2>
                <h2>Reps</h2>
            </div>
            {excercise.sets.map((set, index) => (
                <Set key={index} setId={set.id} />
            ))}
        </div>
    )

}
export default function WorkoutHeader({ selectWorkout, weekNumber }) {

    return (
        <div className="w-[100%] mx-auto bg-gray-200 p-4">
            <div className=' w-[100%] flex justify-between p-2'>
                <div>
                    <p className="font-sm opacity-50">Whole Body</p>
                    <h2 className="text-xl">Week {weekNumber} Day 1</h2>
                </div>
                <div className="flex flex-col justify-end">
                    <button className="w-8 h-8 bg-black" onClick={selectWorkout} ></button>
                </div>
            </div>
        </div>
    )

}
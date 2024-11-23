import { useState, useEffect } from 'react';
import { AiOutlineCalendar } from 'react-icons/ai'; // Aesthetic Calendar Icon
import Workouts from './Workouts';

export default function WorkoutHeader({ weekId, name, setWorkout, week, setWeek }) {
    interface ProgramWorkouts {
        weeks: Week[];
    }

    interface Week {
        weekNo: number;
    }

    const [programWorkouts, setProgramWorkouts] = useState<ProgramWorkouts | null>(null);
    const [workoutSelect, setWorkoutSelect] = useState(false);

    // Fetch the week data based on the weekId
    useEffect(() => {
        if (weekId) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/weeks/${weekId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setWeek(data);
                console.log('Week data:', data);
            })
            .catch(err => console.error('Failed to fetch week data', err));
        }
    }, [weekId, setWeek]);

    // Fetch the program workouts when the `week` is set
    useEffect(() => {
        if (week?.programId) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/program/${week.programId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setProgramWorkouts(data);
                console.log('Program workouts:', data);
            })
            .catch(err => console.error('Failed to fetch program workouts', err));
        }
    }, [week]);

    const selectWorkout = (e) => {
        e.preventDefault();
        setWorkoutSelect(true);
    };

    const handleClose = () => {
        setWorkoutSelect(false);
    };

    return (
        <div className="w-[100%] max-w-screen-sm mx-auto bg-gray-200 p-4">
            <div className="w-[100%] flex justify-between p-2">
                <div>
                    <p className="font-sm opacity-50">Whole Body</p>
                    <h2 className="text-xl">Week {week?.weekNo} {name}</h2>
                </div>
                <div className="flex flex-col justify-end">
                    <button
                        className="w-8 h-8 hover:scale-105 transition-all duration-300"
                        onClick={selectWorkout}
                    >
                        <AiOutlineCalendar className="w-8 h-8 text-black hover:text-blue-700 transition-all duration-300" />
                        {/* React-Icons Calendar */}
                    </button>
                </div>
            </div>
            {workoutSelect && (
                <Workouts
                    shown={workoutSelect}
                    onClose={handleClose}
                    weeks={programWorkouts?.weeks ?? []}
                    setProgram={setProgramWorkouts}
                    setWorkout={setWorkout}
                />
            )}
        </div>
    );
}

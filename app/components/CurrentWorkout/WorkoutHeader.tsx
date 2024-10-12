import { useState, useEffect } from 'react';
import Image from 'next/image';
import calendarIcon from '../../assets/edit-calendar.svg';
import Workouts from './Workouts';

export default function WorkoutHeader({ weekId, name, setWorkout, week, setWeek }) {
    const [programWorkouts, setProgramWorkouts] = useState({});
    const [workoutSelect, setWorkoutSelect] = useState(false);

    // Fetch the week data based on the weekId
    useEffect(() => {
        if (weekId) {
            fetch(`http://localhost:3000/api/weeks/${weekId}`, {
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
    }, [weekId]);

    // Fetch the program workouts when the `week` is set
    useEffect(() => {
        if (week?.programId) {
            fetch(`http://localhost:3000/api/program/${week.programId}`, {
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

    console.log('PROGRAM WORKOUTS: ', programWorkouts);

    return (
        <div className="w-[100%] max-w-2xl mx-auto bg-gray-200 p-4">
            <div className="w-[100%] flex justify-between p-2">
                <div>
                    <p className="font-sm opacity-50">Whole Body</p>
                    <h2 className="text-xl">Week {week?.weekNo} {name}</h2>
                </div>
                <div className="flex flex-col justify-end">
                    <button className="w-8 h-8 hover:scale-105 transition-all duration-300" onClick={selectWorkout}>
                        <Image
                            priority
                            src={calendarIcon}
                            alt="Choose current workout"
                        />
                    </button>
                </div>
            </div>
            {workoutSelect && (
                <Workouts
                    shown={workoutSelect}
                    onClose={handleClose}
                    weeks={programWorkouts?.weeks}
                    setProgram={setProgramWorkouts}
                    setWorkout={setWorkout}
                />
            )}
        </div>
    );
}
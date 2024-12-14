import { useState, useEffect, useRef } from 'react';
import { AiOutlineCalendar } from 'react-icons/ai'; // Aesthetic Calendar Icon
import Workouts from './Workouts';
import horieditIcon from '../../assets/edit-hori.svg';
import Image from 'next/image';
import WorkoutOptions from './WorkoutOptions';
import Loader from '../Loader';

export default function WorkoutHeader({ weekId, name, setWorkout, workout, week, setWeek, disabled=false }) {
    interface ProgramWorkouts {
        weeks: Week[];
        name: string;
    }

    interface Week {
        weekNo: number;
    }

    const [programWorkouts, setProgramWorkouts] = useState<ProgramWorkouts | null>(null);
    const [workoutSelect, setWorkoutSelect] = useState(false);
    const [workoutOptionsShown, setWorkoutOptionsShown] = useState(false);
    const [loading, setLoading] = useState(false);

    const formRef = useRef(null);

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
        setLoading(true);
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
            setLoading(false);

            })
            .catch(err => console.error('Failed to fetch program workouts', err));
        }
    }, [week]);

    useEffect(() => {
        if (workoutOptionsShown) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [workoutOptionsShown]);

    const selectWorkout = (e) => {
        e.preventDefault();
        setWorkoutSelect(true);
    };

    const handleClose = () => {
        setWorkoutSelect(false);
    };

    const onSkip = async () => {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workouts/skip/${workout.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'appliction/json'
            },
            body: JSON.stringify({
                status: true,
                weekId: weekId
            })
        }
        )

        if(response.ok) {
            const newWorkoutResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL!}/api/workouts/current`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const newWorkout = await newWorkoutResponse.json();
            setWorkout(newWorkout.workout);
        }

    }

    const handleWorkoutOptions = () => {
        setWorkoutOptionsShown(true)
    }

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
          setWorkoutOptionsShown(false);
        }
      };

    return (
        <div className="w-[100%] max-w-screen-sm mx-auto border-2 border-border bg-background-secondary p-4">
            <div className="w-[100%] flex justify-between p-2">
                <div>
                    <p className="font-sm text-secondary-text">{loading ? <Loader /> : programWorkouts?.name}</p>
                    <h2 className="text-xl text-primary-text">{loading ? <Loader /> : 'Week ' + week?.weekNo} {loading ? <Loader /> : name}</h2>
                    {workout.skipped && (
                    <p className='font-sm text-background p-2 bg-highlight'>Skipped</p>
                    )}
                </div>
                <div className="flex flex-col justify-end h-full gap-2">
                    <button className='hover:scale-105 transition-all duration-300' onClick={handleWorkoutOptions} disabled={disabled}>
                        <Image 
                            src={horieditIcon}
                            alt='more'
                            />
                    </button>
                    <button
                        className="w-8 h-8 hover:scale-105 transition-all duration-300"
                        onClick={selectWorkout}
                    >
                        <AiOutlineCalendar className="w-8 h-8 text-primary-text hover:text-secondary-text transition-all duration-300" />
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
            {workoutOptionsShown && (
                <div ref={formRef} className='absolute top-[5%] translate-x-[100%] translate-y-[50%] sm:translate-y-[0%] sm:translate-x-[200%] z-50 w-[175px]'>
                    <WorkoutOptions 
                        onSkip={onSkip}
                    />
                </div>

            )}
        </div>
    );
}

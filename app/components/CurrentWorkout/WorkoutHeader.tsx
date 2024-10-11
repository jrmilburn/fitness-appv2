import { useState, useEffect } from 'react'
import Image from 'next/image'
import calendarIcon from '../../assets/edit-calendar.svg'

export default function WorkoutHeader({ weekId, name }) {

    const [week, setWeek] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/weeks/${weekId}`, {
            method: 'GET',
            headers: {

                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setWeek(data)
            console.log(data);
        })
    }, [])

    const selectWorkout = () => {

    }

    return (
        <div className="w-[100%] max-w-2xl mx-auto bg-gray-200 p-4">
            <div className=' w-[100%] flex justify-between p-2'>
                <div>
                    <p className="font-sm opacity-50">Whole Body</p>
                    <h2 className="text-xl">Week {week?.weekNo} {name}</h2>
                </div>
                <div className="flex flex-col justify-end">
                    <button className="w-8 h-8 hover:scale-105 transition-all duration-300" onClick={selectWorkout} >
                    <Image
                      priority
                      src={calendarIcon}
                      alt="Choose current workout"
                    />
                    </button>
                </div>
            </div>
        </div>
    )

}
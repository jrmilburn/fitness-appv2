"use client";

import Programlength from '../components/CreateProgram/Programlength';
import Programexcercises from '../components/CreateProgram/Programexcercises';
import PreviousPrograms from '../components/CreateProgram/Previousprograms';
import ProgramTemplates from '../components/CreateProgram/Programtemplates';
import { useState } from 'react';
import Link from 'next/link';
import { ClipboardListIcon } from '@heroicons/react/outline';
import { LightningBoltIcon } from '@heroicons/react/solid';


export default function CreateProgram() {

    const [formPage, setFormPage] = useState(0);

    const [program, setProgram] = useState({
        name: "",
        length: 0,
        days: 0,
        weeks: [] // Initialize weeks as an empty array
      });

    const onNext = (increment) => {
        setFormPage((prevPage) => prevPage + increment);
    };

    const onPrevious = (increment) => {
        setFormPage((prevPage) => prevPage - increment);
    }

    return (
        <main className="w-full h-100% pb-20 sm:pb-0 flex items-baseline">

            <div className="flex space-x-4 my-4 justify-center">
              <Link 
                href="/workouts/current" 
                className="flex items-center px-4 py-2 bg-highlight text-white rounded-md"
              >
                <LightningBoltIcon className="h-5 w-5 mr-2" />
                Current Workout
              </Link>
              <Link 
                href="/programs" 
                className="flex items-center px-4 py-2 bg-highlight text-white rounded-md"
              >
                <ClipboardListIcon className="h-5 w-5 mr-2" />
                View Programs
              </Link>
            </div>

            {formPage === 0 ? (
                <div className='flex flex-col space-y-4 w-full'>
                    <PreviousPrograms setProgram={setProgram} onNext={onNext} />
                    <ProgramTemplates setProgram={setProgram} onNext={onNext} />
                </div>
            ) : formPage === 1 ? (
                <div className='flex flex-col space-y-4 w-full'>
                    <Programlength setProgram={setProgram} onNext={() => onNext(1)} onPrevious={() => onPrevious(1)}/>
                </div>
                ) : (
                <Programexcercises 
                    program={program} 
                    setProgram={setProgram} 
                    type={0} 
                    onPrevious={() => onPrevious(2)}
                />
                )}
            
        </main>
    )
}
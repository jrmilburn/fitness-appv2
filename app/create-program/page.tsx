"use client";

import Programlength from '../components/CreateProgram/Programlength';
import Programexcercises from '../components/CreateProgram/Programexcercises';
import PreviousPrograms from '../components/CreateProgram/Previousprograms';
import ProgramTemplates from '../components/CreateProgram/Programtemplates';
import { useState } from 'react';

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
        <main className="w-full h-[100%] flex items-baseline">

            {formPage === 0 ? (
                <div className='flex flex-col space-y-4 w-full h-screen overflow-y-auto'>
                    <PreviousPrograms setProgram={setProgram} onNext={onNext} />
                    <ProgramTemplates setProgram={setProgram} onNext={onNext} />
                </div>
            ) : formPage === 1 ? (
                <div className='flex flex-col space-y-4 w-full h-screen overflow-y-auto'>
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